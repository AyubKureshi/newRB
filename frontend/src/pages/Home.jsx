import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";


export default function Home() {
  const [recipes, setRecipes] = useState([]);

  const fetchRecipes = async () => {
    try {
      const res = await axios.get("http://localhost:3000/recipes");
      setRecipes(res.data);
    } catch (err) {
      console.error("Error fetching recipes:", err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleNewRecipe = (newRecipe) => {
    setRecipes((prev) => [...prev, newRecipe]);
  };

  return (
    <div className="pt-24 px-6 bg-black min-h-screen">
      <Navbar onRecipeAdded={handleNewRecipe} />
      <h1 className="text-3xl text-orange-500 font-bold mb-6 text-center">
        🍳 Your Recipes
      </h1>

      <div className="flex flex-wrap justify-center gap-6">
        {recipes.map((r) => (
          <RecipeCard
            key={r._id}
            recipe={r}
            onDelete={(id) => setRecipes((prev) => prev.filter((x) => x._id !== id))}
            onEdit={(updated) =>
              setRecipes((prev) =>
                prev.map((x) => (x._id === updated._id ? updated : x))
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
