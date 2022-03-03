const socket = io();
//Elements

const $messagForm = document.querySelector("#message-form")
const $messageFormInput = $messagForm.querySelector("input")
const $messagFormButton = $messagForm.querySelector("button")
const $locationButton = document.querySelector("#send-location")
const $messages =  document.querySelector("#messages")



//templates
const locationTemplate = document.querySelector("#location-template").innerHTML
const messageTemplate = document.querySelector("#message-template").innerHTML

//options
const {username,room } = Qs.parse(location.search, {ignoreQueryPrefix:true})

socket.on("message", (message) => {
    console.log(message)
    const html =  Mustache.render(messageTemplate, {
       message:message.text,
       createdAt:moment(message.createdAt).format("h:mm a") 
    })
    $messages.insertAdjacentHTML("beforeend",html)
})

socket.on("locationMessage" , (message)=>{
    console.log(message.location)
    const html = Mustache.render(locationTemplate , {
        location:message.location,
        createdAt:moment(message.createdAt).format("h:mm a")
    })
    $messages.insertAdjacentHTML("beforeend",html)
})

$messagForm.addEventListener("submit", (e) => {
    e.preventDefault()

    $messagFormButton.setAttribute("disabled", "disabled")

    const message = e.target.elements.message.value
    socket.emit("sendMessage", message, (message) => {
        console.log("the message was delivered:", message)
        $messagFormButton.removeAttribute("disabled")
        $messageFormInput.value = " "
        $messageFormInput.focus()
    })
})

$locationButton.addEventListener("click", () => {

    $locationButton.setAttribute("disabled", "disabled")

    if (!navigator.geolocation) {
        return alert("Geo location is not supported by you Browser")
    }

    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        socket.emit("sendLocation", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (location) => {
            $locationButton.removeAttribute("disabled")
            console.log("The location is Shared")
        })
    })
})

socket.emit("join", {username , room})