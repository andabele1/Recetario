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

from pydantic import BaseModel

class IngredientBase(BaseModel):
    name: str
    base_unit: str
    available_quantity: float
    total_cost: float

class IngredientCreate(IngredientBase):
    pass

class IngredientResponse(IngredientBase):
    id: int

    class Config:
        from_attributes = True