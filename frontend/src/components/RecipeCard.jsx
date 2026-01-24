import { Clock, UtensilsCrossed, List, Tags } from "lucide-react";
import { useState } from "react";
import axios from "axios";

export default function RecipeCard({ recipe, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState({ ...recipe });
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${recipe.recipeName}"?`
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://newrb-backend.onrender.com/deleteRecipe/${recipe._id}`);
      onDelete(recipe._id);
      alert("Recipe deleted successfully ✅");
    } catch (err) {
      console.error("Error deleting recipe: ", err);
      alert("❌ Failed to delete recipe");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://newrb-backend.onrender.com/updateRecipe/${recipe._id}`,
        editedRecipe
      );
      onEdit(editedRecipe);
      alert("✅ Recipe updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating recipe:", err);
      alert("❌ Failed to update recipe");
    }
  };

  if (isEditing) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-gray-900 text-white p-6 rounded-xl w-96 shadow-lg relative">
          <h2 className="text-xl font-bold text-orange-400 mb-4 text-center">
            Edit Recipe
          </h2>

          <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              value={editedRecipe.recipeName}
              onChange={(e) =>
                setEditedRecipe({ ...editedRecipe, recipeName: e.target.value })
              }
              placeholder="Recipe Name"
              className="bg-gray-800 p-2 rounded"
              required
            />

            <input
              type="text"
              value={editedRecipe.time}
              onChange={(e) =>
                setEditedRecipe({ ...editedRecipe, time: e.target.value })
              }
              placeholder="Cooking Time"
              className="bg-gray-800 p-2 rounded"
              required
            />

            <input
              type="text"
              value={editedRecipe.category}
              onChange={(e) =>
                setEditedRecipe({ ...editedRecipe, category: e.target.value })
              }
              placeholder="Category"
              className="bg-gray-800 p-2 rounded"
              required
            />

            <textarea
              value={editedRecipe.ingredients.join(", ")}
              onChange={(e) =>
                setEditedRecipe({
                  ...editedRecipe,
                  ingredients: e.target.value.split(",").map((i) => i.trim()),
                })
              }
              placeholder="Ingredients (comma separated)"
              className="bg-gray-800 p-2 rounded"
              rows="3"
              required
            />

            <textarea
              value={editedRecipe.steps.join(", ")}
              onChange={(e) =>
                setEditedRecipe({
                  ...editedRecipe,
                  steps: e.target.value.split(",").map((s) => s.trim()),
                })
              }
              placeholder="Steps (comma separated)"
              className="bg-gray-800 p-2 rounded"
              rows="3"
              required
            />

            <div className="flex justify-between mt-4">
              <button
                type="submit"
                className="bg-orange-600 px-4 py-2 rounded-lg hover:bg-orange-700 transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="relative bg-[#0d0e12] text-white rounded-2xl shadow-lg p-5 pb-16 w-full sm:w-[300px] hover:scale-105 cursor-pointer transition-transform duration-300 border border-gray-700"
        onClick={() => setIsViewModalOpen(true)}
      >
        {/* Recipe Name */}
        <h2 className="text-xl font-semibold text-orange-500 mb-2">
          {recipe.recipeName}
        </h2>

        {/* Category */}
        <div className="flex items-center gap-2 mb-2">
          <Tags size={16} className="text-orange-400" />
          <p className="text-sm text-gray-300">{recipe.category}</p>
        </div>

        {/* Time */}
        <div className="flex items-center gap-2 mb-2">
          <Clock size={16} className="text-orange-400" />
          <p className="text-sm text-gray-300">{recipe.time}</p>
        </div>

        {/* Ingredients */}
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

        {/* Steps */}
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

        {/* Buttons */}
        <div className="absolute bottom-4 left-0 w-full flex justify-center gap-6">
          <button
            className="bg-orange-600 px-3 py-1 rounded-lg text-sm hover:bg-orange-700 transition"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true)
            } }
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
      </div>

      {/* 🔍 View Full Recipe Modal */}
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
              🕒 {recipe.time} | 📂 {recipe.category}
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
