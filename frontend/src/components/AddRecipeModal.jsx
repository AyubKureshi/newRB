import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import axios from "axios";

export default function AddRecipeModal({ onClose, onRecipeAdded }) {
  const [formData, setFormData] = useState({
    recipeName: "",
    ingredients: "",
    steps: "",
    time: "",
    category: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert comma-separated ingredients/steps into arrays
    const formattedData = {
      recipeName: formData.recipeName,
      ingredients: formData.ingredients.split(",").map((i) => i.trim()),
      steps: formData.steps.split(".").map((s) => s.trim()).filter(Boolean),
      time: formData.time,
      category: formData.category,
    };

    try {
      console.log("Submitting:", formattedData);

      const res = await axios.post("http://localhost:3000/addRecipe", formattedData, {
        headers: { "Content-Type": "application/json" },
      });

      onRecipeAdded(res.data);
      onClose();
      alert("Recipe added successfully!");
    } catch (err) {
      console.error("❌ Error adding recipe:", err.response?.data || err.message);
      alert("Failed to add recipe — check console for details.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-lg w-11/12 sm:w-[450px] p-6 relative"
          initial={{ scale: 0.9, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-black"
          >
            <X size={20} />
          </button>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-center text-orange-600 mb-4">
            Add New Recipe
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Recipe Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Recipe Name
              </label>
              <input
                type="text"
                name="recipeName"
                value={formData.recipeName}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ingredients
              </label>
              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                rows="3"
                required
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
              ></textarea>
            </div>

            {/* Steps */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Steps
              </label>
              <textarea
                name="steps"
                value={formData.steps}
                onChange={handleChange}
                rows="3"
                required
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
              ></textarea>
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cooking Time (in minutes)
              </label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
              >
                <option value="">Select Category</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
                <option value="Dessert">Dessert</option>
                <option value="Drink">Drink</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                Add Recipe
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
