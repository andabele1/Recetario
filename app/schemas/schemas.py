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
    description: str | None = None
    servings: int
    instructions: str
    image_url: str | None = None
    ingredients: List[RecipeIngredientCreate]
    
class RecipeIngredientResponse(BaseModel):
    ingredient_id: int
    quantity: float

    class Config:
        from_attributes = True


class RecipeResponse(BaseModel):
    id: int
    name: str
    short_description: str
    instructions: str
    image_url: str
    servings: int
    ingredients: List[RecipeIngredientResponse]

    class Config:
        from_attributes = True

    
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