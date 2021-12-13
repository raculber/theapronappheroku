import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { addUser } from "../../store/auth-slice";
import { useHistory } from "react-router";
import { createBrowserHistory } from "history";
import axios from "axios";

const theme = createTheme();

export default function SignUp() {
  const history = createBrowserHistory({ forceRefresh: true }); //refresh page if signup succesfull
  const dispatch = useDispatch(); //react redux, calls
  const [token, setToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    //when token state is changed this is called/ refresh
    localStorage.setItem("token", token);
    if (token !== "") {
      axios
        .get(`${process.env.REACT_APP_API_SERVICE_URL}/api/auth`, {
          headers: {
            "access-token": localStorage.getItem("token"),
          },
        })
        .then((res) => {
          console.log(res);
          history.replace("/");
        })
        //Use this code block if user not authenticated
        .catch((err) => {
          console.log(err); //add error message
        });
    }
  }, [token, history]);

  const handleSubmit = (event) => {
    //to do sign in/sign up
    event.preventDefault(); //stop from refreshing page
    const data = new FormData(event.currentTarget);
    const userInfo = {
      enteredEmail: data.get("email"),
      enteredPassword: data.get("password"),
      reenteredPassword: data.get("reenteredPassword"),
    };
    // eslint-disable-next-line no-console
    console.log(userInfo);
    axios
      .post(`${process.env.REACT_APP_API_SERVICE_URL}/api/sign-up`, userInfo)
      .then((res) => {
        // res.data.message will contain necessary info about why
        // sign up/in failed
        console.log(res);
        if (res.data.message) {
          // Handler server error in this code block
          setErrorMessage(res.data.message);
        } else if (res.data.token) {
          dispatch(
            addUser({
              userId: res.data.result.userId,
              email: res.data.result.enteredEmail,
            })
          );
          setToken(res.data.token);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              {/* <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid> */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="reenteredPassword"
                  label="Retype Password" //look at difference btw label, type...
                  type="password"
                  id="reenteredPassword"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="http://localhost:3000/sign-in" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
