import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbConnect } from './database/dbConnection.js';
import { Recipe } from './model/recipeSchema.js';
import authRoutes from './routes/auth.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);

dbConnect();

app.get('/recipes', async (req,res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/addRecipe', async (req,res) => {
    try {
        const newRecipe = new Recipe(req.body);
        await newRecipe.save();
        res.json({ message: "Recipe added successfully", recipe: newRecipe });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/updateRecipe/:id', async (req,res) => {
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new:true });
        if (!updatedRecipe) return res.status(404).json({ error: "Recipe not found" });
        res.json({ message: "Recipe updated successfully", recipe: updatedRecipe });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/deleteRecipe/:id', async (req,res) => {
    try {
        const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!deletedRecipe) return res.status(404).json({ error: "Recipe not found" });
        res.json({ message: "Recipe deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});