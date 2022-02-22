const { User, validateUserSchema } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');


/**
 * CREATE USER REGISTRATION
 */
router.post('/create-user', async (req, res) => {
  try {
    //VALIDATE USER FORM FIELDS 
    const { error } = validateUserSchema(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //FIND USER EXISTNCE
    const user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered');

    //GENERATE SALT AND ASSIGN IT FOR HASH USER PASSWORD 
    const salt = await bcrypt.genSaltSync(Number(process.env.SALT))
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //GENERATE USER
    new User({
      ...req.body,
      password: hashPassword,
    }).save();

    //SERVER RESPONSE
    res.status(201).send('User created successfully');
  } catch (error) {
    res.status(500).send({ message: 'Internet Server Error' });
  }
});


module.exports = router;

