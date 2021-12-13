import { useState, Fragment, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CustomRecipeModal from "./CustomRecipeModal";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import ListAltIcon from "@mui/icons-material/ListAlt";
import veganIcon from "../../images/vegan-icon.jpg";
import glutenFreeIcon from "../../images/gluten_free.jpg";
import dollarIcon from "../../images/dollar_icon.png";
import CardActions from "@mui/material/CardActions";
import vegetarianIcon from "../../images/vegetarian_icon.jpg";
import dairyFree from "../../images/dairy_free.png";
import DeleteIcon from "@mui/icons-material/Delete";
// import recipe from "./recipe";
import axios from "axios";

const SavedCalendarDisplayRecipeCard = (props) => {
  const userId = useSelector((state) => state.user.userId);
  // const RecipeId = useSelector((state) => state.recipe.recipeId);
  //   const Date = useSelector((state) => state.recipe.date);
  const [alertMessage, setAlertMessage] = useState("");
  const [iconColor, setIconColor] = useState("#A9A9A9");

  const deleteRecipe = (props) => {
    console.log(userId);
    console.log(props.date);
    console.log(props.recipeId);
    axios
      .delete(
        `${process.env.REACT_APP_API_SERVICE_URL}/api/delete-recipe-from-date`,
        {
          userId: userId,
          date: props.date,
          recipeId: props.recipeId,
          headers: {
            "access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        console.log(res);
        setAlertMessage("Deleted from calendar");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Fragment>
      <Card
        className="card"
        sx={{
          maxWidth: 330,
          cursor: "pointer",
          zIndex: 1,
          position: "relative",
          margin: 2,
          ["@media (max-width:730px)"]: {
            maxWidth: 300,
            margin: 1,
          },
        }}
      >
        <CardHeader
          action={
            <CardActions disableSpacing>
              <IconButton aria-label="Delete card" onClick={deleteRecipe}>
                <DeleteIcon
                  sx={{
                    cursor: "pointer",
                    zIndex: 100,
                  }}
                />
              </IconButton>
            </CardActions>
          }
          title={props.recipe.title ? props.recipe.title : "No title"}
          subheader={
            props.recipe.servings
              ? "Servings: " +
                props.recipe.servings +
                " Calories: " +
                Math.round(props.recipe.nutrients[0].amount) +
                " Ready In: " +
                props.recipe.readyInMinutes +
                " minutes"
              : ""
          }
        />
        <CardMedia
          component="img"
          height="150"
          image={props.recipe.image && props.recipe.image}
          alt={props.recipe.title ? props.recipe.title : "No title"}
        />
        <CardContent>
          {props.recipe.vegetarian && !props.recipe.vegan && (
            <img
              width="45"
              height="45"
              alt="Vegetarian"
              title="Vegetarian"
              src={vegetarianIcon}
            />
          )}
          {props.recipe.vegan && (
            <img
              width="45"
              height="45"
              alt="Vegan"
              title="Vegan"
              src={veganIcon}
            />
          )}
          {props.recipe.glutenFree && (
            <img
              width="45"
              height="45"
              alt="Gluten Free"
              title="Gluten Free"
              src={glutenFreeIcon}
            />
          )}
          {props.recipe.dairyFree && (
            <img
              width="45"
              height="45"
              alt="Dairy Free"
              title="Dairy Free"
              src={dairyFree}
            />
          )}
          {props.recipe.cheap && (
            <img
              width="45"
              height="45"
              alt="Budget Friendly"
              title="Budget Friendly"
              src={dollarIcon}
            />
          )}
        </CardContent>
      </Card>
    </Fragment>
  );
};

export default SavedCalendarDisplayRecipeCard;
