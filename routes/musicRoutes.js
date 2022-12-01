const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    console.log("GET");
    res.send("Hello World!");
})

router.post("/", (req, res) => {
    console.log("POST");
    res.send("Hello World!");
})

router.delete("/", (req, res) => {
    console.log("DELETE");
    res.send("Hello World!");
})

router.options("/", (req, res) => {
    console.log("You've got options Gurlll");
    res.send("Hello World!");
})

module.exports = router;
