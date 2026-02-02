import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
    name: "search", 
    initialState: "", 
    reducers: {
        handleSearchTerm: (state, action) => {
            return action.payload;
        }, 
    }, 
});

export const searchAction = searchSlice.actions;

export default searchSlice;