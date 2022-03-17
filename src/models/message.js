const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/chatDB").then(()=>{
    console.log("connected to the server")
}).catch(err=>{
    console.log(err)
})

const messageSchema = new mongoose.Schema({
    message:{
        type:String,
        requiired:true
    }
    // ,userId:{
    //     type:String,
    //     ref:"User"
    // }
})


const Msg =  mongoose.model("Message",messageSchema)


module.exports = {
    Msg
}