import os
import shutil
from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.models import Recipe, RecipeIngredient
from app.schemas.schemas import RecipeCreate
from sqlalchemy.orm import joinedload
from math import ceil
from app.models.models import Ingredient

router = APIRouter()

# Dependency DBs
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
#------------------------       
# RUTAS DE RECETAS
#------------------------

@router.post("/recipes")
def create_recipe(recipe: RecipeCreate, db: Session = Depends(get_db)):

    # 🔥 VALIDAR ANTES DE TOCAR LA DB
    ids = [i.ingredient_id for i in recipe.ingredients]
    if len(ids) != len(set(ids)):
        raise HTTPException(status_code=400, detail="Ingredientes duplicados")

    try:
        # Crear receta
        new_recipe = Recipe(
            name=recipe.name,
            servings=recipe.servings,
            short_description=recipe.short_description,
            image_url=recipe.image_url
        )
        db.add(new_recipe)
        db.flush()  # 👈 clave (no commit aún)

        # Crear ingredientes
        for ing in recipe.ingredients:
            db_ing = RecipeIngredient(
                recipe_id=new_recipe.id,
                ingredient_id=ing.ingredient_id,
                quantity=ing.quantity,
            )
            db.add(db_ing)

        # 🔥 TODO OK → ahora sí guardar
        db.commit()

        return {"message": "Recipe created", "recipe_id": new_recipe.id}

    except Exception as e:
        db.rollback()  # 🔥 revierte TODO
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recipes")
def get_recipes_full(db: Session = Depends(get_db)):
    recipes = db.query(Recipe).all()

    result = []

    for recipe in recipes:
        ingredients_list = []

        for ri in recipe.ingredients:
            ingredients_list.append({
                "ingredient_id": ri.ingredient_id,
                "name": ri.ingredient.name,
                "quantity": float(ri.quantity),
                "unit": ri.ingredient.base_unit
            })

        result.append({
            "id": recipe.id,
            "name": recipe.name,
            "servings": recipe.servings,
            "short_description": recipe.short_description,
            "image_url": recipe.image_url,
            "ingredients": ingredients_list
        })

    return result

@router.get("/recipes/{recipe_id}")
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = (
        db.query(Recipe)
        .options(
            joinedload(Recipe.ingredients)
            .joinedload(RecipeIngredient.ingredient)
        )
        .filter(Recipe.id == recipe_id)
        .first()
    )

    if not recipe:
        raise HTTPException(status_code=404, detail="Receta no encontrada")

    return recipe
    
@router.put("/recipes/{recipe_id}")
def update_recipe(recipe_id: int, data: RecipeCreate, db: Session = Depends(get_db)):

    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()

    if not recipe:
        raise HTTPException(status_code=404, detail="Receta no encontrada")

    # 🚫 validar duplicados
    ids = [i.ingredient_id for i in data.ingredients]
    if len(ids) != len(set(ids)):
        raise HTTPException(status_code=400, detail="Ingredientes duplicados")

    # 🔥 actualizar campos base
    recipe.name = data.name
    recipe.short_description = data.short_description
    recipe.servings = data.servings
    recipe.instructions = data.instructions
    recipe.image_url = data.image_url

    # 🔥 borrar ingredientes actuales
    db.query(RecipeIngredient).filter(
        RecipeIngredient.recipe_id == recipe_id
    ).delete()

    # 🔥 insertar nuevos
    for ing in data.ingredients:
        new_ing = RecipeIngredient(
            recipe_id=recipe.id,
            ingredient_id=ing.ingredient_id,
            quantity=ing.quantity
        )
        db.add(new_ing)

    db.commit()
    db.refresh(recipe)

    return recipe

@router.get("/recipes/{recipe_id}/cost")
def calculate_recipe_cost(
    recipe_id: int,
    servings: int = Query(None),
    margin: float = Query(0.3),  # 👈 30% por defecto
    db: Session = Depends(get_db)
):

    recipe = db.query(Recipe).options(
        joinedload(Recipe.ingredients)
        .joinedload(RecipeIngredient.ingredient)
        .joinedload(Ingredient.packages)
    ).filter(Recipe.id == recipe_id).first()

    if not recipe:
        raise HTTPException(status_code=404, detail="Receta no encontrada")

    target_servings = servings if servings else recipe.servings

    if target_servings <= 0:
        raise HTTPException(status_code=400, detail="Porciones inválidas")

    if margin < 0:
        raise HTTPException(status_code=400, detail="Margen inválido")

    factor = target_servings / recipe.servings

    total_cost = 0
    ingredients_result = []

    for ri in recipe.ingredients:

        ingredient = ri.ingredient
        package = ingredient.packages[0] if ingredient.packages else None

        if not package:
            raise HTTPException(
                status_code=400,
                detail=f"Ingrediente {ingredient.name} no tiene paquete definido"
            )

        scaled_quantity = float(ri.quantity) * factor
        package_quantity = float(package.package_quantity)
        package_cost = float(package.package_cost)

        packages_needed = ceil(scaled_quantity / package_quantity)
        cost = packages_needed * package_cost

        total_cost += cost

        ingredients_result.append({
            "name": ingredient.name,
            "scaled_quantity": scaled_quantity,
            "unit": ingredient.base_unit,
            "packages_needed": packages_needed,
            "cost": cost
        })

    # 🔥 COSTOS
    cost_per_serving = total_cost / target_servings

    # 🔥 PRECIO DE VENTA
    total_price = total_cost * (1 + margin)
    price_per_serving = total_price / target_servings

    return {
        "recipe": recipe.name,
        "target_servings": target_servings,

        "total_cost": total_cost,
        "cost_per_serving": cost_per_serving,

        "margin": margin,

        "total_price": total_price,
        "price_per_serving": price_per_serving,

        "ingredients": ingredients_result
    }
    
@router.delete("/recipes/{recipe_id}")
def delete_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()

    if not recipe:
        raise HTTPException(status_code=404, detail="Receta no encontrada")

    db.delete(recipe)
    db.commit()

    return {"message": "Receta eliminada"}