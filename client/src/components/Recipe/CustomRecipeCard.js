import { useState, Fragment, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CustomRecipeModal from "./CustomRecipeModal";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import TodayIcon from "@mui/icons-material/Today";
import ListAltIcon from "@mui/icons-material/ListAlt";
import veganIcon from "../../images/vegan-icon.jpg";
import glutenFreeIcon from "../../images/gluten_free.jpg";
import dollarIcon from "../../images/dollar_icon.png";
import CardActions from "@mui/material/CardActions";
import vegetarianIcon from "../../images/vegetarian_icon.jpg";
import dairyFree from "../../images/dairy_free.png";
// import recipe from "./recipe";
import axios from "axios";
import { addRecipe, removeRecipe } from "../../store/grocery-list";

const CustomRecipeCard = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const recipes = useSelector((state) => state.groceryList.recipes);
  const [iconColor, setIconColor] = useState("#FF0000");
  const [shoppingCartColor, setShoppingCartColor] = useState("#000000");

  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userId);
  const getRecipeSaved = useCallback(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_SERVICE_URL}/api/get-recipe-saved?id=${props.recipe.id}/&userId=${userId}`,
        {
          headers: {
            "access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        console.log(res);
        setIconColor(res.data.recipeExists ? "#FF0000" : "#A9A9A9");
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.recipe.id, userId]);
  const getRecipeInCart = useCallback(() => {
    let recipeWithId = recipes.filter((recipe) => {
      return recipe.id == props.recipe.id;
    });
    if (recipeWithId.length > 0) {
      setShoppingCartColor("#0000FF");
    }
  }, []);
  useEffect(() => {
    // getRecipeSaved();
    getRecipeInCart();
  }, [getRecipeInCart]);

  const alertClosedHandler = () => {
    setAlertMessage("");
  };
  const recipeSaveHandler = () => {
    axios
      .post(`${process.env.REACT_APP_API_SERVICE_URL}/api/save-recipe`, {
        userId: userId,
        id: props.recipe.id,
        title: props.recipe.title,
        ingredients: props.recipe.ingredients,
        vegan: props.recipe.vegan,
        vegetarian: props.recipe.vegetarian,
        glutenFree: props.recipe.glutenFree,
        dairyFree: props.recipe.dairyFree,
        veryHealthy: props.recipe.veryHealthy,
        cheap: props.recipe.cheap,
        summary: props.recipe.summary,
        image: props.recipe.image,
        instructions: props.recipe.instructions,
        readyInMinutes: props.recipe.readyInMinutes,
        nutrients: props.recipe.nutrients,
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

  const addToGroceryList = () => {
    let recipeWithId = recipes.filter((recipe) => {
      return recipe.id == props.recipe.id;
    });
    if (recipeWithId.length > 0) {
      dispatch(
        removeRecipe({
          id: parseInt(props.recipe.id),
        })
      );
      setAlertMessage("Removed from list");
      setShoppingCartColor("#000000");
    } else {
      dispatch(
        addRecipe({
          id: parseInt(props.recipe.id),
          ingredients: props.recipe.ingredients,
        })
      );
      setShoppingCartColor("#0000FF");
      setAlertMessage("Added to list");
    }
  };

  return (
    <Fragment>
      {showModal && (
        <CustomRecipeModal onClose={hideModalHandler} recipe={props.recipe} />
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
            maxWidth: 300,
            margin: 1,
          },
        }}
      >
        <CardHeader
          action={
            <CardActions disableSpacing>
              <IconButton
                aria-label="Add to grocery list"
                onClick={addToGroceryList}
              >
                <AddShoppingCartIcon
                  sx={{
                    cursor: "pointer",
                    zIndex: 100,
                    color: shoppingCartColor,
                  }}
                />
              </IconButton>

              <IconButton aria-label="Save recipe" onClick={recipeSaveHandler}>
                <FavoriteIcon
                  sx={{
                    cursor: "pointer",
                    top: 0,
                    right: 0,
                    zIndex: 100,
                    color: iconColor,
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

export default CustomRecipeCard;
