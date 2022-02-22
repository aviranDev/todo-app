import React, { useState, useEffect } from "react";
import {
  addTask,
  getAllTasks,
  updateTask,
  removeTask,
} from "../services/taskServices";
import { Typography, Paper, TextField, Checkbox, Button, Grid } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { Link } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';


function Tasks({ user }) {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState("");
  console.log(user);
  /*****************************************************
  * CRUD API TODO TASK
  */

  /**
   * DISPLAY ALL USER TASKS
   */
  useEffect(() => {
    async function fecthAllTasksData() {
      try {
        if (user) {
          const { data } = await getAllTasks();
          setTasks(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fecthAllTasksData();
  }, [setTasks, user])
  console.log(tasks);


  /**
   * ADD TASK
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await addTask({ task: currentTask });
      tasks.push(data);
      setCurrentTask("");
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * EDIT TODO TASK
   */
  const handleUpdate = async (currentTask) => {
    const originalTasks = tasks;
    try {
      const tasks = [...originalTasks];
      const index = tasks.findIndex((task) => task._id === currentTask);
      tasks[index] = { ...tasks[index] };
      tasks[index].completed = !tasks[index].completed;
      setTasks(tasks)
      await updateTask(currentTask, {
        completed: tasks[index].completed,
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * REMOVE TODO TASK
   */
  const handleDelete = async (currentTask) => {
    try {
      const updatedTasks = tasks.filter((task) => task._id !== currentTask);
      setTasks(updatedTasks);
      await removeTask(currentTask);
    } catch (error) {
      console.log(error);
    }
  }


  /**
   * CHANGE INPUT VALUE
   */
  const handleChange = ({ currentTarget: input }) => {
    setCurrentTask(input.value)
  }

  return (
    <Paper elevation={5} className="container">
      <div>
        <Link className='signout' to={"/signout"} >
          Signout
        </Link>
      </div>

      <div className="heading">
        <Typography variant="h4">ToDo<BorderColorIcon /></Typography>
      </div>

      <form onSubmit={handleSubmit} className="flex" style={{ margin: "15px 0" }}>
        <TextField
          variant="outlined"
          size="small"
          style={{ width: "80%" }}
          value={currentTask}
          required={true}
          onChange={handleChange}
          placeholder="Add New TO-DO"
        />

        <Grid m={2} item xs={1} sm={3} xl={2} lg={3}>
          <Button
            style={{ height: "40px" }}
            color="primary"
            variant="outlined"
            type="submit"
          >
            <AddIcon />
          </Button>
        </Grid>
      </form>
      <div>
        {tasks.map(task => (
          <Paper elevation={2} key={task._id} className="flex task_container">
            <Checkbox
              checked={task.completed}
              onClick={() => handleUpdate(task._id)}
              color="primary"
            />
            <div className={task.completed ? "task line_through" : "task"}>
              {task.task}
            </div>
            <Button
              onClick={() => handleDelete(task._id)}
              color="secondary"
            >
              <DeleteIcon /></Button>
          </Paper>
        ))}
      </div>
    </Paper>
  )
}

export default Tasks;