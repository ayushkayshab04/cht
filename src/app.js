const path = require("path");
const http = require("http")
const express = require("express");
const socketio = require("socket.io");
const { generateMessage , generateLocationmessage } = require("./utils/messages.js");
const { createSocket } = require("dgram");




const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, "../public")
const app = express();
const server = http.createServer(app)
const io = socketio(server)


app.use(express.static(publicDirectoryPath))


io.on("connection", (socket) => {
    console.log("new websocket connection")

    socket.on("join", ({username,room})=>{
        socket.join(room)

        socket.emit("message", generateMessage("welcome!"))
        socket.broadcast.to(room).emit("message", generateMessage(`${username} has joined the room`))
    })

    socket.on("sendMessage",  (message, callback) => {
        io.to("fortnite").emit("message", generateMessage(message))
        callback()
    })

    socket.on("disconnect", () => {
        io.emit("message", generateMessage("A user has left"))
    })

    socket.on("sendLocation", (coords, callback) => {
        io.emit("locationMessage", generateLocationmessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback();
    })

})

server.listen(port, () => {
    console.log(`server started on ${port}`)
})