from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.models import Ingredient
from app.schemas.schemas import IngredientCreate

router = APIRouter(prefix="/ingredients", tags=["Ingredients"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
        
@router.post("/ingredients")
def create_ingredient(ingredient: IngredientCreate, db: Session = Depends(get_db)):
    
    ingredient.name = ingredient.name.lower().strip()

    # Validar duplicado por nombre
    existing = db.query(Ingredient).filter(
        Ingredient.name == ingredient.name
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Ingrediente ya existe")

    new_ingredient = Ingredient(
        name=ingredient.name,
        base_unit=ingredient.base_unit
    )

    db.add(new_ingredient)
    db.commit()
    db.refresh(new_ingredient)

    return new_ingredient

@router.get("/ingredients")
def get_ingredients(db: Session = Depends(get_db)):
    return db.query(Ingredient).all()

@router.get("/ingredients/{ingredient_id}")
def get_ingredient(ingredient_id: int, db: Session = Depends(get_db)):

    ingredient = db.query(Ingredient).filter(
        Ingredient.id == ingredient_id
    ).first()

    if not ingredient:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")

    return ingredient

@router.put("/ingredients/{ingredient_id}")
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

@router.delete("/ingredients/{ingredient_id}")
def delete_ingredient(ingredient_id: int, db: Session = Depends(get_db)):

    ingredient = db.query(Ingredient).filter(
        Ingredient.id == ingredient_id
    ).first()

    if not ingredient:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")

    db.delete(ingredient)
    db.commit()

    return {"message": "Ingrediente eliminado"}