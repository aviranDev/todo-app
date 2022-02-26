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
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';

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

  const [showPassword, setShowPassword] = useState(false);
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

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)

  };
  // console.log(showPassword)

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className='form'>
      <Paper elevation={4}>
        <Typography align='center' variant="h4">ToDo<BorderColorIcon /> Sign in</Typography>
        <Card style={{
          maxWidth: 450,
          margin: "0 auto",
          padding: "20px 5px"
        }} elevation={5}>
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
                  <FormControl sx={{ width: '100%' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      name='password'
                      value={data.password}
                      onChange={handleChange}
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      placeholder='Enter Password'
                      required
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                    {error && <span className='error'>{error.password}</span>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} >
                  <Button onClick={validateForm} type="submit" variant='contained' color='primary' fullWidth>Submit</Button>
                </Grid>

              </Grid>
            </form>
          </CardContent>
        </Card>

        <Link style={{ margin: "15px" }} className='link' to={"/signup"} >
          <Typography>
            Sign up
          </Typography>
        </Link>

      </Paper>
    </div>
  )
}

export default Signin