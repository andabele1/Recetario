import { BrowserRouter, Route, Routes } from "react-router-dom";
import RecipeForm from "./pages/recipeForm/recipesForm";
import Recipes from "./pages/recipes/recipes";
import RecipeDetail from "./pages/recipesDetail/recipesDetail";
import Ingredients from "./pages/ingredents/ingredents";
import EditRecipe from "./pages/EditRecipe/EditRecipe";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/new" element={<RecipeForm />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />s
        <Route path="/ingredients" element={<Ingredients />} />
        <Route path="/recipes/:id/edit" element={<EditRecipe />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;