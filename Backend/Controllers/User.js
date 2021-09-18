const User = require('../Models/User');


exports.signUp = (req, res) => {
    // create a new user
    const {
        email,
        password,
        firstName,
        lastName
    } = req.body;

    // create a new Object of User model class
    const userObj = new User(
        {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
        }
    )

    // We will call a save method on this object
    userObj.save().then(result => {
        res.status(200).json({
            message: "User Registered Successfully !",
            user: result
        });
    }).catch(error => {
        res.status(500).json({
            message: "Error in Database",
            error: error
        });
    });
}

exports.login = (req, res) => {
    // verify and login the user
    const {
        username,
        password
    } = req.body;

    User.find({
        email: username,
        password: password
    }).then(result => {
        if (result.length > 0) {
            res.status(200).json({
                message: "User Loggedin Successfully !!",
                user: result[0],
                isLoggedIn: true
            });
        } else {
            res.status(400).json({
                message: "Username or password is wrong !!",
                isLoggedIn: false
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Error in Database",
            error: error
        });
    });
}