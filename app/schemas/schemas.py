from pydantic import BaseModel
from typing import List

# ------------------------
# SCHEMAS PARA RECETAS
# ------------------------

class RecipeIngredientCreate(BaseModel):
    ingredient_id: int
    quantity: float


class RecipeCreate(BaseModel):
    name: str
    description: str
    servings: int
    ingredients: List[RecipeIngredientCreate]

    
# ------------------------
# SCHEMAS PARA INGREDSIENTES
# ------------------------     

class IngredientCreate(BaseModel):
    name: str
    base_unit: str


class IngredientResponse(BaseModel):
    id: int
    name: str
    base_unit: str

    class Config:
        from_attributes = True