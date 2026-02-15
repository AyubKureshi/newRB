import { Clock, UtensilsCrossed, List, Tags, Heart, Timer } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import apiClient from "../services/apiClient";
import EditRecipe from "./EditRecipe";
import { showToast } from "../store/toastSlice";

export default function RecipeCard({
  recipe,
  onDelete,
  onEdit,
  showActions = true,
  isFavourite = false,
  onFavouriteAdded,
  onFavouriteRemoved,
}) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState({ ...recipe });
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${recipe.recipeName}"?`,
    );
    if (!confirmDelete) return;

    try {
      await apiClient.delete(`/deleteRecipe/${recipe._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("rb_token")}`,
        },
      });
      if (onDelete) onDelete(recipe._id);
      dispatch(
        showToast({ type: "success", message: "Recipe deleted successfully" }),
      );
    } catch (err) {
      dispatch(
        showToast({ type: "error", message: "Failed to delete recipe" }),
      );
    }
  };

  const addToFavourite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("rb_token");
    if (!token) {
      dispatch(
        showToast({ type: "error", message: "Please login to add favourites" }),
      );
      return;
    }

    if (isFavourite) {
      try {
        await apiClient.delete(`/favourites/remove-favourites/${recipe._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onFavouriteRemoved?.(recipe._id);
        dispatch(showToast({ type: "success", message: "Removed from favourites" }));
      } catch (error) {
        dispatch(
          showToast({
            type: "error",
            message: error.response?.data?.message || "Failed to remove from favourites",
          }),
        );
      }
      return;
    }

    try {
      await apiClient.post(
        "/favourites/add-favourites",
        { recipeId: recipe._id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      onFavouriteAdded?.(recipe._id);
      dispatch(showToast({ type: "success", message: "Added to favourites" }));
    } catch (error) {
      if (error.response?.status === 409) {
        // If already favourite on server, toggle it off instead of showing "already favourite".
        try {
          await apiClient.delete(`/favourites/remove-favourites/${recipe._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          onFavouriteRemoved?.(recipe._id);
          dispatch(showToast({ type: "success", message: "Removed from favourites" }));
          return;
        } catch (removeError) {
          dispatch(
            showToast({
              type: "error",
              message:
                removeError.response?.data?.message || "Failed to remove from favourites",
            }),
          );
          return;
        }
      }

      dispatch(
        showToast({
          type: "error",
          message: error.response?.data?.message || "Failed to add to favourites",
        }),
      );
    }
  };


  if (isEditing) {
    return (
      <EditRecipe
        editedRecipe={editedRecipe}
        setEditedRecipe={setEditedRecipe}
        setIsEditing={setIsEditing}
        onEdit={onEdit}
        recipe={recipe}
      />
    );
  }

  return (
    <>
      <div
        className="relative bg-[#0d0e12] text-white rounded-2xl shadow-lg p-5 pb-8 w-full sm:w-[300px] sm:hover:-translate-y-2 cursor-pointer transition-all sm:duration-500 border border-gray-700"
        onClick={() => setIsViewModalOpen(true)}
      >
        <h2 className="text-xl font-semibold text-orange-500 mb-2">
          {recipe.recipeName}
        </h2>

        <div className="flex items-center gap-2 mb-2">
          <Tags size={16} className="text-orange-400" />
          <p className="text-sm text-gray-300">{recipe.category}</p>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Clock size={16} className="text-orange-400" />
          <p className="text-sm text-gray-300">{recipe.time}</p>
        </div>

        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1">
            <UtensilsCrossed size={16} className="text-orange-400" />
            <h3 className="text-md font-medium">Ingredients:</h3>
          </div>
          <ul className="list-disc list-inside text-gray-300 text-sm pl-2">
            {recipe.ingredients.slice(0, 4).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
            {recipe.ingredients.length > 4 && (
              <li className="text-gray-500 italic">and more...</li>
            )}
          </ul>
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <List size={16} className="text-orange-400" />
            <h3 className="text-md font-medium">Steps:</h3>
          </div>
          <ol className="list-decimal list-inside text-gray-300 text-sm pl-2">
            {recipe.steps.slice(0, 2).map((step, index) => (
              <li key={index}>{step}</li>
            ))}
            {recipe.steps.length > 2 && (
              <li className="text-gray-500 italic">and more...</li>
            )}
          </ol>
        </div>
        <div className="absolute bottom-4 right-4">
          <button
            onClick={addToFavourite}
            className={`transition ${
              isFavourite
                ? "text-red-500 fill-red-500"
                : "text-gray-300 hover:text-red-400"
            }`}
          >
            <Heart fill={isFavourite ? "currentColor" : "none"} />
          </button>
        </div>

        {showActions && (
          <div className="absolute bottom-4 left-0 w-full flex justify-center gap-6">
            <button
              className="bg-orange-600 px-3 py-1 rounded-lg text-sm hover:bg-orange-700 transition"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              Edit
            </button>
            <button
              className="bg-gray-700 px-3 py-1 rounded-lg text-sm hover:bg-gray-600 transition"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {isViewModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setIsViewModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 text-white p-6 rounded-xl w-[90%] md:w-[600px] max-h-[85vh] overflow-y-auto shadow-xl relative"
          >
            <h2 className="text-2xl font-bold text-orange-400 mb-2 text-center">
              {recipe.recipeName}
            </h2>
            <p className="text-gray-400 mb-1 text-center">
              <Timer /> {recipe.time} | {recipe.category}
            </p>

            <h3 className="mt-4 text-lg text-orange-400 font-semibold">
              Ingredients
            </h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {recipe.ingredients.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>

            <h3 className="mt-4 text-lg text-orange-400 font-semibold">
              Steps
            </h3>
            <ol className="list-decimal list-inside text-gray-300 space-y-1">
              {recipe.steps.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ol>

            <button
              onClick={() => setIsViewModalOpen(false)}
              className="mt-6 bg-orange-600 px-4 py-2 rounded-lg hover:bg-orange-700 w-full transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
