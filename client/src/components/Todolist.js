import React, { useState, useEffect } from "react";


import {
  addTask,
  getAllTasks,
  updateTask,
  removeTask,
} from "../services/taskServices";
import { Typography, Paper, TextField, Checkbox, Button, Grid, Card, CardContent } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { Link } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/Create';
import LogoutIcon from '@mui/icons-material/Logout';


function Tasks({ user }) {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState("");
  const [todoEditting, setTodoEditting] = useState(null);
  const [edittingText, setEdittingText] = useState(null);
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

  /*   console.log("tasks ", tasks);
    console.log("currentTask: ", currentTask)
    console.log("todoEditting ", todoEditting);
    console.log("edittingText ", edittingText);
    console.log("------------------------------------------------- "); */

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

  const submitEdits = async (id) => {
    if (!edittingText) {
      setTodoEditting(null);
      return
    }
    const updatedTodos = [...tasks].map((task) => {
      if (task._id === id) {
        task.task = edittingText;
      }
      return task;
    });

    setTasks(updatedTodos);
    await updateTask(id, {
      task: edittingText,
    });
    setTodoEditting(null);
    setEdittingText(null);
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
    <div className="todo">
      <Paper elevation={4}>

        <Link className='signout' to={"/signout"} >
          <Typography>
            <LogoutIcon />
          </Typography>
        </Link>

        <Typography align='center' variant="h4">ToDo<BorderColorIcon /></Typography>

        <Card style={{
          maxWidth: 450,
          margin: "0 auto",
          background: "grey"
        }} elevation={5} >
          <CardContent>
            <form onSubmit={handleSubmit} >
              <Grid container spacing={1}>
                <Grid xs={9} item >
                  <TextField
                    variant="outlined"
                    size="small"
                    value={currentTask}
                    required
                    onChange={handleChange}
                    placeholder="Add New TO-DO"
                  />
                </Grid>
                <Grid xs={3} item >
                  <Button
                    color="primary"
                    type="submit"
                  >
                    <AddIcon />
                  </Button>
                </Grid>
              </Grid>
            </form>
            <div>
              {tasks.map(task => (
                <Paper elevation={3} key={task._id} className="flex task_container">
                  <Checkbox
                    checked={task.completed}
                    onClick={() => handleUpdate(task._id)}
                    color="primary"
                  />
                  <div className={task.completed ? "task line_through" : "task"}>
                    {task._id === todoEditting ? (
                      <TextField style={{ width: "100%" }}
                        variant="standard"
                        size="small"
                        defaultValue={task.task}
                        type="text"
                        onChange={(e) => setEdittingText(e.target.value)}
                      />
                    ) : (
                      <Grid xs={12} item>
                        {task.task}
                      </Grid>
                    )}
                  </div>

                  <div>
                    {task._id === todoEditting ? (
                      <Button
                        onClick={() => submitEdits(task._id)} color="secondary">
                        <BorderColorIcon style={{ color: "blue" }} />
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setTodoEditting(task._id)}
                        color="secondary"
                      >
                        <CreateIcon style={{ color: "#cfcfcf" }} />  </Button>)}
                  </div>

                  <Button
                    onClick={() => handleDelete(task._id)}
                    color="secondary"
                  >
                    <DeleteIcon /></Button>
                </Paper>
              ))}
            </div>
          </CardContent>

        </Card>
      </Paper>
    </div>
  )
}

export default Tasks;