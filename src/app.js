const path = require("path");
const http = require("http");
const {User} = require("./models/user.js")
const {Msg} = require("./models/message")
const express = require("express");
const socketio = require("socket.io");
const { generateMessage , generateLocationmessage } = require("./utils/messages.js");
const { addUsers, removeUsers, getUsers, getUsersInRoom} = require("./utils/users.js")



const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, "../public")
const app = express();
const server = http.createServer(app)
const io = socketio(server)


app.use(express.static(publicDirectoryPath))


io.on("connection", (socket) => {
    console.log("new websocket connection")

    socket.on("join", (options,callback)=>{

       const {error, user} = addUsers({id:socket.id,  ...options})


       if(error){
           return callback(error)

       }

        socket.join(user.room)
        const userD = new User({name:user.username,socket_id:socket.id})
        userD.save();
        socket.emit("message", generateMessage("Admin","welcome!"))
        socket.broadcast.to(user.room).emit("message", generateMessage("Admin",`${user.username} has joined the room`))

        io.to(user.room).emit("roomData" , {
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        callback()
    })

    socket.on("sendMessage",  (message, callback) => {
        const messaged = new Msg({message:message})
        messaged.save();
        const user = getUsers(socket.id)
        io.to(user.room).emit("message", generateMessage(user.username,message))
        callback()
    })

    socket.on("sendLocation", (coords, callback) => {
        const user = getUsers(socket.id)
        io.to(user.room).emit("locationMessage", generateLocationmessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback();
    })

    socket.on("disconnect", () => {
        const user = getUsers(socket.id)
        // const user = removeUsers(socket.id)
        const userd = User.findByIdAndDelete({socket_id:user.id})
        console.log(userd)
      
        if(user){
            io.to(user.room).emit("message", generateMessage(user.name,`${user.username} has left ${user.room} room`))
            io.to(user.room).emit("roomData",{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
    })



})

server.listen(port, () => {
    console.log(`server started on ${port}`)
})