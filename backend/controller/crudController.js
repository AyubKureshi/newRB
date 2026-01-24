import { Recipe } from "../model/recipeSchema.js";

export const getRecipes = async (req, res, next) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const addRecipes = async (req,res) => {
    try {
        const newRecipe = new Recipe(req.body);
        await newRecipe.save();
        res.json({ message: "Recipe added successfully", recipe: newRecipe });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export const putRecipes = async (req,res) => {
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new:true });
        if (!updatedRecipe) return res.status(404).json({ error: "Recipe not found" });
        res.json({ message: "Recipe updated successfully", recipe: updatedRecipe });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export const deleteRecipes = async (req,res) => {
    try {
        const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!deletedRecipe) return res.status(404).json({ error: "Recipe not found" });
        res.json({ message: "Recipe deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}