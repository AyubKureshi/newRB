import apiClient from "../services/apiClient";
import { useDispatch } from "react-redux";
import { showToast } from "../store/toastSlice";


const EditRecipe = ({ editedRecipe, setEditedRecipe, setIsEditing, onEdit, recipe }) => {
  const dispatch = useDispatch();

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put(`/updateRecipe/${recipe._id}`, editedRecipe, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("rb_token")}`
        }
      });
      if (onEdit) onEdit(editedRecipe);
      dispatch(showToast({ type: "success", message: "Recipe updated successfully!" }));
      setIsEditing(false);
    } catch (err) {
      dispatch(
        showToast({
          type: "error",
          message: err.response?.data?.error || "Failed to update recipe",
        }),
      );
    }
  };

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
};

export default EditRecipe
