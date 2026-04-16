import { BrowserRouter, Route, Routes } from "react-router-dom";
import RecipeForm from "./pages/recipeForm/recipesForm";
import Recipes from "./pages/recipes/recipes";
import RecipeDetail from "./pages/recipesDetail/recipesDetail";
import Ingredients from "./pages/ingredents/ingredents";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/new" element={<RecipeForm />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/ingredients" element={<Ingredients />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;