from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.models import Recipe, RecipeIngredient
from app.schemas.schemas import RecipeCreate
from sqlalchemy.orm import joinedload

router = APIRouter()

# Dependency DB
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
            description=recipe.description,
            servings=recipe.servings
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
    recipes = db.query(Recipe).options(
        joinedload(Recipe.ingredients).joinedload(RecipeIngredient.ingredient)
    ).all()

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
            "description": recipe.description,
            "servings": recipe.servings,
            "ingredients": ingredients_list
        })

    return result

from fastapi import HTTPException
from sqlalchemy.orm import joinedload

@router.get("/recipes/{recipe_id}")
def get_recipe_by_id(recipe_id: int, db: Session = Depends(get_db)):

    recipe = db.query(Recipe).options(
        joinedload(Recipe.ingredients).joinedload(RecipeIngredient.ingredient)
    ).filter(Recipe.id == recipe_id).first()

    # ❌ Si no existe
    if not recipe:
        raise HTTPException(status_code=404, detail="Receta no encontrada")

    # ✅ Construir respuesta
    ingredients_list = []

    for ri in recipe.ingredients:
        ingredients_list.append({
            "ingredient_id": ri.ingredient_id,
            "name": ri.ingredient.name,
            "quantity": float(ri.quantity),
            "unit": ri.ingredient.base_units
        })

    return {
        "id": recipe.id,
        "name": recipe.name,
        "description": recipe.description,
        "servings": recipe.servings,
        "ingredients": ingredients_list
    }
    
@router.put("/recipes/{recipe_id}")
def update_recipe(recipe_id: int, recipe: RecipeCreate, db: Session = Depends(get_db)):

    # 🔍 Buscar receta
    db_recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()

    if not db_recipe:
        raise HTTPException(status_code=404, detail="Receta no encontrada")

    # 🔥 VALIDACIÓN DE DUPLICADOS
    ids = [i.ingredient_id for i in recipe.ingredients]
    if len(ids) != len(set(ids)):
        raise HTTPException(status_code=400, detail="Ingredientes duplicados")

    try:
        # ✏️ Actualizar campos (puedes quitar name si quieres bloquearlo)
        db_recipe.name = recipe.name
        db_recipe.description = recipe.description
        db_recipe.servings = recipe.servings

        # 🧹 Borrar ingredientes actuales
        db.query(RecipeIngredient).filter(
            RecipeIngredient.recipe_id == recipe_id
        ).delete()

        # ➕ Insertar nuevos ingredientes
        for ing in recipe.ingredients:
            new_ing = RecipeIngredient(
                recipe_id=recipe_id,
                ingredient_id=ing.ingredient_id,
                quantity=ing.quantity
            )
            db.add(new_ing)

        # 💾 Guardar todo
        db.commit()

        return {"message": "Receta actualizada"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))