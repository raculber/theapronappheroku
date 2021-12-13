import classes from "./LogoutButton.module.css";

const LogoutButton = (props) => {
  return (
    <button className={classes.logoutButton} onClick={props.onClick}>
      Logout
    </button>
  );
};

export default LogoutButton;
