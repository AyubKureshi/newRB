import { Recipe } from "../model/recipeSchema.js";
import { Favourite } from "../model/favouriteSchema.js";

const getAuthUserId = (req) => req?.user?.userId || req?.user?.id;

export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addRecipes = async (req, res) => {
  const userId = getAuthUserId(req);
  if (!userId) {
    return res.status(400).json({ message: 'User id is required' });
  }

  try {
    const { recipeName, ingredients, steps, time, category } = req.body;
    const newRecipe = new Recipe({ recipeName, ingredients, steps, time, category, userId });
    await newRecipe.save();
    res.status(201).json({ message: 'Recipe added successfully', recipe: newRecipe });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const putRecipes = async (req, res) => {
  const userId = getAuthUserId(req);
  if (!userId) {
    return res.status(400).json({ message: 'User id is required' });
  }

  try {
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ error: 'Recipe not found or not owned by user' });
    }

    res.json({ message: 'Recipe updated successfully', recipe: updatedRecipe });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteRecipes = async (req, res) => {
  const userId = getAuthUserId(req);
  if (!userId) {
    return res.status(400).json({ message: 'User id is required' });
  }

  try {
    const deletedRecipe = await Recipe.findOneAndDelete({ _id: req.params.id, userId });
    if (!deletedRecipe) {
      return res.status(404).json({ error: 'Recipe not found or not owned by user' });
    }

    // Clean up favourites for this recipe across all users.
    await Favourite.deleteMany({ recipeId: req.params.id });

    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
