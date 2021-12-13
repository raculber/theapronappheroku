import express from "express";
import moment from "moment";
import Calendar from "../models/calendar.js";

const router = express.Router();

export const addRecipeToDate = async (req, res) => {
  let { userId, date, recipe } = req.body;
  const userExists = await Calendar.exists({
    userId: userId,
  });
  //Add Recipe for Date
  let calendarUser = new Calendar({
    userId: userId,
    recipes: [],
  });
  if (userExists) {
    calendarUser = await Calendar.findOne({
      userId: userId,
    });
  }
  let recipeId = recipe.id;
  let duplicateRecipe = false;
  let countRecipes = 0;
  calendarUser.recipes.forEach((recipe) => {
    let formattedDate = moment(recipe.date).format("MM/DD/YYYY");
    if (formattedDate == date) countRecipes++;
    if (formattedDate == date && recipe.recipe.id == recipeId)
      duplicateRecipe = true;
  });
  if (countRecipes < 5) {
    if (!duplicateRecipe) {
      calendarUser.recipes.push({
        date: date,
        recipe: {
          id: recipe.id,
          title: recipe.title,
          extendedIngredients: recipe.ingredients,
          vegetarian: recipe.vegetarian,
          vegan: recipe.vegan,
          glutenFree: recipe.glutenFree,
          dairyFree: recipe.dairyFree,
          veryHealthy: recipe.veryHealthy,
          cheap: recipe.cheap,
          summary: recipe.summary,
          image: recipe.image,
          instructions: recipe.instructions,
          nutrients: recipe.nutrients,
          readyInMinutes: recipe.readyInMinutes,
          servings: recipe.servings,
        },
      });
      res.status(200).json({
        recipe: recipe,
        date: date,
      });
    } else {
      res.json({ message: "Cannot add duplicate recipes" });
    }
  } else {
    res.json({ message: "Maximum recipes reached" });
  }
  calendarUser.save();
};

export const deleteRecipeFromDate = async (req, res) => {
  let { userId, date, recipeId } = req.body;
  const calendarUser = await Calendar.findOne({
    userId: userId,
    recipes: {
      $elemMatch: { date: date },
    },
  });
  await Calendar.updateOne(
    {
      userId: userId,
    },
    {
      $pull: {
        recipes: { date: date },
        recipe: { id: recipeId },
      },
    },
    { multi: false }
  );
};

export const getRecipesByDate = async (req, res) => {
  let userId = req.query.userId;
  let date = req.query.date;
  const calendarUser = await Calendar.findOne({
    userId: userId,
  });
  console.log(calendarUser.recipes);
  if (!calendarUser) {
    res.json({ message: "No recipes found" });
  } else if (!calendarUser.recipes) {
    res.json({ message: "No recipes found" });
  } else if (calendarUser.recipes.length == 0) {
    res.json({ message: "No recipes found" });
  } else {
    let recipeArray = [];
    for (let i = 0; i < calendarUser.recipes.length; i++) {
      let formattedDate = moment(calendarUser.recipes[i].date).format(
        "MM/DD/YYYY"
      );
      if (formattedDate == date)
        recipeArray.push(calendarUser.recipes[i].recipe);
    }
    res.json({ recipes: recipeArray });
  }
};
export default router;
