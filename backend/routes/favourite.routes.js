import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  getFavourites,
  addFavourite,
  removeFavourite,
} from "../controller/favourite.controller.js";

const favouriteRouter = express.Router();

favouriteRouter.get("/get-favourites", verifyToken, getFavourites);
favouriteRouter.post("/add-favourites", verifyToken, addFavourite);
favouriteRouter.delete("/remove-favourites/:recipeId", verifyToken, removeFavourite);

export default favouriteRouter;
