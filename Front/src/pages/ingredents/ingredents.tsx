import { useEffect, useState } from "react";
import {
    createIngredient,
    deleteIngredient,
    getIngredients,
} from "../../services/api";
import { type Ingredient } from "../../types/types";

export default function Ingredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [cost, setCost] = useState("");

  const loadIngredients = async () => {
    const data = await getIngredients();
    setIngredients(data);
  };

  useEffect(() => {
    loadIngredients();
  }, []);

const handleCreate = async () => {
  if (!name.trim() || !unit.trim()) {
    alert("Nombre y unidad son obligatorios");
    return;
  }

  const qty = Number(quantity);
  const cst = Number(cost);

  if (
    !quantity ||
    !cost ||
    isNaN(qty) ||
    isNaN(cst) ||
    qty <= 0 ||
    cst <= 0
  ) {
    alert("Cantidad y costo deben ser números válidos mayores a 0");
    return;
  }

  const exists = ingredients.some(
    (i) => i.name.toLowerCase() === name.toLowerCase()
  );

  if (exists) {
    alert("Ingrediente ya existe");
    return;
  }

  await createIngredient({
    name: name.trim(),
    base_unit: unit.trim(),
    available_quantity: qty,
    total_cost: cst,
  });

  setName("");
  setUnit("");
  setQuantity("");
  setCost("");

  await loadIngredients();
};

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar ingrediente?")) return;

    await deleteIngredient(id);
    await loadIngredients();
  };

  return (
    <div>
      <h1>Ingredientes</h1>

      {/* FORM */}
      <div style={{ marginBottom: 20 }}>
        <h3>Nuevo ingrediente</h3>

        <input
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Unidad (g, ml, unidad)"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />

        <input
          type="number"
          min="1"
          placeholder="Cantidad disponible"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <input
          type="number"
          min="1"
          placeholder="Costo total"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />

        <button onClick={handleCreate}>Crear</button>
      </div>

      {/* TABLA */}
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Unidad</th>
            <th>Cantidad</th>
            <th>Costo</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {ingredients.length === 0 ? (
            <tr>
              <td colSpan={7}>No hay ingredientes</td>
            </tr>
          ) : (
            ingredients.map((ing) => (
              <tr key={ing.id}>
                <td>{ing.name}</td>
                <td>{ing.base_unit}</td>
                <td>{ing.available_quantity}</td>
                <td>{ing.total_cost}</td>
                <td>
                  <button onClick={() => handleDelete(ing.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}