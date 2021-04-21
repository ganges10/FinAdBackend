const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const postSchema = new mongoose.Schema({
    income:{
        type: Number,
        required: true
    },
    expenditure: {
        type: Number,
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

module.exports = mongoose.model("Expenditure",postSchema);