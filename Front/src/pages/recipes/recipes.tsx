import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecipes } from "../../services/api";
import { type Recipe } from "../../types/types";

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    getRecipes().then(setRecipes);
  }, []);

  return (
    <div>
      <h1>Recetas</h1>

      <Link to="/recipes/new">➕ Nueva receta</Link>

      {recipes.map((r) => (
        <div key={r.id}>
          <h3>{r.name}</h3>
          <p>{r.description}</p>
          <p>Porciones: {r.servings}</p>

          <Link to={`/recipes/${r.id}`}>Ver detalle</Link>
        </div>
      ))}
    </div>
  );
}