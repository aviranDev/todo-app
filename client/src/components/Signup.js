import React, { useState } from 'react';
import userService from "../services/userService";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";
import { Link, useNavigate } from "react-router-dom";
import {
  Typography,
  Paper,
  TextField,
  Button,
  Grid, Card, CardContent
} from "@mui/material";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';

/**
 * SIGNUP VALIDATION SCHEMA TEMPLATE
 */
const schema = Joi.object({
  firstName: Joi.string().min(2).max(255).required().label("First Name"),
  lastName: Joi.string().min(2).max(255).required().label("Last Name"),
  email: Joi.string().min(6).max(255).required().label("Email"),
  password: passwordComplexity().required().label("Password"),
});


function Signup() {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState(false);

  const navigate = useNavigate();

  /**
   * VALIDATE FORM 
   */
  const validateForm = () => {

    //VALIDAE FORM BY THE SCHEMA
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

    // console.log(errors)
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
    setInfo(false)
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

    try {
      const errors = validateForm()
      console.log(errors)
      if (errors) {
        setError(errors)
        return
      }
      const { data: res } = await userService.signupUser(data)
      navigate('/signin');
      console.log(res.message);
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
    }
  }


  const infoMessage = '* Password should contain at least: 8 characters long, 1 Uppercase, 1 Lowercase, 1 symbol';

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)

  };
  // console.log(showPassword)

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  return (
    <div className='form'>
      <Paper elevation={4} >
        <Typography align='center' variant="h4">ToDo<BorderColorIcon /> Sign up</Typography>

        <Card style={{ maxWidth: 450, margin: "0 auto", padding: "20px 5px" }} elevation={5}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={1}>

                <Grid xs={12} sm={6} item>
                  <TextField
                    variant='outlined'
                    label="First Name"
                    name='firstName'
                    value={data.firstName}
                    onChange={handleChange}
                    fullWidth
                    type="text"
                    placeholder='Enter First Name'
                    required
                  />
                  {error && <span className='error'>{error.firstName}</span>}
                </Grid>

                <Grid xs={12} sm={6} item >
                  <TextField
                    variant='outlined'
                    label="Last Name"
                    name='lastName'
                    value={data.lastName}
                    onChange={handleChange}
                    fullWidth
                    type="text"
                    placeholder='Enter Last Name'
                    required
                  />
                  {error && <span className='error'>{error.lastName}</span>}
                </Grid>

                <Grid xs={12} item >
                  <TextField
                    variant='outlined'
                    label="Email"
                    name='email'
                    value={data.email}
                    onChange={handleChange}
                    type="email"
                    fullWidth
                    placeholder='Enter Email'
                    required
                  />
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
                      onClick={() => setInfo(!data.password)}
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
                    {info && <span className='info'>{infoMessage}</span>}
                  </FormControl>
                </Grid>

                <Grid xs={12} item >
                  <Button onClick={validateForm} type='submit' variant='contained' color='primary' fullWidth>Submit</Button>
                </Grid>

              </Grid>
            </form>
          </CardContent>
        </Card>

        <Link style={{ margin: "15px" }} className='link' to={"/signin"} >
          <Typography>
            Sign in
          </Typography>
        </Link>

      </Paper>
    </div >
  )
}

export default Signup