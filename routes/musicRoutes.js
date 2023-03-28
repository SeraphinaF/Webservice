const express = require("express");
//Import Models
const Album = require("../models/musicModels");

const router = express.Router();

router.get("/", async (req, res) => {
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

        const acceptedHeaders = req.accepts(["json", "xml"]); // Get accepted headers
        if (!acceptedHeaders) { // If the header is not supported, return an error
            return res.status(406).json({ error: "Not Acceptable" });
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
        res.json(album);
    } catch {
        res.status(500);
    }
});

//Middleware to check headers for POST
router.post("/", (req, res, next) => {
    console.log("Check content-type POST");

    if (req.header("Content-Type") === "application/json") {
        next();
    } else {
        res.status(404).send();
    }
});


router.post("/", async (req, res) => {
    const album = new Album({
        title: req.body.title,
        genre: req.body.genre,
        artist: req.body.artist,
    })
    try {
        await album.save();
        // res.status(201);
        res.json(album);
    } catch {
        res.status(500).send();
    }
    console.log("We're posting it!");
});


router.put("/:Id", async (req, res) => {
    try {
        const album = await Album.findById(req.params.Id)

        if (req.body.title) {
            album.title = req.body.title
        }

        if (req.body.genre) {
            album.genre = req.body.genre
        }

        if (req.body.artist) {
            album.artist = req.body.artist
        }
        await album.save();
        res.json(album);
    } catch {
        res.status(404).send();
    }
    console.log("PUTTING IT!");
});

router.delete("/:Id", async (req, res) => {
    try {
        const removedAlbum = await Album.delete();
        res.json(removedAlbum);

    } catch {
        res.status(404).send();
    }
});

router.options("/", async (req, res) => {
    try {
        res.setHeader("Allow", "HEAD, GET, POST, OPTIONS");
        res.send();
    } catch {
        res.status(400);
    }
});

module.exports = router;