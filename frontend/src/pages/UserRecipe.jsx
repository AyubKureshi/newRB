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
    </>
  );
}
