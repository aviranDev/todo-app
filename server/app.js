const morgan = require("morgan");
const express = require('express');
const taskControllers = require("./controllers/tasks");
const userControllers = require("./controllers/user");
const authControllers = require("./controllers/auth");
require('./db');
const app = express();
const cors = require('cors');
// require('dotenv').config();
app.use(morgan("dev"));

app.use(express.json());
app.use(cors());

//ROUTES
app.use('/api/users', userControllers);
app.use('/api/auth', authControllers);
app.use('/api/tasks', taskControllers);

const port = process.env.PORT || 3900;
app.listen(port, () => console.log(`Listening on port${port}`));




