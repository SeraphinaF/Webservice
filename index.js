
// Require .env (Dotenv)
require('dotenv').config();

// Log URI
console.log(process.env.BASE_URI);

// Require Express
const express = require("express");
const bodyParser = require('body-parser');

// Import the mongoose module
const mongoose = require("mongoose");

// Set up default mongoose connection
const mongoDB = "mongodb://127.0.0.1/musicnp";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Create Webserver
const app = express();

// Bodyparser middleware to parse x-from-www-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Bodyparser middleware to parse json data
app.use(bodyParser.json({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Require carsRouter
const carsRouter = require("./routes/musicRoutes");

// Create Route for cars
app.use("/albums/", carsRouter);

// Start app on port 8000
app.listen(8000, () => {
    console.log("We are running...");
})