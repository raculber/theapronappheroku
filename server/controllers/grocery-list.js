import express from "express";

import GroceryList from "../models/grocerylist.js";

const router = express.Router();

export const deleteList = async (req, res) => {
  let { userId, name } = req.body;
  let deletedNum = Number(name.slice(-1));

  const userLists = await GroceryList.findOneAndUpdate(
    { userId: userId },
    { $pull: { groceryLists: { name: name } } }
  );
  //List exists
  if (userLists) {
    //Update names for grocery lists
    let groceryLists = userLists.groceryLists;

    groceryLists.forEach(async (item) => {
      let listName = item.name;
      //Get grocery list number
      let listNum = Number(listName.slice(-1));
      //If list appeared after the deleted list
      //Subtract 1 from name
      if (listNum > deletedNum) {
        listNum -= 1;
        let newName = "Grocery List " + listNum;
        await GroceryList.updateOne(
          { userId: userId, groceryLists: { $elemMatch: { name: listName } } },
          {
            $set: {
              "groceryLists.$.name": newName,
            },
          }
        );
      }
    });
    res.json({ message: "Removed grocery list" });
  } else res.json({ message: "Grocery list not found" });
};

//Get all grocery lists
export const getLists = async (req, res) => {
  let userId = req.query.userId;
  const userLists = await GroceryList.findOne({
    userId: userId,
  });
  if (!userLists) res.json({ lists: [] });
  else res.json({ lists: userLists.groceryLists });
};

//Get a single grocery list based on name
export const getList = async (req, res) => {
  let userId = req.query.userId;
  let listName = req.query.listName;
  const userLists = await GroceryList.findOne({
    userId: userId,
  });
  console.log(userLists);
  userLists.groceryLists.forEach((list) => {
    if (list.name == listName) res.json({ list: list });
  });
  res.json({ message: "No list found" });
};

export const updateList = async (req, res) => {
  let { userId, items, listName } = req.body;
  let updatedList = await GroceryList.updateOne(
    { userId: userId, groceryLists: { $elemMatch: { name: listName } } },
    {
      $set: {
        "groceryLists.$.items": items,
      },
    }
  );
  if (!updatedList) {
    res.json({ message: "Unable to update list" });
  } else {
    res.json({ result: updatedList });
  }
};

export const aggregateList = async (req, res) => {
  let { userId, recipes } = req.body;
  console.log(userId);
  let grocerylist = [];
  const ingredientMap = new Map();

  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      if (!ingredientMap.get(ingredient.name)) {
        ingredientMap.set(ingredient.name, ingredient.amount);
      }
    });
  });
  let index = 1;
  for (var ingredient of ingredientMap.entries()) {
    let id = index;
    let key = ingredient[0];
    let value = ingredient[1];
    let capitalizedName = key.charAt(0).toUpperCase() + key.slice(1);
    grocerylist.push({ name: capitalizedName, amount: 0, unit: "" });
    index++;
  }
  let listName = "Grocery List 1";
  const userExists = await GroceryList.exists({
    userId: userId,
  });
  //Create new user if user does not exist
  //Otherwise, add to existing array
  if (!userExists) {
    let userLists = new GroceryList({
      userId: userId,
      groceryLists: [{ name: listName, items: grocerylist }],
    });
    await userLists.save();
    res.json({ list: grocerylist });
  } else {
    let userLists = await GroceryList.findOne({
      userId: userId,
    });
    let listNum = userLists.groceryLists.length + 1;
    listName = "Grocery List " + listNum;
    userLists.groceryLists.push({
      name: listName,
      items: grocerylist,
    });
    await userLists.save();
    res.json({ list: grocerylist });
  }
  res.json({ message: "Error adding list" });
};

export const addList = async (req, res) => {
  let { userId, items } = req.body;
  items.forEach((item) => {
    if (item.name.length == 0)
      res.json({ message: "Item name must not be empty" });
    else if (item.amount <= 0)
      res.json({ message: "Amount must be greater than 0" });
  });
  const userExists = await GroceryList.exists({
    userId: userId,
  });
  let listName = "Grocery List 1";
  //Create new user if user does not exist
  //Otherwise, add to existing array
  if (!userExists) {
    let userLists = new GroceryList({
      userId: userId,
      groceryLists: [{ name: listName, items: items }],
    });
    await userLists.save();
    res.json({ list: [{ name: listName, items: items }] });
  } else {
    let userLists = await GroceryList.findOne({
      userId: userId,
    });
    let listNum = userLists.groceryLists.length + 1;
    listName = "Grocery List " + listNum;
    userLists.groceryLists.push({
      name: listName,
      items: items,
    });
    await userLists.save();
    res.json({ list: [{ name: listName, items: items }] });
  }
  res.json({ message: "Error adding list" });
};

export default router;
