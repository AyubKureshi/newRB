import { configureStore } from "@reduxjs/toolkit";
import searchSlice from "./searchSlice";

const recipeStore = configureStore({
    reducer: { search: searchSlice.reducer }
});

export default recipeStore;