const { User, validLoginFileds } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');


/**
 * LOGIN USER 
 */
router.post("/login", async (req, res) => {
  try {
    //VALIDATE USER FORM FIELDS 
    const { error } = validLoginFileds(req.body);
    if (error) {
      //Bad Request
      return res.status(400).send(error.details[0].message);
    }

    //FIND USER EXISTNCE
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      //Unauthorized
      return res.status(401).send('Invalid Email or Password');
    }

    //VALIDATE USER PASSWORD
    const validPassword = await bcrypt.compareSync(req.body.password, user.password);
    if (!validPassword) {
      //Unauthorized
      return res.status(401).send('Invalid email or password');
    }

    //GENERATE JSON WEB TOKEN
    const token = user.generateAuthToken();
    res.status(200).send({ token, message: 'Logged in successfully' });

  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});


module.exports = router;