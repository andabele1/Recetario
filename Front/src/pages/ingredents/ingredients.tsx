import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createIngredient,
  deleteIngredient,
  getIngredients,
  updateIngredient,
} from "../../services/api";
import "./ingredients.css";

export default function Ingredients() {
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const navigate = useNavigate();

  const [newIngredient, setNewIngredient] = useState({
    name: "",
    base_unit: "",
    available_quantity: "",
    total_cost: "",
  });

  // 🔥 cargar ingredientes
  const load = async () => {
    const data = await getIngredients();
    setIngredients(data);
  };

  useEffect(() => {
    load();
  }, []);

  // 🔥 actualizar campo inline
  const updateField = (id: number, field: string, value: any) => {
    const updated = ingredients.map((ing) =>
      ing.id === id ? { ...ing, [field]: value } : ing
    );
    setIngredients(updated);
  };

  // 🔥 guardar edición
  const save = async (ing: any) => {
    await updateIngredient(ing.id, {
      name: ing.name,
      base_unit: ing.base_unit,
      available_quantity: Number(ing.available_quantity),
      total_cost: Number(ing.total_cost),
    });

    setEditingId(null);
    load();
  };

  // 🔥 crear ingrediente
  const create = async () => {
    if (!newIngredient.name) return alert("Nombre requerido");

    await createIngredient({
      name: newIngredient.name,
      base_unit: newIngredient.base_unit,
      available_quantity: Number(newIngredient.available_quantity),
      total_cost: Number(newIngredient.total_cost),
    });

    setNewIngredient({
      name: "",
      base_unit: "",
      available_quantity: "",
      total_cost: "",
    });

    load();
  };

  // 🔥 eliminar
  const remove = async (id: number) => {
    await deleteIngredient(id);
    load();
  };

  return (
    <div className="container">
      <div className="card">

        {/* BACK */}
        <button className="back" onClick={() => navigate("/recipes")}>
          ← Volver
        </button>

        <h1 className="title">Ingredientes</h1>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ingrediente</th>
              <th>Cantidad</th>
              <th>Costo total</th>
              <th>Costo unidad</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {ingredients.map((ing) => {
              const costPerUnit =
                ing.available_quantity > 0
                  ? ing.total_cost / ing.available_quantity
                  : 0;

              return (
                <tr key={ing.id}>
                  <td>{ing.id}</td>

                  {/* NOMBRE */}
                  <td>
                    {editingId === ing.id ? (
                      <input
                        value={ing.name}
                        onChange={(e) =>
                          updateField(ing.id, "name", e.target.value)
                        }
                      />
                    ) : (
                      ing.name
                    )}
                  </td>

                  {/* CANTIDAD */}
                  <td>
                    {editingId === ing.id ? (
                      <input
                        type="number"
                        min={0}
                        value={ing.available_quantity}
                        onChange={(e) =>
                          updateField(
                            ing.id,
                            "available_quantity",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      ing.available_quantity
                    )}
                  </td>

                  {/* COSTO */}
                  <td>
                    {editingId === ing.id ? (
                      <input
                        type="number"
                        min={0}
                        value={ing.total_cost}
                        onChange={(e) =>
                          updateField(ing.id, "total_cost", e.target.value)
                        }
                      />
                    ) : (
                      `$${ing.total_cost}`
                    )}
                  </td>

                  {/* COSTO POR UNIDAD */}
                  <td>
                    ${costPerUnit.toFixed(2)}
                  </td>

                  {/* ACCIONES */}
                  <td className="actions">
                    {editingId === ing.id ? (
                      <button  className="editBtn" onClick={() => save(ing)}>
                        Guardar
                      </button>
                    ) : (
                      <button className="editBtn" onClick={() => setEditingId(ing.id)}>
                        Editar
                      </button>
                    )}

                    <button className="deleteBtnIngredient" onClick={() => remove(ing.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}

            {/* 🔥 CREAR NUEVO */}
            <tr className="newRow">
              <td>+</td>

              <td>
                <input
                  placeholder="Nombre"
                  value={newIngredient.name}
                  onChange={(e) =>
                    setNewIngredient({
                      ...newIngredient,
                      name: e.target.value,
                    })
                  }
                />
              </td>

              <td>
                <input
                  type="number"
                  placeholder="Cantidad"
                  value={newIngredient.available_quantity}
                  onChange={(e) =>
                    setNewIngredient({
                      ...newIngredient,
                      available_quantity: e.target.value,
                    })
                  }
                />
              </td>

              <td>
                <input
                  type="number"
                  placeholder="Costo"
                  value={newIngredient.total_cost}
                  onChange={(e) =>
                    setNewIngredient({
                      ...newIngredient,
                      total_cost: e.target.value,
                    })
                  }
                />
              </td>

              <td>—</td>

              <td>
                <button className="editBtn" onClick={create}>
                  Crear
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}