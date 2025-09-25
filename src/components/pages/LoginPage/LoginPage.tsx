import {
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  Link,
} from "@mui/material";
import React, { useContext } from "react";

import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import ActiveUserContext from "../../../Contexts/ActiveUserContext";

const validationSchema = Yup.object().shape({
  email: Yup.string(),
  password: Yup.string(),
});

const Login = () => {
  const paperStyle = {
    padding: 20,
    height: "70vh",
    width: 280,
    margin: "20px auto",
  };
  const btnstyle = { margin: "8px 0" };
  const navigate = useNavigate();
  const { login } = useContext(ActiveUserContext);

  const handleSubmit = (values: { email: string; password: string }) => {
    login(values.email.toLowerCase(), values.password)
      .then(() => {
        console.log(values);

        navigate("/");
      })
      .catch((error) => {
        if (
          (typeof error.response !== "undefined" &&
            error.response.status === 401) ||
          error.response.status === 403
        ) {
          alert("invalid login");
        } else {
          alert("login Error");
        }
      });
  };
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{
        minHeight: "100vh",
        background: "#2c2c2c",
      }}
    >
      <Paper
        elevation={10}
        style={paperStyle}
        sx={{ background: "#2c2c2c", color: "#fff" }}
      >
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validateOnChange
          isInitialValid
        >
          {(props) => (
            <Form onSubmit={props.handleSubmit}>
              <TextField
                data-cy="email"
                label="email"
                id="email"
                placeholder="Enter username"
                fullWidth
                required
                autoFocus
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.email}
                sx={{
                  mb: 2,
                  color: "#000000",
                  input: { color: "#000000" },
                  backgroundColor: "#fff",
                  borderRadius: "4px",
                }}
              />
              {props.errors.email && (
                <div id="feedback">{props.errors.email}</div>
              )}

              <TextField
                data-cy="password"
                id="password"
                label="password"
                placeholder="Enter password"
                type="password"
                fullWidth
                required
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.password}
                sx={{
                  mb: 2,
                  color: "#000000",
                  input: { color: "#000000" },
                  backgroundColor: "#fff",
                  borderRadius: "4px",
                }}
              />
              {props.errors.password && (
                <div id="feedback">{props.errors.password}</div>
              )}

              <Button
                data-cy="submit-login"
                type="submit"
                color="primary"
                variant="contained"
                style={btnstyle}
                fullWidth
                sx={{
                  backgroundColor: "#4A4343",
                  "&:hover": { backgroundColor: "#4A4343" },
                  borderRadius: "0px",
                }}
              >
                Sign in
              </Button>
            </Form>
          )}
        </Formik>

        <Typography sx={{ mt: 1 }}>
          No Account?
          <Link
            href="#"
            sx={{
              ml: 1,
              width: "100%",
              color: "#fff",
            }}
            onClick={() => navigate("/register")}
          >
            SIGN UP
          </Link>
        </Typography>
        <Typography>
          <Link href="#">Forgot password</Link>
        </Typography>
      </Paper>
    </Grid>
  );
};

export default Login;
