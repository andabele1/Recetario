from sqlalchemy import Column, Integer, String, ForeignKey, Numeric, Text
from sqlalchemy.orm import relationship
from app.db.database import Base

class Ingredient(Base):
    __tablename__ = "ingredients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    base_unit = Column(String, nullable=False)
    packages = relationship("IngredientPackage", back_populates="ingredient")


class IngredientPackage(Base):
    __tablename__ = "ingredient_packages"

    id = Column(Integer, primary_key=True, index=True)
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"))
    package_quantity = Column(Numeric, nullable=False)
    package_cost = Column(Numeric, nullable=False)

    ingredient = relationship("Ingredient")


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    servings = Column(Integer, nullable=False)

    ingredients = relationship("RecipeIngredient", cascade="all, delete")


class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"

    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id"))
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"))
    quantity = Column(Numeric, nullable=False)

    ingredient = relationship("Ingredient")