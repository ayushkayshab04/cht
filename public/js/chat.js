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
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML
//options
const {username,room } = Qs.parse(location.search, {ignoreQueryPrefix:true})

const autoscroll=()=>{
   const $newMessage = $messages.lastElementChild
   
   const newMessageStyles = getComputedStyle($newMessage)
   const newMessageMargin = parseInt(newMessageStyles.marginBottom)
   const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

  const visibleHeight = $messages.offsetHeight

  const containerHeight = $messages.scrollHeight

  const scrollOffset = $messages.scrollTop + visibleHeight


  if(containerHeight-newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
  }
}

socket.on("message", (message) => {
    console.log(message)
    const html =  Mustache.render(messageTemplate, {
       username:message.username, 
       message:message.text,
       createdAt:moment(message.createdAt).format("h:mm a") 
    })
    $messages.insertAdjacentHTML("beforeend",html)
    autoscroll()
})


socket.on("locationMessage" , (message)=>{
    console.log(message.location)
    const html = Mustache.render(locationTemplate , {
        username:message.username,
        location:message.location,
        createdAt:moment(message.createdAt).format("h:mm a")
    })
    $messages.insertAdjacentHTML("beforeend",html)
})

socket.on("roomData",({room,users})=>{
 const html = Mustache.render(sidebarTemplate , {
     room,
     users
 })
 document.querySelector("#sidebar").innerHTML = html
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

socket.emit("join", {username , room} , (error)=>{
    if(error){
        alert(error)
        location.href="/"
    }
})