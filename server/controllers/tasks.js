const Task = require('../models/task');
const express = require('express');
const router = express.Router();
const authJWT = require("../middleware/authUser");

/**
 * CREATE TASK
 */
router.post('/add-task', authJWT, async (req, res) => {
  try {
    //VALIDATE USER LOGGED IN
    if (!req.user) {
      //UNAUTHORIZED 401
      return res.status(401).send("Only registered users allowed to create task");
    }
    const task = await new Task({ ...req.body, user_id: req.user._id }).save();
    return res.send(task);
  } catch (error) {
    return res.send(error);
  }
});


/**
 * DISPLAY ALL TASKS
 */
router.get('/display-my-tasks', authJWT, async (req, res) => {
  try {
    //VALIDATE USER LOGGED IN
    if (!req.user) {
      //UNAUTHORIZED 401
      return res.status(401).send("Only registered users allowed to display tasks");
    }

    const myTasks = { user_id: req.user._id };
    const tasks = await Task.find(myTasks);
    res.send(tasks);
  } catch (error) {
    res.send(error);
  }
});


/**
 * UPDATE TASK
 */
router.put('/edit-task/:id', authJWT, async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate({
      _id: req.params.id,
      user_id: req.user._id
    }, req.body);
    res.send(updatedTask);
  } catch (error) {
    res.send(error);
  }
});


/**
 * DELETE TASK
 */
router.delete('/remove-task/:id', authJWT, async (req, res) => {
  try {
    const removedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id
    });
    res.send(removedTask);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;




/* 

router.get('/display-all-tasks', authJWT, async (req, res) => {
  try {
    //VALIDATE USER LOGGED IN
    if (!req.user) {
      //UNAUTHORIZED 401
      return res.status(401).send("Only registered users allowed to display tasks");
    }

    const tasks = await Task.find();
    res.send(tasks);
  } catch (error) {
    res.send(error);
  }
});


*/