const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
const jsonParser = bodyParser.json();
// const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.json({type: 'application/x-www-form-urlencoded'}));
app.use(jsonParser);
// app.use(urlencodedParser);

//Import Routes
const musicRoutes = require("./routes/musicRoutes");
app.use("/albums", musicRoutes);

//load environment variables
require("dotenv").config();

//The base URI that is being used
console.log(process.env.BASE_URI);

// Set up default mongoose connection
const mongoDB = "mongodb://127.0.0.1/musicnp";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

    app.listen(8000,() => {
        console.log("Running...")
    });


