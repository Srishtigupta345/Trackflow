const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    projectname: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    members: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            role: {
                type: String,
                enum: ["Admin", "Developer", "Tester"]
            }
        }
    ],
    status: {
        type: String,
        enum: ["Active", "Archived", "Completed"],
        default: "Active"
    },
    createdAt: {}
},
{timestamps: true}
);

module.exports = mongoose.model("Project", projectSchema);