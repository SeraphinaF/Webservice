const express = require("express");
//Import Models
const Album = require("../models/musicModels");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const album = await Album.find();
        console.log(album);
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

router.post("/", async (req, res) => {
    const album = new Album({
        title: req.body.title,
        genre: req.body.genre,
        artist: req.body.artist,
    })
    try {
        await album.save();
        res.status(201);
        res.json(album);
    } catch (err) {
        res.json({ message: err });
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
        const removedAlbum = await Album.remove({ _Id: req.params.Id });
        res.json(removedAlbum);
    } catch (err) {
        res.status(500);
    }
});

router.options("/", (req, res) => {
    res.setHeader("Allow", "GET", "POST", "PUT", "OPTIONS");
});

module.exports = router;
