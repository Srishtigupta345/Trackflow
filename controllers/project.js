const Project = require("../models/project.js");
const User = require("../models/user.js");
const Issue = require("../models/issue.js");

module.exports.createForm = (req, res) => {
    res.render("projects/createProject.ejs");
};

module.exports.createProject = async (req, res) => {
    try {
        const { projectname, description } = req.body;
        const createdBy = req.session.userId;
        const newProject = new Project({
          projectname: projectname,
          description: description,
          createdBy: createdBy,
          members: [
            {
                user: createdBy,
                role: "Admin"
            }
          ],
          status: "Active"
        });
        await newProject.save();
        req.flash("success", "Project created successfully!");
        res.redirect("/project");
    } catch(err) {
        console.log(err);
        req.flash("error", "Project creation failed");
        res.redirect("/project/create");
    }
};

module.exports.addMemberForm = async (req, res) => {
    try{
        const { projectId } = req.params;
        const project = await Project.findById(projectId);
        const allUsers = await User.find();
        // project members ids
        const memberIds = project.members.map(m => m.user._id ? m.user._id.toString() : m.user.toString());
        // filter users
        const users = allUsers.filter(user => !memberIds.includes(user._id.toString()));
        res.render("projects/addMember.ejs", {projectId, users});
    }
    catch(err) {
        console.log(err);
        req.flash("error", "Unable to load add member page!");
        res.redirect("/project");
    }
};
module.exports.addMember = async (req, res) => {
    try{
        const { projectId } = req.params;
        const { userId, role } = req.body;
        const project = await Project.findById(projectId);
        if(!project) {
           req.flash("error", "Project not found");
           return res.redirect("/project");
        }
        // check duplicate member
        const alreadyMember = project.members.find(m => m.user.toString() === userId);
        if(alreadyMember) {
          req.flash("error", "User already a member");
          return res.redirect(`/project/${projectId}`);
        }
        // adding userId in project members array
        project.members.push({
          user: userId,
          role: role
        });
        await project.save();
        req.flash("success", "Member added successfully!");
        res.redirect(`/project/${projectId}`);
    }
    catch(err) {
        console.log(err);
        req.flash("error", "Fai;ed to add member");
        res.redirect(`/project/${req.params.projectId}`);
    }
};

module.exports.getUserProjects = async (req, res) => {
    try{
        const projects = await Project.find({
          createdBy: req.session.userId
        });
        res.render("projects/index.ejs", { projects });
    }
    catch(err) {
        console.log(err);
        req.flash("error", "Unable to load projects");
        res.redirect("/users/dashboard");
    }
};

module.exports.getProjectDetail = async (req, res) => {
    try{
        const { projectId } = req.params;
        const project = await Project.findById(projectId).populate("members.user");
        if(!project) {
            req.flash("error", "Project not found");
            return res.redirect("/project");
        }
        const issues = await Issue.find({
           project: projectId
        }).populate("assignedTo");
        res.render("projects/show.ejs", { project, issues });
    }
    catch(err) {
        console.log(err);
        req.flash("error", "Unable to load project details");
        res.redirect("/project");
    }
};