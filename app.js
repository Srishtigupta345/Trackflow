const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const usersRoutes = require("./routes/users.js");
const projectRoutes = require("./routes/project.js");
const issueRoutes = require("./routes/issue.js");

// Session & Auth
const session = require("express-session");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/Trackflow");
}

main()
.then(() => {
    console.log("Mongodb connected!");
}).catch((err) => {
    console.log(err);
});

// View Engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Global Middleware
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});

// basic api 
app.get("/", (req, res) => {
    res.redirect("/users/login");
});

// session 
app.use(session({
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: false
}));

// flash use 
app.use(flash());

// flash middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// Routers
app.use("/users", usersRoutes);
app.use("/project", projectRoutes);
app.use("/issues", issueRoutes);


app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});