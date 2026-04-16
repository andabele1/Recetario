import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "../../components/RecipeCard/RecipeCard";
import { getRecipes } from "../../services/api";
import { type Recipe } from "../../types/types";
import "./Recipes.css";

export default function Recipes() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    const data = await getRecipes();
    setRecipes(data);
  };

  const filteredRecipes = recipes.filter((r) => {
  const text = search.toLowerCase();

  const matchName = r.name.toLowerCase().includes(text);

  const matchIngredients = r.ingredients?.some((ing) =>
    ing.name?.toLowerCase().includes(text)
  );

  return matchName || matchIngredients;
});

  return (
    <div className={"container"}>
      <div className={"header"}>
        <h1 className={"title"}>RECETAS</h1>

        <button
          className={"button"}
          onClick={() => navigate("/ingredients")}
        >
          Ingredientes
        </button>

      </div>

      <div className={"topBar"}>
        <input
          className="search"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={"grid"}>
        {filteredRecipes.map((r) => (
          <RecipeCard key={r.id} {...r} />
        ))}

        <div
          className={"addCard"}
          onClick={() => navigate("/recipes/new")}
        >
          <div className={"plus"}>+</div>
        </div>
      </div>
    </div>
  );
}
