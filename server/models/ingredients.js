import mongoose from "mongoose";
const { Schema } = mongoose;

const ingredientsSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      name: {
        type: String,
        required: true,
      },
      image: String,
    },
  ],
});

var Ingredients = mongoose.model("Ingredients", ingredientsSchema);

export default Ingredients;
