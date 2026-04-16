import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRecipe, getIngredients } from "../../services/api";
import { type Ingredient } from "../../types/types";

interface SelectedIngredient {
  ingredient_id: number | "";
  quantity: number | "";
}

export default function RecipeForm() {
  const [ingredientsList, setIngredientsList] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [servings, setServings] = useState<number>(1);

  const navigate = useNavigate();

  useEffect(() => {
  getIngredients().then((data) => {
    console.log("INGREDIENTS:", data);
    setIngredientsList(data);
  });
}, []);

  const addIngredient = () => {
    setSelectedIngredients([
      ...selectedIngredients,
      { ingredient_id: "", quantity: "" },
    ]);
  };

  const handleChange = (index: number, field: string, value: any) => {
    const copy = [...selectedIngredients];
    copy[index] = { ...copy[index], [field]: value };
    setSelectedIngredients(copy);
  };

  const submit = async () => {
    await createRecipe({
      name,
      description,
      servings,
      ingredients: selectedIngredients.map((i) => ({
        ingredient_id: Number(i.ingredient_id),
        quantity: Number(i.quantity),
      })),
    });

    navigate("/recipes");
  };

  return (
    <div>
      <h1>Nueva receta</h1>

      <input onChange={(e) => setName(e.target.value)} placeholder="Nombre" />
      <input onChange={(e) => setDescription(e.target.value)} placeholder="Descripción" />
      <input
        type="number"
        onChange={(e) => setServings(Number(e.target.value))}
        placeholder="Porciones"
      />

      {selectedIngredients.map((ing, i) => (
        <div key={i}>
          <select onChange={(e) => handleChange(i, "ingredient_id", Number(e.target.value))}>
            <option value="">Selecciona</option>
            {ingredientsList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            onChange={(e) => handleChange(i, "quantity", Number(e.target.value))}
          />
        </div>
      ))}

      <button onClick={addIngredient}>Agregar ingrediente</button>
      <button onClick={submit}>Guardar</button>
    </div>
  );
}