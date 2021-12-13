import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Autocomplete from "@mui/material/Autocomplete";
import AddIcon from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";
import ListItemText from "@mui/material/ListItemText";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import SendIcon from "@mui/icons-material/Send";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import { clearRecipes } from "../../store/pantry";
import { addRecipe } from "../../store/pantry";
import recipe2 from "../Recipe/recipe2";
import recipe from "../Recipe/recipe";
import "./Pantry.css";
import axios from "axios";
import RecipeCard from "../Recipe/RecipeCard";
function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}

const Pantry = () => {
  const userId = useSelector((state) => state.user.userId);
  const [ingredientSearch, setIngredientSearch] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState({
    name: "",
    image: "",
  });
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState(
    useSelector((state) => state.pantry.recipes)
  );
  const [allNull, setAllNull] = useState(
    recipes.every(function (v) {
      return v === null;
    })
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (allNull) dispatch(clearRecipes());
    axios
      .get(
        `${process.env.REACT_APP_API_SERVICE_URL}/api/get-ingredients?userId=${userId}`,
        {
          headers: {
            "access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        setIngredients(res.data.ingredients);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const removeIngredient = (name) => {
    axios
      .delete(
        `${process.env.REACT_APP_API_SERVICE_URL}/api/delete-ingredient`,
        {
          data: { userId: userId, name: name },
          headers: {
            "access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        console.log(res);
        if (res.data.message == "Ingredient deleted") {
          var filtered = ingredients.filter(function (value, index, arr) {
            return value.name !== name;
          });
          setIngredients(filtered);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addIngredient = () => {
    axios
      .post(`${process.env.REACT_APP_API_SERVICE_URL}/api/add-ingredient`, {
        userId: userId,
        ingredientName: selectedIngredient.name,
        image: selectedIngredient.image,
        headers: {
          "access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.data.message) {
          setError(res.data.message);
        } else {
          console.log(res.data.data);
          let addedIngredient = {
            name: res.data.data.ingredientName,
            image: res.data.data.image,
          };
          let newIngredients = ingredients;
          newIngredients.push(addedIngredient);
          setIngredients(newIngredients);
          forceUpdate();
          // setIngredients(ingredients.push(addedIngredient));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onItemSelected = (event, value) => {
    setSelectedIngredient(value);
  };

  const onQueryChange = (event, value) => {
    let ingredientInSearch = false;
    if (event.type !== "blur") {
      ingredientSearch.forEach((elem) => {
        if (elem.name === value) {
          setSelectedIngredient(elem);
          ingredientInSearch = true;
        }
      });
    }

    if (!ingredientInSearch && event.type !== "blur")
      setSelectedIngredient({ name: "", image: "" });
    if (event.type !== "blur") {
      axios
        .get(
          `${process.env.REACT_APP_API_SERVICE_URL}/api/autocomplete-ingredient-search?query=${value}`,
          {
            headers: {
              "access-token": localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          setIngredientSearch(res.data.results);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getRecommendedRecipes = () => {
    setLoading(true);
    dispatch(clearRecipes());
    let commaSeperatedIngredients = ingredients
      .map(function (elem) {
        return elem.name;
      })
      .join(",");
    axios
      .get(
        `${process.env.REACT_APP_API_SERVICE_URL}/api/get-recommended?ingredients=${commaSeperatedIngredients}`,
        {
          headers: {
            "access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        let newRecipes = [];
        res.data.results.forEach((recipe) => {
          axios
            .get(
              `${process.env.REACT_APP_API_SERVICE_URL}/api/get-recipe-by-name?name=${recipe.title}`,
              {
                headers: {
                  "access-token": localStorage.getItem("token"),
                },
              }
            )
            .then((res) => {
              if (res.data.recipes) {
                if (res.data.recipes.results.length > 0) {
                  newRecipes.push(res.data.recipes.results[0]);
                  setRecipes(newRecipes);
                  setAllNull(false);
                  dispatch(addRecipe(res.data.recipes.results[0]));
                }
              }
            })
            .catch((err) => {
              console.log(err);
            });
        });
        setRecipes(newRecipes);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="pantry">
      <div className="add-ingredient">
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          freeSolo="true"
          options={ingredientSearch}
          className="search-bar"
          getOptionLabel={(option) => option.name}
          onChange={onItemSelected}
          onInputChange={onQueryChange}
          renderInput={(params) => (
            <TextField {...params} label="Search Ingredients" />
          )}
        />
        {/* <SearchBar className="search-bar" onChange={onQueryChange} /> */}
        <Button
          color="success"
          sx={{
            width: "60px",
            height: "50px",
            marginTop: "15px",
            margin: "10px",
            marginLeft: "5px",
          }}
          onClick={addIngredient}
          variant="contained"
          endIcon={<AddIcon />}
        >
          Add
        </Button>
      </div>
      <Button
        variant="contained"
        onClick={getRecommendedRecipes}
        sx={{
          width: "300px",
          padding: "10px",
          marginLeft: "15px",
          paddingRight: "20px",
          backgroundColor: "#880085",
          "&:hover": {
            backgroundColor: "#6C4681",
          },
          "@media (max-width:650px)": {
            margin: "auto",
            marginBottom: "10px",
          },
        }}
        endIcon={!loading ? <SendIcon /> : <CircularProgress color="inherit" />}
      >
        Get Recommended Recipes
      </Button>
      <div className="ingredients-and-recipes">
        <List
          className="ingredient-list"
          sx={{
            margin: "10px",
            "@media (max-width:650px)": {
              margin: "auto",
            },
          }}
        >
          {ingredients.map((ingredient) => (
            <ListItem
              secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon
                    onClick={() => removeIngredient(ingredient.name)}
                  />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar
                  alt={ingredient.name + " picture"}
                  src={ingredient.image}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  ingredient.name.charAt(0).toUpperCase() +
                  ingredient.name.slice(1)
                }
              />
            </ListItem>
          ))}
          {ingredients.length == 0 && (
            <ListItem>
              <ListItemText primary="No ingredients added" />
            </ListItem>
          )}
        </List>

        {!allNull && (
          <div className="recipes">
            {recipes.map((recipe) => (
              <RecipeCard recipe={recipe} />
            ))}
          </div>
        )}
      </div>
      <Snackbar
        open={error !== ""}
        anchorOrigin={{ vertical: "center", horizontal: "bottom" }}
        autoHideDuration={4000}
        onClose={() => setError("")}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </div>
  );
};

export default Pantry;
