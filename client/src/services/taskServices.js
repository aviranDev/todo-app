import axois from 'axios';
const apiUrl = "http://localhost:3900/api";

/**
 * CREATE TASK
 */
export const addTask = (task) => {
  return axois.post(`${apiUrl}/tasks/add-task`, task);
}


/**
 * DISPLAY ALL TASKS
 */
export const getAllTasks = () => {
  return axois.get(`${apiUrl}/tasks/display-my-tasks`);
}


/**
 * UPDATE TASK
 */
export const updateTask = (id, task) => {
  return axois.put(`${apiUrl}/tasks/edit-task/${id}`, task)
}


/**
 * DELETE TASK
 */
export const removeTask = (id) => {
  return axois.delete(`${apiUrl}/tasks/remove-task/${id}`)
}

const taskService = {
  addTask,
  getAllTasks,
  updateTask,
  removeTask,
}


export default taskService;