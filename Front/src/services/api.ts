import { type Ingredient, type Recipe, type RecipeCost } from "../types/types";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const getRecipes = async (): Promise<Recipe[]> => {
  const res = await fetch(`${API_URL}/recipes`);
  return res.json();
};

export const getRecipeById = async (id: number): Promise<Recipe> => {
  const res = await fetch(`${API_URL}/recipes/${id}`);
  return res.json();
};

export const getRecipeCost = async (
  id: number,
  servings: number,
  margin: number
): Promise<RecipeCost> => {
  const res = await fetch(
    `${API_URL}/recipes/${id}/cost?servings=${servings}&margin=${margin}`
  );
  return res.json();
};

export const createRecipe = async (data: any) => {
  const res = await fetch(`${API_URL}/recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteRecipe = async (id: number) => {
  const res = await fetch(`${API_URL}/recipes/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Error al eliminar receta");
  }
};


export const getIngredients = async (): Promise<Ingredient[]> => {
  const res = await fetch(`${API_URL}/ingredients/`);
  return res.json();
};

export const updateRecipe = async (id: number, data: any) => {
  const res = await fetch(`${API_URL}/recipes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    console.error("ERROR BACK:", error);
    throw new Error("Error al actualizar receta");
  }

  return res.json();
};

export const createIngredient = async (data: {
  name: string;
  base_unit: string;
  available_quantity: number;
  total_cost: number;
}): Promise<Ingredient> => {
  const res = await fetch(`${API_URL}/ingredients/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const deleteIngredient = async (id: number) => {
  await fetch(`${API_URL}/ingredients/${id}`, {
    method: "DELETE",
  });
};

export const updateIngredient = async (
  id: number,
  data: {
    name: string;
    base_unit: string;
    available_quantity: number;
    total_cost: number;
  }
) => {
  const res = await fetch(`${API_URL}/ingredients/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error al actualizar ingrediente");

  return res.json();
};

export const uploadImage = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/upload/`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Error subiendo imagen");
  }

  return res.json();
};
