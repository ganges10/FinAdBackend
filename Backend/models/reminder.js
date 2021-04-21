const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const reminderSchema = new mongoose.Schema({
    bill:{
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    user: {
        type: ObjectId,
        ref:"User"
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,
});

module.exports = mongoose.model("Reminder",reminderSchema);