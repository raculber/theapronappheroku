import * as React from "react";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createBrowserHistory } from "history";
import RecipeCard from "../Recipe/RecipeCard";
import CustomRecipeCard from "../Recipe/CustomRecipeCard";
import { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";
import SearchBar from "material-ui-search-bar";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Radio from "@mui/material/Radio";
import Button from "@mui/material/Button";
import CustomIngredientsTable from "../Recipe/CustomIngredientsTable";
import "./SavedRecipes.css";
import { clearList } from "../../store/grocery-list";

const theme = createTheme();

export default function SavedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [totalRecipes, setTotalRecipes] = useState(null);
  const [pageCount, setPageCount] = useState(5);
  const [page, setPage] = useState(1);
  const userId = useSelector((state) => state.user.userId);
  const groceryList = useSelector((state) => state.groceryList.recipes);
  const groceryListCount = useSelector((state) => state.groceryList.count);
  const dispatch = useDispatch();
  const history = createBrowserHistory({ forceRefresh: true });
  console.log(userId);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (totalRecipes == null) {
      setLoading(true);
      axios
        .get(`${process.env.REACT_APP_API_SERVICE_URL}/api/get-saved-recipes?userId=${userId}`, {
          headers: {
            "access-token": localStorage.getItem("token"),
          },
        })
        .then((res) => {
          if (res.data.recipes.length == 0) {
            setLoading(false);
            setTotalRecipes([]);
          } else {
            setTotalRecipes(res.data.recipes);
            console.log(res.data.recipes);
            setRecipes(res.data.recipes.slice(0, 20));
            setLoading(false);
          }
        })
        .catch((err) => {
          // console.log(err);
          setTotalRecipes([]);

          console.log(totalRecipes);
          setLoading(false);
        });
    }
  }, []);

  const pageChangeHandler = (event, value) => {
    setPage(value);
    console.log(totalRecipes);
    if (value < 6) {
      setRecipes(totalRecipes.slice(20 * (value - 1), 20 * value));
    }
  };

  const createGroceryList = () => {
    axios
      .post(`${process.env.REACT_APP_API_SERVICE_URL}/api/aggregate-grocery-lists`, {
        userId: userId,
        recipes: groceryList,
        headers: {
          "access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res);
        if (res.data.list) {
          dispatch(clearList());
          history.replace("/grocery-lists");
        }
      })
      .catch((err) => console.log(err));
  };

  //const searchRecipes = (query) => {};

  return (
    <div className="saved-recipes">
      <Button
        variant="contained"
        size="large"
        color="secondary"
        onClick={createGroceryList}
        sx={{
          margin: "auto",
          width: "50%",
          ["@media (min-width:650px)"]: {
            margin: "15px",
            width: "350px",
          },
        }}
      >
        Create Grocery List [{groceryListCount}]
      </Button>
      {loading && (
        <CircularProgress sx={{ margin: "auto" }} color="secondary" />
      )}
      {/* <div className="search">
        <SearchBar
          style={{
            width: "50%",
            margin: 10,
            marginLeft: 15,
          }}
          onRequestSearch={(value) => {
            searchRecipes(value);
          }}
        />
        <Accordion
          sx={{
            width: "30%",
            margin: 0,
            marginTop: 1,
            ["@media (max-width:830px)"]: {
              width: "50%",
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{ padding: 0, marginLeft: 1 }}
          ></AccordionSummary>
          <AccordionDetails sx={{ display: "flex", flexDirection: "row" }}>
            <FormGroup>
              <Typography>Exclusions</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    value="glutenFree"
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label="Gluten Free"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="dairyFree"
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label="Dairy Free"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="seafood"
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label="Seafood"
              />
            </FormGroup>
          </AccordionDetails>
        </Accordion>
      </div> */}

      <div className="recipes">
        {recipes.map((recipe) => (
          <CustomRecipeCard recipe={recipe} key={recipe.id} />
        ))}
      </div>
      <Stack spacing={2} sx={{ margin: "auto" }}>
        <Pagination
          sx={{ margin: "auto" }}
          count={pageCount}
          page={page}
          onChange={pageChangeHandler}
        />
      </Stack>
    </div>
  );
}
