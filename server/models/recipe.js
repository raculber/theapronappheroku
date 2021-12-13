import mongoose from "mongoose";
const { Schema } = mongoose;

const recipeSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      id: String,
      name: String,
      amount: Number,
      unit: String,
    },
  ],
  nutrients: [
    {
      name: String,
      title: String,
      amount: Number,
      unit: String,
      percentOfDailyNeeds: Number,
    },
  ],
  vegetarian: Boolean,
  vegan: Boolean,
  glutenFree: Boolean,
  dairyFree: Boolean,
  veryHealthy: Boolean,
  cheap: Boolean,
  summary: String,
  image: String,
  instructions: [
    {
      number: Number,
      step: String,
    },
  ],
  readyInMinutes: Number,
  servings: Number,
});

var Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
