import { createSlice } from "@reduxjs/toolkit";

const groceryListSlice = createSlice({
  name: "groceryList",
  initialState: {
    count: 0,
    recipes: [],
  },
  reducers: {
    addRecipe(state, action) {
      const newRecipe = action.payload;
      state.recipes.push({
        id: newRecipe.id,
        ingredients: newRecipe.ingredients,
      });
      state.count += 1;
    },
    removeRecipe(state, action) {
      const recipeId = action.payload.id;
      state.recipes = state.recipes.filter((recipe) => recipe.id != recipeId);
      state.count -= 1;
    },
    clearList(state) {
      state.count = 0;
      state.recipes = [];
    },
  },
});

export const { addRecipe, removeRecipe, clearList } = groceryListSlice.actions;
export default groceryListSlice;
