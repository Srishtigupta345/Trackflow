const User = require("../models/user.js");
const bcrypt = require('bcrypt');
const Project = require("../models/project.js");
const Issue = require("../models/issue.js");

module.exports.registerForm = (req, res) => {
    res.render("users/register");
};

module.exports.register = async (req, res, next) => {
    try{
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword
        });
        await newUser.save();
        // session create
        req.session.userId = newUser._id;
        req.flash("success", "Account Created succesfully!");
        res.redirect("/users/dashboard");
    }
    catch(err){
        console.log(err);
        req.flash("error", "Registration failed");
        res.redirect("/users/register");
    }
};

module.exports.loginForm = async (req, res, next) => {
    res.render("users/login");
};

module.exports.login = async (req, res, next) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({email: email});
        if(!user) {
           return res.send("User not found!");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch) {
           req.session.userId = user._id;
           req.flash("success", "Welcome back!");
           res.redirect("/users/dashboard");
        }
    }
    catch(err){
        console.log(err);
        req.flash("error", "Login failed!");
        res.redirect("/users/login");
    }
};

module.exports.dashboardPage = async (req, res) => {
    const userId = req.session.userId;
    const totalProjects = await Project.countDocuments({
        createdBy : userId
    });
    const totalIssues = await Issue.countDocuments({
        assignedTo: userId
    });
    const openIssues = await Issue.countDocuments({
        assignedTo: userId,
        status: "Open"
    });
    const inProgressIssues = await Issue.countDocuments({
        assignedTo: userId,
        status: "In Progress"
    })
    const resolvedIssues = await Issue.countDocuments({
        assignedTo: userId,
        status: "Resolved"
    });
    const recentIssues = await Issue.find({
        assignedTo: userId,
    })
    .sort({ createdAt: -1})
    .limit(5);
    res.render("users/dashboard", {
        totalProjects,
        totalIssues,
        openIssues,
        inProgressIssues,
        resolvedIssues,
        recentIssues
    });
};

module.exports.profilePage = async (req, res) => {
    const userId = req.session.userId;
    const user = await User.findById(userId);
    const projectsCount = await Project.countDocuments({
        createdBy: userId
    });
    const issuesAssigned = await Issue.countDocuments({
        assignedTo: userId
    });
    res.render("users/profile", {
        user,
        projectsCount,
        issuesAssigned
    });
};
module.exports.logout = (req, res) => {
    req.session.destroy();
    req.flash("success", "Logged Out succesfully!");
    res.redirect("/users/login");
};
