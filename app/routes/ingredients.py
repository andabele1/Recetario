from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.models import Ingredient, IngredientPackage
from schemas.schemas import IngredientCreate, IngredientResponse

router = APIRouter(prefix="/ingredients", tags=["Ingredients"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@router.post("/")
@router.post("/", response_model=IngredientResponse)
def create_ingredient(data: IngredientCreate, db: Session = Depends(get_db)):

    # 🔥 crear ingrediente
    ingredient = Ingredient(
        name=data.name,
        base_unit=data.base_unit,
        available_quantity=data.available_quantity,
        total_cost=data.total_cost
    )

    db.add(ingredient)
    db.commit()
    db.refresh(ingredient)

    # 🔥 CREAR PACKAGE AUTOMÁTICO
    package = IngredientPackage(
        ingredient_id=ingredient.id,
        package_quantity=data.available_quantity,
        package_cost=data.total_cost
    )

    db.add(package)
    db.commit()

    return ingredient

@router.get("/")
def get_ingredients(db: Session = Depends(get_db)):
    return db.query(Ingredient).all()

@router.get("/{ingredient_id}")
def get_ingredient(ingredient_id: int, db: Session = Depends(get_db)):

    ingredient = db.query(Ingredient).filter(
        Ingredient.id == ingredient_id
    ).first()

    if not ingredient:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")

    return ingredient

@router.put("/{ingredient_id}")
def update_ingredient(
    ingredient_id: int,
    ingredient: IngredientCreate,
    db: Session = Depends(get_db)
):

    db_ingredient = db.query(Ingredient).filter(
        Ingredient.id == ingredient_id
    ).first()

    if not db_ingredient:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")

    db_ingredient.name = ingredient.name
    db_ingredient.base_unit = ingredient.base_unit

    db.commit()

    return {"message": "Ingrediente actualizado"}

@router.delete("/{ingredient_id}")
def delete_ingredient(ingredient_id: int, db: Session = Depends(get_db)):
    ing = db.query(Ingredient).filter(Ingredient.id == ingredient_id).first()

    if not ing:
        raise HTTPException(status_code=404, detail="No existe")

    db.delete(ing)
    db.commit()

    return {"message": "Eliminado"}