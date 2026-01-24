import express from "express";
import { getRecipes, addRecipes, putRecipes, deleteRecipes } from "../controller/crudController.js"

const crudRouter = express.Router();

crudRouter.get('/recipes', getRecipes);
crudRouter.post('/addRecipe', addRecipes);
crudRouter.put('/updateRecipe/:id', putRecipes);
crudRouter.delete('/deleteRecipe/:id', deleteRecipes);

export default crudRouter;