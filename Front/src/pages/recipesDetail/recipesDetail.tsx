import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getIngredients,
  getRecipeById,
  getRecipeCost,
  updateRecipe,
} from "../../services/api";
import "./recipesDetail.css";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<any>(null);
  const [allIngredients, setAllIngredients] = useState<any[]>([]);

  const [editMode, setEditMode] = useState(false);
  const [servings, setServings] = useState<string>("1");
  const [costData, setCostData] = useState<any>(null);

  const MARGIN = 0.4; // 🔥 margen fijo

  useEffect(() => {
    if (id) {
      getRecipeById(Number(id)).then(setRecipe);
      getIngredients().then(setAllIngredients);
    }
  }, [id]);

  if (!recipe) return <p>Cargando...</p>;

  // 🔥 guardar cambios
  const save = async () => {
    await updateRecipe(recipe.id, {
      name: recipe.name,
      description: recipe.description,
      servings: recipe.servings,
      instructions: recipe.instructions,
      image_url: recipe.image_url,
      ingredients: recipe.ingredients.map((i: any) => ({
        ingredient_id: i.ingredient.id,
        quantity: i.quantity,
      })),
    });

    setEditMode(false);
  };

  const addIngredient = () => {
    if (!allIngredients.length) return;

    const newIngredient = {
      ingredient: allIngredients[0], // default primero
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

        {/* IMAGEN */}
        <div
          className="image"
          style={{
            backgroundImage: `url(${recipe.image_url ||
              "https://img.freepik.com/foto-gratis/gradiente-gris-blanco-oscuro-vacio-abstracto-iluminacion-vineta-solida-negra-fondo-pared-piso-estudio-uso-como-telon-fondo-fondo-sala-blanca-vacia-espacio-texto-e-imagen_1258-71887.jpg?semt=ais_hybrid&w=740&q=80"
              })`,
          }}
        />

        {/* HEADER */}
        <div className="header">
          {editMode ? (
            <input
              className="titleInput"
              value={recipe.name}
              onChange={(e) =>
                setRecipe({ ...recipe, name: e.target.value })
              }
            />
          ) : (
            <h1 className="title">{recipe.name}</h1>
          )}

          {editMode ? (
            <button className="editBtn" onClick={save}>
              Guardar
            </button>
          ) : (
            <button className="editBtn" onClick={() => setEditMode(true)}>
              Editar
            </button>
          )}
        </div>

        {/* CONTENIDO */}
        <div className="content">

          {/* INGREDIENTES */}
          <div className="section">
            <h3>Ingredientes</h3>

            {editMode ? (
              <>
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
              </>
            ) : (
              <ul>
                {recipe.ingredients.map((ing: any, i: number) => (
                  <li key={i}>
                    {ing.ingredient?.name} - {ing.quantity}
                  </li>
                ))}
              </ul>
            )}

            {/* 🔥 COSTO DESDE BACK */}

            <div className="costSection">
              <h3>Porciones</h3>
              <input
                type="number"
                min={1}
                value={servings}
                onChange={(e) => {
                  const rawValue = e.target.value;
                  const normalized = rawValue.replace(/^0+(?=\d)/, "");
                  setServings(normalized);
                }}
                placeholder="Porciones"
              />

              <button
                onClick={async () => {
                  try {
                    const servingsNumber = Number(servings);
                    if (!servings || servingsNumber <= 0) {
                      alert("Porciones inválidas");
                      return;
                    }

                    const data = await getRecipeCost(
                      recipe.id,
                      servingsNumber,
                      MARGIN // 🔥 fijo
                    );

                    console.log("COST DATA:", data);
                    setCostData(data);
                  } catch (err) {
                    console.error(err);
                    alert("Error al calcular");
                  }
                }}
              >
                Calcular
              </button>
            </div>

            {/* 🔥 RESULTADO SEGURO */}
            {costData && costData.total_cost !== undefined && (
              <div className="costResult">
                <p>
                  Costo total: $
                  {Number(costData.total_cost).toFixed(2)}
                </p>

                {costData.selling_price !== undefined && (
                  <p>
                    Precio sugerido: $
                    {Number(costData.selling_price).toFixed(2)}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* INSTRUCCIONES */}
          <div className="section">
            <h3>Preparación</h3>

            {editMode ? (
              <textarea
                className="instructionsInput"
                value={recipe.instructions || ""}
                onChange={(e) =>
                  setRecipe({
                    ...recipe,
                    instructions: e.target.value,
                  })
                }
              />
            ) : (
              <p className="instructions">
                {recipe.instructions}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}