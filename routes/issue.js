const express = require("express");
const router = express.Router();

const issueController = require("../controllers/issue");
const { isLoggedIn } = require("../middleware/auth");

// createIssue form render
router.get("/create/:projectId", isLoggedIn, issueController.createIssueForm);

// create Issue
router.post("/:projectId/issues", isLoggedIn, issueController.createIssue);

// Show Issue
router.get("/:issueId", isLoggedIn, issueController.showIssue);

// Update issue status
router.post("/:issueId/status", isLoggedIn, issueController.updateIssueStatus);

// User All Issues 
router.get("/", isLoggedIn, issueController.getAllIssues);

// delete issue
router.post("/:issueId/delete", isLoggedIn, issueController.deleteIssue);

module.exports = router;