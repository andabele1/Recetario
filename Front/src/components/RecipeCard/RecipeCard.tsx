import { useNavigate } from "react-router-dom";
import "./RecipeCard.css";

interface Props {
  id: number;
  name: string;
  short_description: string;
  image_url?: string;
}

export default function RecipeCard({
  id,
  name,
  short_description,
  image_url,
}: Props) {
  const navigate = useNavigate();

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
    </div>
  );
}