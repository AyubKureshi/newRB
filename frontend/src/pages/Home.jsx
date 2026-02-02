import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
import apiClient from "../services/apiClient";
import { useSelector } from "react-redux";

export default function Home() {
  const searchTerm = useSelector((store) => store.search);
  const [recipes, setRecipes] = useState([]);

  const fetchRecipes = async () => {
    try {
      const res = await apiClient.get("/recipes");

      if (Array.isArray(res.data)) {
        setRecipes(res.data);
      } else {
        setRecipes([]); // safety net
      }
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setRecipes([]);
    }
  };


  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleNewRecipe = (newRecipe) => {
    setRecipes((prev) => [...prev, newRecipe]);
  };
  

  const filteredRecipes = recipes.filter((recipe) => {
    if (!searchTerm) return true;

    return (
      recipe.recipeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="md:pt-24 pt-32 px-6 bg-black min-h-screen">
      <Navbar onRecipeAdded={handleNewRecipe} />
      <h1 className="text-3xl text-orange-500 font-bold mb-6 text-center">
        🍳 Your Recipes
      </h1>

      {filteredRecipes.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-6 py-4">
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
