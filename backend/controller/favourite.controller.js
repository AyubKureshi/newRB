import { Favourite } from "../model/favouriteSchema.js";
import { Recipe } from "../model/recipeSchema.js";

const getAuthUserId = (req) => req?.user?.userId || req?.user?.id;

export const getFavourites = async (req, res) => {
  const userId = getAuthUserId(req);
  if (!userId) {
    return res.status(400).json({ message: "User id is required" });
  }

  try {
    const favourites = await Favourite.find({ userId }).populate("recipeId");
    return res.status(200).json(favourites);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const addFavourite = async (req, res) => {
  const userId = getAuthUserId(req);
  if (!userId) {
    return res.status(400).json({ message: "User id is required" });
  }

  const { recipeId } = req.body;
  if (!recipeId) {
    return res.status(400).json({ message: "Recipe id is required" });
  }

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const existingFavourite = await Favourite.findOne({ userId, recipeId });
    if (existingFavourite) {
      return res.status(409).json({ message: "Recipe already in favourites" });
    }

    const favourite = await Favourite.create({ userId, recipeId });
    return res.status(201).json({ message: "Added to favourites", favourite });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: "Recipe already in favourites" });
    }

    return res.status(500).json({ error: err.message });
  }
};

export const removeFavourite = async (req, res) => {
  const userId = getAuthUserId(req);
  if (!userId) {
    return res.status(400).json({ message: "User id is required" });
  }

  const { recipeId } = req.params;
  if (!recipeId) {
    return res.status(400).json({ message: "Recipe id is required" });
  }

  try {
    const deletedFavourite = await Favourite.findOneAndDelete({ userId, recipeId });
    if (!deletedFavourite) {
      return res.status(404).json({ message: "Favourite not found" });
    }

    return res.status(200).json({ message: "Removed from favourites" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
