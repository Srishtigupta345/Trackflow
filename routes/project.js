const express = require("express");
const router = express.Router();


const projectController = require("../controllers/project");
const { isLoggedIn } = require("../middleware/auth");

// create route
router.get("/create", isLoggedIn,  projectController.createForm);
router.post("/create", isLoggedIn, projectController.createProject);

// add member route
router.get("/:projectId/add-member", isLoggedIn, projectController.addMemberForm);
router.post("/:projectId/add-member", isLoggedIn, projectController.addMember);

// project list route according to user
router.get("/", isLoggedIn, projectController.getUserProjects);

// Project detail 
router.get("/:projectId", isLoggedIn, projectController.getProjectDetail);

module.exports = router;