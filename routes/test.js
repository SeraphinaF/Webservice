const express = require("express");
//Import Models
const Album = require("../models/musicModels");

const router = express.Router();

router.get("/", async (req, res) => {
    const acceptedHeaders = req.accepts(["json", "xml"]); // Get accepted headers
    if (!acceptedHeaders) { // If the header is not supported, return an error
        return res.status(406).json({ error: "Not Acceptable" });
    }
    try {
        const album = await Album.find();
        console.log("We're getting it!");

        const albumsCollection = {
            items: album,
            _links: {
                self: {
                    href: `${process.env.BASE_URI}albums/`
                },
                collection: {
                    href: `${process.env.BASE_URI}albums/`
                }
            },
            pagination: "voor latur",
        }

        if (acceptedHeaders === "xml") { // If the client accepts XML, send XML
            res.set("Content-Type", "application/xml");
            return res.send(xml(albumsCollection));
        }
        // If the client accepts JSON or the accept-header is not specified, send JSON
        res.json(albumsCollection);
    }
    catch {
        res.status(500).send();
    }
});

router.get("/:Id", async (req, res) => {
    try {
        const album = await Album.findById(req.params.Id);
        if (!album) {
            return res.status(404).json({ error: "Album not found!" });
        }
        res.json(album);
    } catch {
        res.status(500).send();
    }
});

router.post("/", (req, res, next) => {
    console.log("Check content-type POST");

    if (req.header("Content-Type") === "application/json" || req.header("Content-Type") === "application/x-www-form-urlencoded") {
        next();
    } else {
        res.status(404).send();
    }
});


router.post("/", async (req, res) => {
    console.log(req.header("Content-Type")); //log de inhoudstype van de aanvraag
    // if (req.header("Content-Type") === "application/json" || req.header("Content-Type") === "application/x-www-form-urlencoded") {
    if (!req.body.title || !req.body.genre || !req.body.artist) {
        res.status(400).json({ error: "Missing required fields" });
    } else {
        const album = new Album({
            title: req.body.title,
            genre: req.body.genre,
            artist: req.body.artist,
        });
        try {
            await album.save();
            res.status(201).json(album);
            console.log("We're posting it!");
        } catch {
            res.status(500).send();
        }
    }
});

// Middleware checking empty values PUT
router.put("/:Id", (req, res, next) => {
    console.log("Middleware to check for empty values")

    if (req.body.title && req.body.genre && req.body.artist) {

        next();
    } else {
        res.status(400).send();
    }
})

// PUT Route
router.put("/:Id", async (req, res) => {

    let album = await Album.findOneAndUpdate(req.params,
        {
            title: req.body.title,
            genre: req.body.genre,
            artist: req.body.artist
        })

    try {
        album.save();

        res.status(200).send();
    } catch {
        res.status(500).send();
    }
})

router.delete("/:Id", async (req, res) => {
    try {
        const album = await Album.findByIdAndDelete(req.params.Id);
        if (!album) {
            return res.status(404).json({ error: "Album not found!" });
        }
        //   const removedAlbum = await album.remove();
        res.status(204).json({ message: "Album deleted successfully" });
    } catch {
        res.status(500).send();
    }
});

router.options("/", (req, res) => {
    console.log("OPTIONS");

    res.setHeader("Allow", "GET, POST, OPTIONS");
    res.send();
})

// OPTIONS Route for details
router.options("/Id", async (req, res) => {
    console.log("OPTIONS (Details)");

    res.setHeader('Allow', 'GET, PUT, DELETE, OPTIONS')
    res.send()
})

// router.options("/", async (req, res) => {
//     try {
//         res.setHeader("Allow", "HEAD, GET, POST, OPTIONS");
//         res.setHeader("Content-Length", "0");
//         res.send(200);
//     } catch {
//         res.status(400);
//     }
// });
module.exports = router;