import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RecipeCard.css";

interface Props {
  id: number;
  name: string;
  short_description: string;
  image_url?: string;
  onDelete?: () => void;
}

export default function RecipeCard({
  id,
  name,
  short_description,
  image_url,
  onDelete,
}: Props) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const fallback =
    "https://images.unsplash.com/photo-1604908176997-4318c0a1a0e3";

  return (
    <div
      className={"recipeCard"}
      onClick={() => navigate(`/recipes/${id}`)}
    >
      <div
        className={"image"}
        style={{
          backgroundImage: `url(${image_url || fallback})`,
        }}
      />

      <div className={"title"}>
        <h3>{name}</h3>
      </div>

      <div className={"description"}>
        <p>{short_description}</p>
      </div>

      <div className="menu-container">
        <button
          className="menu-button"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
        >
          ⋮
        </button>
        {showMenu && (
          <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                if (window.confirm("¿Estás seguro de que quieres eliminar esta receta?")) {
                  onDelete?.();
                }
                setShowMenu(false);
              }}
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}