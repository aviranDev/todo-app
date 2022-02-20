const taskControllers = require("./controllers/controllers");
const morgan = require("morgan");
const express = require('express');
require('./db');
const app = express();
const cors = require('cors');
require('dotenv').config();
app.use(morgan("dev"));

app.use(express.json());
app.use(cors());

//ROUTES
app.use('/api/tasks', taskControllers);

const port = process.env.PORT || 3900;
app.listen(port, () => console.log(`Listening on port${port}`));




