// import the mongoose package
const mongoose = require("mongoose");

// create a schema
const Schema = mongoose.Schema;

const MenuSchema = new Schema(
    {
        restaurantId: {
            type: String,
            required: true
        },
        itemPrice: {
            type: Number,
            required: true
        },
        itemName: {
            type: String,
            required: true
        },
        itemDescription: {
            type: String,
            required: true
        },
        isVeg: {
            type: Boolean,
            required: true
        }
    }
);

// export the model
module.exports = mongoose.model('Menu', MenuSchema, 'Menu');
