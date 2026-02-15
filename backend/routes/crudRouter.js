import express from "express";
import { getRecipes, addRecipes, putRecipes, deleteRecipes } from "../controller/crudController.js"
import {verifyToken} from "../middleware/auth.js";

const crudRouter = express.Router();

crudRouter.get('/recipes', getRecipes);
crudRouter.post('/addRecipe', verifyToken, addRecipes);
crudRouter.put('/updateRecipe/:id', verifyToken, putRecipes);
crudRouter.delete('/deleteRecipe/:id', verifyToken, deleteRecipes);

export default crudRouter;
