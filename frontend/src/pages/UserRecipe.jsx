import { useEffect, useMemo, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import apiClient from "../services/apiClient";
import Loading from "../components/Loading";

export function UserRecipe() {
  const [recipes, setRecipes] = useState([]);
  const [favouriteIds, setFavouriteIds] = useState(() => new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storedUser = localStorage.getItem("rb_user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const currentUserId = currentUser?.id || currentUser?._id;

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await apiClient.get("/recipes");
      setRecipes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError("Failed to fetch recipes");
      setRecipes([]);
    } finally {
      setLoading(false);
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

  const userRecipes = useMemo(() => {
    if (!currentUserId) return [];
    return recipes.filter((recipe) => String(recipe.userId) === String(currentUserId));
  }, [recipes, currentUserId]);

  if (loading) {
    return <Loading text="Loading your recipes..." />;
  }

  if (error) {
    return <div className="pt-28 text-center text-red-400">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-black pt-28 px-6 pb-8">
      <h1 className="text-3xl text-orange-500 font-bold mb-6 text-center">
        Your Recipes
      </h1>

      {userRecipes.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-6">
          {userRecipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              showActions={true}
              isFavourite={favouriteIds.has(recipe._id)}
              onFavouriteAdded={markAsFavourite}
              onFavouriteRemoved={unmarkAsFavourite}
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
          <p className="text-lg">No recipes found for your account</p>
          <p className="text-sm text-gray-500 mt-1">Add a new recipe to get started</p>
        </div>
      )}
    </div>
  );
}
