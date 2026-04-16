import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getIngredients,
    getRecipeById,
    updateRecipe,
} from "../../services/api";
import "./EditRecipe.css";

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<any>(null);
  const [ingredientsList, setIngredientsList] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [servings, setServings] = useState(1);
  const [instructions, setInstructions] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [selectedIngredients, setSelectedIngredients] = useState<any[]>([]);

  useEffect(() => {
    getIngredients().then(setIngredientsList);

    if (id) {
      getRecipeById(Number(id)).then((data) => {
        setRecipe(data);

        setName(data.name);
        setDescription(data.instructions);
        setServings(data.servings);
        setInstructions(data.instructions || "");
        setImageUrl(data.image_url || "");

        setSelectedIngredients(
          data.ingredients.map((i: any) => ({
            ingredient_id: i.ingredient.id,
            quantity: i.quantity,
          }))
        );
      });
    }
  }, [id]);

  const handleChange = (index: number, field: string, value: any) => {
    const copy = [...selectedIngredients];
    copy[index][field] = value;
    setSelectedIngredients(copy);
  };

  const addIngredient = () => {
    setSelectedIngredients([
      ...selectedIngredients,
      { ingredient_id: "", quantity: "" },
    ]);
  };

  const submit = async () => {
    await updateRecipe(Number(id), {
      name,
      description,
      servings,
      instructions,
      image_url: imageUrl,
      ingredients: selectedIngredients,
    });

    navigate(`/recipes/${id}`);
  };

  if (!recipe) return <p>Cargando...</p>;

  return (
    <div className="container">
      <div className="card">

        <h1>Editar receta</h1>

        <input value={name} onChange={(e) => setName(e.target.value)} />
        <input value={description} onChange={(e) => setDescription(e.target.value)} />
        <input
          type="number"
          min={1}
          value={servings}
          onChange={(e) => setServings(Number(e.target.value))}
        />

        <input
          placeholder="URL imagen"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={8}
        />

        <h3>Ingredientes</h3>

        {selectedIngredients.map((ing, i) => (
          <div key={i} className="row">
            <select
              value={ing.ingredient_id}
              onChange={(e) =>
                handleChange(i, "ingredient_id", Number(e.target.value))
              }
            >
              <option value="">Selecciona</option>
              {ingredientsList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              min={0}
              value={ing.quantity}
              onChange={(e) =>
                handleChange(i, "quantity", Number(e.target.value))
              }
            />
          </div>
        ))}

        <button onClick={addIngredient}>Agregar ingrediente</button>

        <button className="save" onClick={submit}>
          Guardar cambios
        </button>
      </div>
    </div>
  );
}