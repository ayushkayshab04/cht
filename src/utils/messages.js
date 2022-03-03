const generateMessage = (username,text)=>{
    return{
        username:username,
        text:text,
        createdAt: new Date().getTime()
    }
}

const generateLocationmessage = (username,location)=>{
    return{
        username:username,
        location:location,
        createdAt: new Date().getTime()
    }
}


module.exports = {
    generateMessage,
    generateLocationmessage
}