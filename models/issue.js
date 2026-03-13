const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const issueSchema = new Schema({
    issueId: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Open", "In Progress", "Resolved", "Closed"],
        default: "Open"
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        required: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
},
{timestamps: true}
);

module.exports = mongoose.model("Issue", issueSchema);