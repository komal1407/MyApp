// import the mongoose package
const mongoose = require('mongoose');


// create the schema of the locations data
const Schema = mongoose.Schema;

const ImageSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        image: {
            data: ArrayBuffer,
            required: true,
            contentType: String
        }
    }
);


// connect the schema with the MongoDB collection and export it
module.exports = mongoose.model('Location', LocationSchema, 'location');