const Issue = require("../models/issue.js");
const Project = require("../models/project.js");

// render create issue form
module.exports.createIssueForm = async (req, res) => {
    try{
        const { projectId } = req.params;
        const project = await Project.findById(projectId).populate("members.user");
        const developers = project.members.filter(
           member => member.role === "Developer"
        );
        res.render("issues/createIssue", {
           projectId,
           developers: developers
        });
    }
    catch(err) {
        console.log(err);
        req.flash("error", "Unable to load issue form");
        res.redirect("/project")
    }
};

// create issue controller 
module.exports.createIssue = async (req, res) => {
    try{
        const { projectId } = req.params;
        const { title, description, priority, assignedTo } = req.body;
        const issueCount = await Issue.countDocuments({project: projectId});
        const issueId = `TF-${issueCount + 101}`;
        const newIssue = new Issue({
            issueId,
            title,
            description,
            priority,
            assignedTo: assignedTo || null,
            project: projectId,
            createdBy: req.session.userId,
            status: "Open"
        });
        await newIssue.save();
        req.flash("success", "Issue created Successfully");
        res.redirect(`/project/${projectId}`);
    }
    catch(err) {
        console.log(err);
        req.flash("error", "Failed to create issue");
        res.redirect(`/project/${req.params.projectId}`);
    }
};

// Show Issue controller
module.exports.showIssue = async (req, res) => {
    try{
        const { issueId } = req.params;
        const issue = await Issue.findById(issueId)
        .populate("assignedTo")
        .populate("createdBy");
        if(!issue){
            req.flash("error", "Issue not found");
            return res.redirect("/project");
        }
        res.render("issues/showIssue", { issue });
    }
    catch(err) {
        console.log(err);
        req.flash("error", "Unable to load Issue");
        re.redirect("/project");
    }
};

// update issue contoller
module.exports.updateIssueStatus = async (req, res) => {
    try{
        const {issueId } = req.params;
        const { status } = req.body;
        const issue = await Issue.findById(issueId);
        if(!issue) {
            req.flash("error", "issue not found");
            return res.redirect("/project");
        }
        issue.status = status;
        await issue.save();
        req.flash("success", "Issue status updated");
        res.redirect(`/issues/${issueId}`);
    }
    catch(err){
        console.log(err);
        req.flash("error", "Error updating issue status");
        res.redirect("/project");
    }
};

// get all issue page
module.exports.getAllIssues = async (req, res) => {
    try{
        const userId = req.session.userId;
        const issues = await Issue.find({}).populate("assignedTo", "username").populate("project");
        res.render("issues/indexIssue", { issues });
    }
    catch(err) {
        console.log(err);
        req.flash("error", "Unable to load issues");
        res.redirect("/users/dashboard");
    }
};

// Issue Delete 
module.exports.deleteIssue = async (req, res) => {
    try{
        const { issueId } = req.params;
        const issue = await Issue.findByIdAndDelete(issueId).populate("project");
        if(!issue){
            req.flash("error", "Issue not found");
            return res.redirect("/project");
        }
        // check project owner
        if(issue.project.createdBy.toString() !== req.session.userId) {
            req.flash("error", "Not authorized");
            return res.redirect(`/project/${issue.project._id}`);
        }
        await Issue.findByIdAndDelete(issueId);
        req.flash("success", "Issue deleted successfully");
        res.redirect(`/project/${issue.project}`);
    }
    catch(err) {
        console.log(err);
        req.flash("error", "Failed to delete issue");
        res.redirect("/project");
    }
};