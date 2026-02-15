import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema(
  {
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

favouriteSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

export const Favourite = mongoose.model("Favourite", favouriteSchema);
