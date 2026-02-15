import { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import apiClient from "../services/apiClient";
import { useSelector } from "react-redux";

export default function Home({ newRecipe }) {
  const searchTerm = useSelector((store) => store.search);
  const [recipes, setRecipes] = useState([]);
  const [favouriteIds, setFavouriteIds] = useState(() => new Set());

  const fetchRecipes = async () => {
    try {
      const res = await apiClient.get("/recipes");
      setRecipes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setRecipes([]);
    }
  };

  const fetchFavourites = async () => {
    const token = localStorage.getItem("rb_token");
    if (!token) {
      setFavouriteIds(new Set());
      return;
    }

    try {
      const res = await apiClient.get("/favourites/get-favourites", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ids = new Set(
        (Array.isArray(res.data) ? res.data : [])
          .map((item) => item?.recipeId?._id || item?.recipeId)
          .filter(Boolean),
      );

      setFavouriteIds(ids);
    } catch {
      setFavouriteIds(new Set());
    }
  };

  useEffect(() => {
    fetchRecipes();
    fetchFavourites();
  }, []);

  useEffect(() => {
    if (!newRecipe?._id) return;
    setRecipes((prev) => {
      if (prev.some((recipe) => recipe._id === newRecipe._id)) return prev;
      return [newRecipe, ...prev];
    });
  }, [newRecipe]);

  const markAsFavourite = (recipeId) => {
    setFavouriteIds((prev) => new Set(prev).add(recipeId));
  };

  const unmarkAsFavourite = (recipeId) => {
    setFavouriteIds((prev) => {
      const next = new Set(prev);
      next.delete(recipeId);
      return next;
    });
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
      <h1 className="text-3xl text-orange-500 font-bold mb-6 text-center">
        Your Recipes
      </h1>

      {filteredRecipes.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-6 py-4">
          {filteredRecipes.map((r) => (
            <RecipeCard
              key={r._id}
              recipe={r}
              showActions={false}
              isFavourite={favouriteIds.has(r._id)}
              onFavouriteAdded={markAsFavourite}
              onFavouriteRemoved={unmarkAsFavourite}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400 mt-16">
          <p className="text-lg">No recipes were found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try searching with a different name or category
          </p>
        </div>
      )}
    </div>
  );
}
