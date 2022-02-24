import React, { useState } from 'react'
import userService from "../services/userService";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";
import {
  Typography,
  Paper,
  TextField,
  Button,
  Grid, Card, CardContent
} from "@mui/material";
import { Link } from "react-router-dom";
import BorderColorIcon from '@mui/icons-material/BorderColor';

/**
 * SIGNIN VALIDATION SCHEMA TEMPLATE
 */
const schema = Joi.object({
  email: Joi.string().min(6).max(255).required().label("Email"),
  password: passwordComplexity().required().label("Password"),
});

function Signin() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  /**
  * VALIDATE FORM 
  */
  const validateForm = () => {

    //Validate from by the schema
    const { error } = schema.validate(data, {
      abortEarly: false,
    });

    if (!error) {
      return null;
    }

    const errors = {};
    for (const detail of error.details) {
      errors[detail.path[0]] = detail.message;
    }

    return errors;
  };


  /**
* HANDLE CHANGE
*/
  const handleChange = ({ currentTarget: input }) => {
    setData({
      ...data,
      [input.name]: input.value
    })
    setError({
      ...error,
      [input.name]: validateInput(input.value)
    })
  }

  /**
  * VALIDATE FIELD INPUT
  */
  const validateInput = ({ name, value }) => {
    const data = {
      [name]: value,
    };

    const { errors } = schema.validate(data);
    return errors ? errors.details[0].message : null;
  };


  /**
   * HANDLE SUBMIT
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = data
    try {
      const errors = validateForm()
      if (errors) {
        setError(errors)
        return
      }
      await userService.logIn(email, password);
      window.location = "/";
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError({ password: error.response.data });
      }
    }
  }

  return (
    <>
      <Paper elevation={4}>
        <Typography align='center' variant="h4">ToDo<BorderColorIcon /> Sign in</Typography>
        <Card style={{ maxWidth: 450, margin: "0 auto", padding: "20px 5px" }} elevation={5}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={1}>

                <Grid xs={12} item >
                  <TextField
                    variant='outlined'
                    label="Email"
                    name='email'
                    value={data.email}
                    onChange={handleChange}
                    type="email"
                    placeholder='Enter Email'
                    fullWidth
                    required />
                  {error && <span className='error'>{error.email}</span>}
                </Grid>

                <Grid xs={12} item >
                  <TextField
                    variant='outlined'
                    label="Password"
                    name='password'
                    value={data.password}
                    onChange={handleChange}
                    type="password"
                    placeholder='Enter Password'
                    fullWidth
                    required />
                  {error && <span className='error'>{error.password}</span>}
                </Grid>

                <Grid item xs={12} >
                  <Button onClick={validateForm} type="submit" variant='contained' color='primary' fullWidth>Submit</Button>
                </Grid>

              </Grid>
            </form>
          </CardContent>
        </Card>

        <Link style={{ margin: "20px" }} className='link' to={"/signup"} >
          <Typography>
            Sign up
          </Typography>
        </Link>

      </Paper>
    </>
  )
}

export default Signin