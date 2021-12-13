import { useState, Fragment, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import RecipeModal from "./RecipeModal";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import veganIcon from "../../images/vegan-icon.jpg";
import glutenFreeIcon from "../../images/gluten_free.jpg";
import dollarIcon from "../../images/dollar_icon.png";
import vegetarianIcon from "../../images/vegetarian_icon.jpg";
import dairyFree from "../../images/dairy_free.png";
// import recipe from "./recipe";
import axios from "axios";

const RecipeCard = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [iconColor, setIconColor] = useState("#A9A9A9");
  const userId = useSelector((state) => state.user.userId);

  const getRecipeSaved = useCallback(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_SERVICE_URL}/api/get-recipe-saved?id=${props.recipe.id}&userId=${userId}`,
        {
          headers: {
            "access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        setIconColor(res.data.recipeExists ? "#FF0000" : "#A9A9A9");
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.recipe.id]);
  useEffect(() => {
    getRecipeSaved();
  }, [getRecipeSaved]);

  const alertClosedHandler = () => {
    setAlertMessage("");
  };
  const recipeSaveHandler = () => {
    console.log(props.recipe);
    let ingredients = [];
    props.recipe.nutrition.ingredients.forEach((ingredient) => {
      ingredients.push({
        id: ingredient.id,
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
      });
    });
    axios
      .post(`${process.env.REACT_APP_API_SERVICE_URL}/api/save-recipe`, {
        userId: userId,
        id: props.recipe.id,
        title: props.recipe.title,
        ingredients: ingredients,
        vegan: props.recipe.vegan,
        vegetarian: props.recipe.vegetarian,
        glutenFree: props.recipe.glutenFree,
        dairyFree: props.recipe.dairyFree,
        veryHealthy: props.recipe.veryHealthy,
        cheap: props.recipe.cheap,
        summary: props.recipe.summary,
        image: props.recipe.image,
        instructions: props.recipe.analyzedInstructions[0].steps,
        readyInMinutes: props.recipe.readyInMinutes,
        nutrients: props.recipe.nutrition.nutrients,
        servings: props.recipe.servings,
        headers: {
          "access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res);
        if (res.data.message === "Added to favorites") {
          setIconColor("#FF0000");
        } else {
          setIconColor("A9A9A9");
        }
        setAlertMessage(res.data.message);
      })
      .catch((err) => {});
  };
  const hideModalHandler = () => {
    setShowModal(false);
  };
  const showModalHandler = (event) => {
    //Do not display modal if user clicked "save"
    if (event.target.tagName !== "path") setShowModal(true);
  };

  return (
    <Fragment>
      {showModal && (
        <RecipeModal onClose={hideModalHandler} recipe={props.recipe} />
      )}
      <Card
        className="card"
        onClick={showModalHandler}
        sx={{
          maxWidth: 330,
          cursor: "pointer",
          zIndex: 1,
          position: "relative",
          margin: 2,
          ["@media (max-width:730px)"]: {
            maxWidth: 250,
            margin: 1,
          },
        }}
      >
        <CardHeader
          action={
            <IconButton aria-label="Save recipe" onClick={recipeSaveHandler}>
              <FavoriteIcon
                sx={{
                  cursor: "pointer",
                  top: 0,
                  right: 0,
                  color: iconColor,
                  zIndex: 100,
                }}
              />
            </IconButton>
          }
          title={props.recipe.title ? props.recipe.title : "No title"}
          subheader={
            props.recipe.servings && props.recipe.nutrition.nutrients[0].amount
              ? "Servings: " +
                props.recipe.servings +
                " Calories: " +
                Math.round(props.recipe.nutrition.nutrients[0].amount) +
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
      <Snackbar
        open={alertMessage !== ""}
        autoHideDuration={4000}
        onClose={alertClosedHandler}
      >
        <Alert
          onClose={alertClosedHandler}
          severity="success"
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Fragment>
  );
};

export default RecipeCard;
