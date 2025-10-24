import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    recipeName: {
        type: String, 
        required: true, 
        trim: true
    }, 
    ingredients: {
        type: [String], 
        required: true, 
    }, 
    steps: {
        type: [String],
        required: true, 
    },
    time: {
        type: String, 
        required: true, 
    }, 
    category: {
        type: String, 
        required: true
    }
});

export const Recipe = mongoose.model("Recipe", recipeSchema);