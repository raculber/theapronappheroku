import express from "express";

import Recipe from "../models/recipe.js";
import https from "https";
const router = express.Router();
export const saveRecipe = async (req, res) => {
  let {
    userId,
    id,
    title,
    ingredients,
    vegetarian,
    vegan,
    glutenFree,
    dairyFree,
    veryHealthy,
    cheap,
    summary,
    image,
    instructions,
    nutrients,
    readyInMinutes,
    servings,
  } = req.body;
  console.log(ingredients);
  const recipeExists = await Recipe.exists({
    userId: userId,
    id: id,
  });
  //Add recipe
  if (!recipeExists) {
    const recipe = new Recipe({
      userId: userId,
      id: id,
      title: title,
      ingredients: ingredients,
      vegetarian: vegetarian,
      vegan: vegan,
      glutenFree: glutenFree,
      dairyFree: dairyFree,
      veryHealthy: veryHealthy,
      cheap: cheap,
      summary: summary,
      image: image,
      instructions: instructions,
      nutrients: nutrients,
      readyInMinutes: readyInMinutes,
      servings: servings,
    });

    recipe.save();
    res.json({ message: "Added to favorites" });
  }
  //Delete recipe
  else {
    Recipe.deleteOne({ userId: userId, id: id }, function (err) {
      if (err) return handleError(err);
      res.json({ message: "Removed from favorites" });
    });
  }
};

export const getRecipeSaved = async (req, res) => {
  let userId = req.query.userId;
  let id = req.query.id;
  const findRecipe = await Recipe.exists({ userId: userId, id: id });
  if (findRecipe) {
    res.json({ recipeExists: true });
  } else {
    res.json({ recipeExists: false });
  }
};

export const getSavedRecipes = async (req, res) => {
  let userId = req.query.userId;
  console.log(userId);

  const recipes = await Recipe.find({ userId: userId });
  console.log(recipes);
  if (recipes.length > 0) {
    res.json({ recipes: recipes });
  } else {
    res.json({ recipes: [] });
  }
};

export const getRandomRecipes = async (req, res) => {
  let number = req.query.number;
  const options = {
    hostname: "api.spoonacular.com",
    path:
      "/recipes/complexSearch?apiKey=" +
      process.env.API_KEY +
      "&addRecipeNutrition=true&number=" +
      number +
      "&addRecipeInformation=true&instructionsRequired=true",
    method: "GET",
  };
  const request = https.request(options, (response) => {
    let data = "";
    response.on("data", (chunk) => {
      data = data + chunk.toString();
    });

    response.on("end", () => {
      const body = JSON.parse(data);
      res.json({ recipes: body });
    });
  });
  request.on("error", (error) => {
    res.status(401);
  });

  request.end();
};

export const getRecipeByName = async (req, res) => {
  let name = req.query.name;
  name = encodeURIComponent(name);
  const options = {
    hostname: "api.spoonacular.com",
    path:
      "/recipes/complexSearch?apiKey=" +
      process.env.API_KEY +
      "&addRecipeNutrition=true&number=1&addRecipeInformation=true" +
      "&instructionsRequired=true" +
      "&titleMatch=" +
      name,
    method: "GET",
  };
  const request = https.request(options, (response) => {
    let data = "";
    response.on("data", (chunk) => {
      data = data + chunk.toString();
    });

    response.on("end", () => {
      const body = JSON.parse(data);
      res.json({ recipes: body });
    });
  });
  request.on("error", (error) => {
    res.status(401);
  });

  request.end();
};

export const getRecipesByQuery = async (req, res) => {
  let number = req.query.number;
  let query = req.query.search;
  let diet = "";
  let intolerances = "";
  if (req.query.diet) {
    diet = "&diet=" + req.query.diet;
  }
  if (req.query.intolerances) {
    intolerances = "&intolerances=" + req.query.intolerances;
  }
  const options = {
    hostname: "api.spoonacular.com",
    path:
      "/recipes/complexSearch?apiKey=" +
      process.env.API_KEY +
      "&addRecipeNutrition=true&number=" +
      number +
      "&addRecipeInformation=true&instructionsRequired=true" +
      "&query=" +
      query +
      diet +
      intolerances,
    method: "GET",
  };
  const request = https.request(options, (response) => {
    let data = "";
    response.on("data", (chunk) => {
      data = data + chunk.toString();
    });

    response.on("end", () => {
      const body = JSON.parse(data);
      res.json({ recipes: body });
    });
  });
  request.on("error", (error) => {
    res.status(401);
  });

  request.end();
};

export default router;
