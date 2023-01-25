
// Require Mongoose
const mongoose = require("mongoose");

// Represents what the post looks like
const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
    title:  { type: String, require: true },
    genre:  { type: String, require: true },
    artist: { type: String, require: true },
}
    , { toJSON: { virtuals: true } });

// add virtual properties to include Album, to include (dynamic) links
AlbumSchema.virtual('_links').get(
    function () {
        return {
            self: {
                href: `${process.env.BASE_URI}albums/${this._id}`
            },
            collection: {
                href: `${process.env.BASE_URI}albums`
            }
        }
    }
)

// Export function to create "SomeModel" model class
module.exports = mongoose.model("Album", AlbumSchema);