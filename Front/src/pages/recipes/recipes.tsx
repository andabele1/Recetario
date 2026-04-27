import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "../../components/RecipeCard/RecipeCard";
import { deleteRecipe, getRecipes } from "../../services/api";
import { type Recipe } from "../../types/types";
import "./recipes.css";

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

  // 🔍 filtro por nombre + ingredientes
  const filteredRecipes = recipes.filter((r) => {
    const text = search.toLowerCase();

    const matchName = r.name.toLowerCase().includes(text);

    const matchIngredients = r.ingredients?.some((ing: any) =>
      ing.ingredient?.name?.toLowerCase().includes(text)
    );

    return matchName || matchIngredients;
  });

  // 🔥 eliminar receta
  const handleDelete = async (id: number) => {
    try {
      await deleteRecipe(id);

      // actualizar UI sin recargar
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error al eliminar receta");
    }
  };

  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        <h1 className="title">RECETAS</h1>

        <button
          className="button"
          onClick={() => navigate("/ingredients")}
        >
          Ingredientes
        </button>
      </div>

      {/* SEARCH */}
      <div className="topBar">
        <input
          className="search"
          placeholder="Buscar por nombre o ingrediente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* GRID */}
      <div className="grid">
        {filteredRecipes.map((r) => (
          <RecipeCard
            key={r.id}
            {...r}
            onDelete={() => handleDelete(r.id)} // 🔥 AQUÍ ESTÁ LA CLAVE
          />
        ))}

        {/* CARD CREAR */}
        <div
          className="addCard"
          onClick={() => navigate("/recipes/new")}
        >
          <div className="plus">+</div>
        </div>
      </div>
    </div>
  );
}