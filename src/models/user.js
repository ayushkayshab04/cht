const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/chatDB")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    socket_id:{
        type:String,
        required:true
    }
})

const User =  mongoose.model("User",userSchema)


module.exports = {
    User
}

