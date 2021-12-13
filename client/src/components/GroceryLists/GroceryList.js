import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import IconButton from "@mui/material/IconButton";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import axios from "axios";
const GroceryList = (props) => {
  const userId = useSelector((state) => state.user.userId);
  console.log(props.list.items);
  const deleteGroceryList = () => {
    axios
      .delete(`${process.env.REACT_APP_API_SERVICE_URL}/api/delete-grocery-list`, {
        data: { userId: userId, name: props.list.name },
        headers: {
          "access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res);
        if (res.data.message == "Removed grocery list") props.getGroceryLists();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Card
      sx={{
        ["@media (min-width:650px)"]: {
          width: "40%",
          maxWidth: "40%",
          overflow: "auto",
        },

        margin: "15px",
        ["@media (max-width:650px)"]: {
          width: "100%",
          maxWidth: "100%",
          overflow: "auto",
        },
      }}
    >
      <CardHeader
        action={
          <CardActions disableSpacing>
            <IconButton aria-label="Delete list" onClick={deleteGroceryList}>
              <DeleteIcon />
            </IconButton>
          </CardActions>
        }
        title={props.list.name}
      />
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          maxHeight: "450px",
          flexWrap: "wrap",
        }}
      >
        {props.list.items.map((item) => (
          <li style={{ marginRight: "5px", fontSize: "20px" }}>{item.name}</li>
        ))}
      </CardContent>
    </Card>
  );
};
export default GroceryList;
