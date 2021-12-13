import GroceryList from "./GroceryList";
import axios from "axios";
import { Fragment, useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import recipe from "../Recipe/recipe";
import CircularProgress from "@mui/material/CircularProgress";
import recipe2 from "../Recipe/recipe2";
import recipe3 from "../Recipe/recipe3";
//Dummy data
let items = [
  { id: 1, name: "banana", amount: 10, unit: "" },
  { id: 2, name: "bread", amount: 5, unit: "" },
];
let updateItem = { id: 3, name: "milk", amount: 5, unit: "cups" };
let recipes = [
  recipe.nutrition.ingredients,
  recipe2.nutrition.ingredients,
  recipe3.nutrition.ingredients,
];
const GroceryLists = (props) => {
  const userId = useSelector((state) => state.user.userId);
  const [groceryLists, setGroceryLists] = useState([]);
  const [loading, setLoading] = useState(true);

  const getGroceryLists = useCallback(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_SERVICE_URL}/api/get-grocery-lists?userId=${userId}`,
        {
          headers: {
            "access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        setGroceryLists(res.data.lists);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, []);
  useEffect(() => {
    getGroceryLists();
  }, []);

  return (
    <Fragment>
      {loading && (
        <CircularProgress sx={{ margin: "auto" }} color="secondary" />
      )}
      {groceryLists.length == 0 && !loading && (
        <p style={{ fontSize: "20px", margin: "15px" }}>
          No grocery lists saved
        </p>
      )}
      <div style={{ display: "flex", flexDirection: "row" }}>
        {groceryLists.map((list) => (
          <GroceryList
            getGroceryLists={getGroceryLists}
            list={list}
            key={list.name}
          />
        ))}
      </div>
    </Fragment>
  );
};

export default GroceryLists;
