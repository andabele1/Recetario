export interface Ingredient {
  id: number;
  name: string;
  base_unit: string;
  available_quantity: number;
  total_cost: number;
}

export interface RecipeIngredient {
  ingredient_id: number;
  name?: string;
  quantity: number;
  unit?: string;
}

export interface Recipe {
  id: number;
  name: string;
  instructions: string;
  servings: number;
  ingredients: RecipeIngredient[];
  short_description: string;
  image_url: string;
}

export interface RecipeCost {
  recipe: string;
  target_servings: number;
  total_cost: number;
  cost_per_serving: number;
  total_price: number;
  price_per_serving: number;
}