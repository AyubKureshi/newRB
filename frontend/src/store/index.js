import { configureStore } from "@reduxjs/toolkit";
import searchSlice from "./searchSlice";
import toastSlice from "./toastSlice";

const recipeStore = configureStore({
    reducer: {
      search: searchSlice.reducer,
      toast: toastSlice.reducer,
    }
});

export default recipeStore;
