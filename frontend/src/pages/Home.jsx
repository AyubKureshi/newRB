import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";

export default function Home({ searchTerm, setSearchTerm }) {
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

  const filteredRecipes = recipes.filter(
    (r) =>
      r.recipeName.toLowerCase().includes(searchTerm) ||
      r.category.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="pt-24 px-6 bg-black min-h-screen">
      <Navbar onRecipeAdded={handleNewRecipe} setSearchTerm={setSearchTerm} />
      <h1 className="text-3xl text-orange-500 font-bold mb-6 text-center">
        🍳 Your Recipes
      </h1>

      {filteredRecipes.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-6">
          {filteredRecipes.map((r) => (
            <RecipeCard
              key={r._id}
              recipe={r}
              onDelete={(id) =>
                setRecipes((prev) => prev.filter((x) => x._id !== id))
              }
              onEdit={(updated) =>
                setRecipes((prev) =>
                  prev.map((x) => (x._id === updated._id ? updated : x))
                )
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400 mt-16">
          <p className="text-lg">😕 No recipes were found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try searching with a different name or category
          </p>
        </div>
      )}
    </div>
  );
}
