import "./RecipesByDay.css";
import SavedCalendarDisplayRecipeCard from "../Recipe/SavedCalendarDisplayRecipeCard";
import CustomRecipeCard from "../Recipe/CustomRecipeCard";
import { Typography } from "@mui/material";
const RecipesByDay = (props) => {
  return (
    <div className="recipes-on-day">
      <Typography align="center" variant="h5">
        Recipes saved on date: {props.date}
      </Typography>
      <div className="recipes">
        {props.recipes.map((recipe) => (
          <SavedCalendarDisplayRecipeCard recipe={recipe} key={recipe.id} />
        ))}
      </div>
    </div>
  );
};

export default RecipesByDay;
