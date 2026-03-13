const User = require("../models/user.js");

module.exports.isLoggedIn = async (req, res, next) => {
    if(!req.session.userId) {
        return res.redirect("/users/login");
    }
    next();
};

module.exports.isAdmin = (req, res, next) => {
    if(req.user.role !== "Admin") {
        return res.send("Access denied. Admin only");
    }
    next();
};

module.exports.isDeveloper = (req, res, next) => {
    if(req.user.role !== "Developer") {
        return res.send("Access denied. Developer only");
    }
    next();
};

module.exports.isTester = (req, res, next) => {
    if(req.user.role !== "Tester") {
        return res.send("Access denied. Tester only");
    }
    next();
};