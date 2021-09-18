// need a menu model
const Menu = require('../Models/Menu');

exports.getMenuForRestaurant = (req, res) => {
    const restId = req.params.restaurantId;
    Menu.find({ restaurantId: restId }).then(result => {
        res.status(200).json({
            message: `Menu for restaurant ID ${restId}`,
            menu: result
        });
    }).catch(error => {
        res.status(500).json({
            message: "Error in Database",
            error: error
        });
    });
}