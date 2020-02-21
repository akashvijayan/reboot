var mongoose = require("mongoose");

var questionSchema = mongoose.Schema({
    question: String,
    answer: Number,
    choices: [],
    difficulty: Number,
    level: Number
});

module.exports = mongoose.model("Question",questionSchema);