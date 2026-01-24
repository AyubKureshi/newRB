import axios from "axios";
import { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";

export function UserRecipe() {
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

  return (
    <>
      <h1 className="text-3xl text-orange-500 font-bold mb-6 text-center">
        🍳 Your Recipes
      </h1>

      {recipes.length > 1 ? (
        <div className="flex flex-wrap justify-center gap-6">
            {recipes.map((recipe) => {
                <RecipeCard 
                key={recipe._id} 
                recipe={recipe}
                onDelete={(id) =>
                    setRecipes((prev) => prev.filter((x) => x._id !== id))
                }
                onEdit={(updated) =>
                    setRecipes((prev) =>
                        prev.map((x) => (x._id === updated._id ? updated : x))
                    )
                }
                />;
            })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400 mt-16">
          <p className="text-lg">😕 No recipes were found</p>
          <p className="text-sm text-gray-500 mt-1">
            Add New Recipes
          </p>
        </div>
      )}

        
    </>
  );
}
