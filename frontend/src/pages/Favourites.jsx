import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import apiClient from "../services/apiClient";
import Loading from "../components/Loading";
import { showToast } from "../store/toastSlice";

const Favourites = () => {
  const dispatch = useDispatch();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("rb_token");

  const getFavourites = async () => {
    if (!token) {
      setError("Please login to view favourites.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await apiClient.get("/favourites/get-favourites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFavourites(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load favourites.");
      setFavourites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavourite = async (recipeId) => {
    try {
      await apiClient.delete(`/favourites/remove-favourites/${recipeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFavourites((prev) => prev.filter((item) => item.recipeId?._id !== recipeId));
    } catch (err) {
      dispatch(showToast({ type: "error", message: err.response?.data?.message || "Failed to remove favourite" }));
    }
  };

  useEffect(() => {
    getFavourites();
  }, []);

  if (loading) {
    return <Loading text="Loading favourites..." />;
  }

  if (error) {
    return <div className="pt-28 text-center text-red-400">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-black pt-28 px-4 pb-8">
      <h1 className="text-3xl text-orange-500 font-bold mb-8 text-center">Your Favourites</h1>

      {favourites.length === 0 ? (
        <div className="flex flex-col justify-center items-center text-gray-400 h-[60vh]">
          <p className="text-lg mb-4">No favourites yet.</p>
          <Link to="/" className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-full">
            Browse recipes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {favourites.map((item) => {
            const recipe = item.recipeId;
            if (!recipe) return null;

            return (
              <div
                key={item._id}
                className="bg-[#0d0e12] border border-gray-700 rounded-xl p-5 text-white"
              >
                <h2 className="text-xl font-semibold text-orange-400 mb-2">{recipe.recipeName}</h2>
                <p className="text-sm text-gray-300 mb-1">Category: {recipe.category}</p>
                <p className="text-sm text-gray-300 mb-3">Time: {recipe.time}</p>

                <h3 className="text-orange-300 font-medium mb-1">Ingredients</h3>
                <ul className="list-disc list-inside text-gray-300 text-sm mb-3">
                  {recipe.ingredients?.slice(0, 4).map((ing, idx) => (
                    <li key={`${item._id}-i-${idx}`}>{ing}</li>
                  ))}
                </ul>

                <h3 className="text-orange-300 font-medium mb-1">Steps</h3>
                <ol className="list-decimal list-inside text-gray-300 text-sm mb-4">
                  {recipe.steps?.slice(0, 2).map((step, idx) => (
                    <li key={`${item._id}-s-${idx}`}>{step}</li>
                  ))}
                </ol>

                <button
                  onClick={() => handleRemoveFavourite(recipe._id)}
                  className="w-full bg-red-600 hover:bg-red-700 transition rounded-md py-2 text-sm"
                >
                  Remove from Favourites
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Favourites;

