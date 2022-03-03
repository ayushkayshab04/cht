const users = []

const addUser = ({id,username,room})=>{

    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username||!room){
        return{
            error:"Username and room required"
        }
    }

    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    //validate username
    if(existingUser){
        return{
            error:"User exists"
        }
    }

    //store user

    const user = {id,username,room}
    users.push(user)
    return{user}
}

const removeUser = (id)=>{

const index =  users.findIndex((user)=> user.id === id)

if(index !== -1) {
    return users.splice(index,1)[0]
}

}

const getUser = (id)=>{
    const index = user.finIn
}