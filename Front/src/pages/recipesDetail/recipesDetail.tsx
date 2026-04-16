import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRecipeById, getRecipeCost } from "../../services/api";
import { type Recipe, type RecipeCost } from "../../types/types";

export default function RecipeDetail() {
  const { id } = useParams();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [cost, setCost] = useState<RecipeCost | null>(null);

  const [servings, setServings] = useState<number>(1);
  const [margin, setMargin] = useState<number>(0.3);

  useEffect(() => {
    if (id) {
      getRecipeById(Number(id)).then((data) => {
        setRecipe(data);
        setServings(data.servings);
      });
    }
  }, [id]);

  const calculate = async () => {
    if (!id) return;
    const data = await getRecipeCost(Number(id), servings, margin);
    setCost(data);
  };

  if (!recipe) return <p>Cargando...</p>;

  return (
    <div>
      <h1>{recipe.name}</h1>
      <p>{recipe.description}</p>

      <h3>Ingredientes</h3>
      {recipe.ingredients.map((ing, i) => (
        <div key={i}>
          {ing.name} - {ing.quantity} {ing.unit}
        </div>
      ))}

      <hr />

      <input
        type="number"
        value={servings}
        onChange={(e) => setServings(Number(e.target.value))}
      />

      <input
        type="number"
        step="0.1"
        value={margin}
        onChange={(e) => setMargin(Number(e.target.value))}
      />

      <button onClick={calculate}>Calcular</button>

      {cost && (
        <div>
          <p>Total costo: {cost.total_cost}</p>
          <p>Precio total: {cost.total_price}</p>
        </div>
      )}
    </div>
  );
}