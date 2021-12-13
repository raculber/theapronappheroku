import Typography from "@mui/material/Typography";
import classes from "./RecipeModal.module.css";
import IngredientsTable from "./IngredientsTable";

import Modal from "../UI/Modal";
const RecipeModal = (props) => {
  let recipeInstructions = "";
  if (props.recipe.analyzedInstructions.length > 0) {
    recipeInstructions = props.recipe.analyzedInstructions[0].steps.map(
      (instruction) => (
        <Typography paragraph style={{ margin: 10 }}>
          Step: {" " + instruction.number + " " + instruction.step}
        </Typography>
      )
    );
  }
  let modifiedSummary = props.recipe.summary ? props.recipe.summary : null;

  modifiedSummary = modifiedSummary.replace(/<\/?[^>]+(>|$)/g, "");
  return (
    <Modal onClose={props.onClose}>
      <Typography variant="h5" style={{ margin: 10 }}>
        {props.recipe.title}
      </Typography>
      <Typography
        paragraph
        style={{ margin: 10, fontSize: 20, color: "#808080" }}
      >
        Servings: {" " + props.recipe.servings} Calories:
        {" " + Math.round(props.recipe.nutrition.nutrients[0].amount) + " "}
        Ready In: {" " + Math.round(props.recipe.readyInMinutes) + " minutes"}
      </Typography>
      <div className={classes.imageAndSummary}>
        <img
          src={props.recipe.image}
          style={{ margin: 10 }}
          alt={props.recipe.title}
          title={props.recipe.title}
        />
        <div className={classes.summary}>
          <Typography
            paragraph
            style={{ margin: 10, fontSize: 20, color: "#808080" }}
          >
            Summary:
          </Typography>
          <Typography paragraph style={{ margin: 10 }}>
            {modifiedSummary}
          </Typography>
        </div>
      </div>
      <Typography
        paragraph
        style={{ margin: 10, fontSize: 20, color: "#808080" }}
      >
        Ingredients:
      </Typography>
      <IngredientsTable recipe={props.recipe} />
      <Typography
        paragraph
        style={{ margin: 10, fontSize: 20, color: "#808080" }}
      >
        Instructions:
      </Typography>
      <Typography paragraph>{recipeInstructions}</Typography>
    </Modal>
  );
};

export default RecipeModal;
