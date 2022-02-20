import React, { useState, useEffect } from "react";
import {
  addTask,
  getAllTasks,
  updateTask,
  removeTask,
} from "../services/taskServices";
import { Typography, Paper, TextField, Checkbox, Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';


function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState("");

  /*****************************************************
  * CRUD API DOTO TASK
  */

  /**
   * DISPLAY ALL TODO TASKS
   */
  useEffect(() => {
    async function fecthAllTasksData() {
      try {
        const { data } = await getAllTasks();
        setTasks(data);
      } catch (error) {
        console.log(error);
      }
    }
    fecthAllTasksData();
  }, [setTasks])
  console.log(tasks);


  /**
   * ADD TODO TASK
   * @param {*} e 
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
   * @param {*} currentTask 
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
   * @param {*} currentTask 
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


  /*****************************************************
   * FORM INPUT OPERATION
   */

  /**
   * CHANGE INPUT VALUE
   * @param {*} param0 
   */
  const handleChange = ({ currentTarget: input }) => {
    setCurrentTask(input.value)
  }

  return (
    <>
      {/* <Typography variant="h2">Todo list</Typography> */}
      <Paper elevation={5} className="container">
        <div className="heading">
          <Typography variant="h3">TODO Today</Typography>
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
          <Button
            style={{ height: "40px" }}
            color="primary"
            variant="outlined"
            type="submit"
          >
            Add task
          </Button>
        </form>
        <div>
          {tasks.map(task => (
            <Paper key={task._id} className="flex task_container">
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
    </>
  )
}

export default Tasks;