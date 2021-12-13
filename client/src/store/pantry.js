import { createSlice } from "@reduxjs/toolkit";

const pantrySlice = createSlice({
  name: "pantry",
  initialState: {
    recipes: [],
  },
  reducers: {
    addRecipe(state, action) {
      const newRecipe = action.payload;
      state.recipes.push(newRecipe.recipe);
    },
    clearRecipes(state) {
      state.recipes = [];
    },
  },
});

export const { addRecipe, clearRecipes } = pantrySlice.actions;
export default pantrySlice;
