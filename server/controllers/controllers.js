const Task = require('../models/task');
const express = require('express');
const router = express.Router();

/**
 * CREATE TASK
 */
router.post('/add-task', async (req, res) => {
  try {
    const task = await new Task(req.body).save();
    return res.send(task);
  } catch (error) {
    return res.send(error);
  }
});


/**
 * DISPLAY ALL TASKS
 */
router.get('/display-all-tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.send(tasks);
  } catch (error) {
    res.send(error);
  }
});


/**
 * UPDATE TASK
 */
router.put('/edit-task/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate({
      _id: req.params.id
    }, req.body);
    res.send(updatedTask);
  } catch (error) {
    res.send(error);
  }
});


/**
 * DELETE TASK
 */
router.delete('/remove-task/:id', async (req, res) => {
  try {
    const removedTask = await Task.findOneAndDelete(req.params.id);
    res.send(removedTask);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;