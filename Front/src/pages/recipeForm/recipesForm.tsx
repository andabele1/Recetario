import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createRecipe,
  getIngredients,
} from "../../services/api";
import "./recipesForm.css";

export default function RecipeCreate() {
  const navigate = useNavigate();

  const [allIngredients, setAllIngredients] = useState<any[]>([]);

  const [recipe, setRecipe] = useState<any>({
    name: "",
    short_description: "",
    instructions: "",
    image_url: "",
    servings: 1,
    ingredients: [],
  });

  useEffect(() => {
    getIngredients().then(setAllIngredients);
  }, []);

  // 🔥 guardar (CREATE)
  const save = async () => {
    if (!recipe.name) {
      alert("Nombre requerido");
      return;
    }

    await createRecipe({
      name: recipe.name,
      short_description: recipe.short_description || "",
      servings: recipe.servings,
      instructions: recipe.instructions,
      image_url: recipe.image_url,
      ingredients: recipe.ingredients.map((i: any) => ({
        ingredient_id: i.ingredient.id,
        quantity: i.quantity,
      })),
    });

    navigate("/recipes");
  };

  // 🔥 agregar ingrediente
  const addIngredient = () => {
    if (!allIngredients.length) return;

    const newIngredient = {
      ingredient: allIngredients[0],
      quantity: 1,
    };

    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, newIngredient],
    });
  };

  return (
    <div className="container">
      <div className="card">

        {/* BACK */}
        <button className="back" onClick={() => navigate("/recipes")}>
          ← Volver
        </button>

        {/* IMAGEN URL */}
        <div className="image">
          <h3>Imagen</h3>

          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const formData = new FormData();
              formData.append("file", file);

              try {
                const res = await fetch("http://127.0.0.1:8000/upload", {
                  method: "POST",
                  body: formData,
                });

                const data = await res.json();

                setRecipe((prev: any) => ({
                  ...prev,
                  image_url: data.url, // 🔥 URL que devuelve el backend
                }));
              } catch (err) {
                console.error(err);
                alert("Error subiendo imagen");
              }
            }}
          />
        </div>

        {/* HEADER */}
        <div className="header">
          <input
            className="titleInput"
            placeholder="Nombre de la receta"
            value={recipe.name}
            onChange={(e) =>
              setRecipe({ ...recipe, name: e.target.value })
            }
          />
          <button className="editBtn" onClick={save}>
            Crear
          </button>
        </div>

        {/* DESCRIPCION CORTA */}
        <div className="shortDescription">
          <input
            className="shortDescriptionInput"
            placeholder="Descripción corta"
            value={recipe.short_description}
            onChange={(e) =>
              setRecipe({ ...recipe, short_description: e.target.value })
            }
          />
        </div>

        {/* CONTENIDO */}
        <div className="content">

          {/* INGREDIENTES */}
          <div className="section">
            <h3>Ingredientes</h3>

            {recipe.ingredients.map((ing: any, i: number) => (
              <div key={i} className="row">
                <select
                  value={ing.ingredient?.id}
                  onChange={(e) => {
                    const copy = [...recipe.ingredients];
                    const selected = allIngredients.find(
                      (a) => a.id === Number(e.target.value)
                    );

                    copy[i].ingredient = selected;
                    setRecipe({ ...recipe, ingredients: copy });
                  }}
                >
                  {allIngredients.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>

                <input
                  className="quantityInput"
                  type="number"
                  min={0}
                  value={ing.quantity}
                  onChange={(e) => {
                    const copy = [...recipe.ingredients];
                    copy[i].quantity = Number(e.target.value);
                    setRecipe({ ...recipe, ingredients: copy });
                  }}
                />

                <button
                  className="deleteBtn"
                  onClick={() => {
                    const copy = recipe.ingredients.filter(
                      (_: any, idx: number) => idx !== i
                    );
                    setRecipe({ ...recipe, ingredients: copy });
                  }}
                >
                  ✕
                </button>
              </div>
            ))}

            <button className="addBtn" onClick={addIngredient}>
              + Agregar ingrediente
            </button>

            {/* PORCIONES */}
            <h3>Porciones</h3>

            <input
              type="number"
              min={1}
              value={recipe.servings}
              onChange={(e) =>
                setRecipe({
                  ...recipe,
                  servings: Number(e.target.value),
                })
              }
            />
          </div>

          {/* INSTRUCCIONES */}
          <div className="section">
            <h3>Preparación</h3>

            <textarea
              className="instructionsInput"
              placeholder="Paso 1: ...&#10;Paso 2: ..."
              value={recipe.instructions}
              onChange={(e) =>
                setRecipe({
                  ...recipe,
                  instructions: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>
    </div >
  );
}