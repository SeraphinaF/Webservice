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
        res.json(album);
    } catch {
        res.status(500);
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
    if (req.header("Content-Type") === "application/json" || req.header("Content-Type") === "application/x-www-form-urlencoded") {
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
    } else {
        res.status(404).send();
    }
});


router.put("/:Id", async (req, res) => {
    // Check the Content-Type header
    if (req.header("Content-Type") === "application/json") {
      // Find the album to update
      const album = await Album.findById(req.params.id);
      if (!album) {
        return res.status(404).send("Album not found");
      }
      // Update the album properties
      album.title = req.body.title;
      album.genre = req.body.genre;
      album.artist = req.body.artist;
  
      // Save the updated album
      try {
        await album.save();
        res.status(200).json(album);
      } catch {
        res.status(500).send();
      }
    } else {
      res.status(415).send("Unsupported Media Type");
    }
  });
  

// router.put("/:Id", async (req, res) => {
//     try {
//         const album = await Album.findById(req.params.Id)

//         if (req.body.title) {
//             album.title = req.body.title
//         }

//         if (req.body.genre) {
//             album.genre = req.body.genre
//         }

//         if (req.body.artist) {
//             album.artist = req.body.artist
//         }
//         await album.save();
//         res.status(200).json(album);
//     } catch {
//         res.status(404).send();
//     }
//     console.log("PUTTING IT!");
// });

router.delete("/:Id", async (req, res) => {
    try {
      const album = await Album.findById(req.params.Id);
      if (!album) {
        return res.status(404).json({ error: "Album not found!" });
      }
      const removedAlbum = await album.remove();
      res.json(removedAlbum);
    } catch {
      res.status(500).send();
    }
  });

router.options("/", async (req, res) => {
    try {
        res.setHeader("Allow", "HEAD, GET, POST, OPTIONS");
        res.setHeader("Content-Length", "0");
        res.send(200);
    } catch {
        res.status(400);
    }
});
module.exports = router;