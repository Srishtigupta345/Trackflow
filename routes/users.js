const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.js");
const { isLoggedIn } = require("../middleware/auth.js");

router.get("/register", userController.registerForm);

router.post("/register", userController.register);

router.get("/login", userController.loginForm);
router.post("/login", userController.login);

router.get("/dashboard", isLoggedIn, userController.dashboardPage);

router.get("/profile", isLoggedIn, userController.profilePage);

router.get("/logout", userController.logout);


module.exports = router;