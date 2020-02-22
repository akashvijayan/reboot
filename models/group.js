var mongoose = require("mongoose");

var groupSchema = mongoose.Schema({
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
});

module.exports=mongoose.model("Group",groupSchema);