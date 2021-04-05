import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import router from './routes/routes.js'
import { Server }  from 'socket.io'
import http from 'http'
import dotenv from 'dotenv'

const app = express()
dotenv.config()

app.use(cors({
                credentials: true, 
                origin: 'https://creative-ink.netlify.app'
                // origin: 'http://localhost:3000'
            })
       )
app.use(cookieParser())
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: false}))
app.use('', router)

// ENV VARIABLES
const PORT = process.env.PORT || 5000
const CONNECTION_URL = process.env.CONNECTION_URL

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

let superSet = new Map()
let adminMap = new Map()

io.on('connection', (socket) => {

    // console.log('socket born')        

    // Subscribe User
    socket.on('join', ({ name, room, randomColor }, callback) => {

        socket.name = name // adding nickname to that specific socket object
        socket.randomColor = randomColor // adding their color
        socket.join(room)
        
        socket.broadcast.to(room).emit('newJoinedMember', { userSocketId: socket.id, name, randomColor }) // broadcast to OTHERS
        const allSocketIdsInRoom = [...io.of("/").adapter.rooms.get(room)] // getting all socket Ids of a room
        let otherMembers = []
        // mapping Ids to their nicknames
        allSocketIdsInRoom.map((val) => otherMembers.push({ userSocketId: val, name: io.sockets.sockets.get(val).name, 
                                                            randomColor: io.sockets.sockets.get(val).randomColor 
                                                        }))
        callback({
            otherMembers, roomSize: otherMembers.length
        })

    })    

    socket.on('title', ({ title, room }) => socket.broadcast.to(room).emit('titleChanged', ({ title, adminName: io.sockets.sockets.get(socket.id).name })))

    // Signal received that game has started, so initilization of writer's data is done here
    socket.on('startWriting', ({ room, maxRoundRobins, penName }) => {

        io.to(room).emit('nextWriterPenName', { penName, randomColor: io.sockets.sockets.get(socket.id).randomColor, userSocketId: socket.id, maxRoundRobins })
        io.to(socket.id).emit('yourTurn')
        
        adminMap.set(room, { adminSocketId: socket.id, penName }) // add the admin name to a Map
        const writerArrayOfRoom = [...io.of("/").adapter.rooms.get(room)]
        superSet.set(room, { writerArrayOfRoom, ptr: 0, maxRoundRobins })   
    })

    // Next turn
    socket.on('nextWriterPlease', ({ room }) => {

        let obj = superSet.get(room)
        if(obj.maxRoundRobins === 0){
            io.to(room).emit('timeIsUp', ({ adminName: adminMap.get(room)?.penName }))
        }

        else {        
            obj.maxRoundRobins = obj.maxRoundRobins - 1
            obj.ptr = (1 + obj.ptr)%(obj.writerArrayOfRoom.length)
        
            io.to(room).emit('nextWriterPenName', { penName: io.sockets.sockets.get(obj.writerArrayOfRoom[obj.ptr])?.name, 
                                                    randomColor: io.sockets.sockets.get(obj.writerArrayOfRoom[obj.ptr]).randomColor,
                                                    userSocketId: obj.writerArrayOfRoom[obj.ptr],
                                                    maxRoundRobins: obj.maxRoundRobins
                                                })
            // Notify to the next writer            
            io.to(obj.writerArrayOfRoom[obj.ptr]).emit('yourTurn')
        }
    })

    // Broadcast message to OTHERS in the room
    socket.on('userProse', ({ userProse, room }) => {        
        socket.broadcast.to(room).emit('friendProse', { friendProse: userProse, randomColor: io.sockets.sockets.get(socket.id).randomColor })        
    })

    // Disconnecting socket
    socket.on('disconnecting', () => {

        const room = [...socket.rooms][1] // get his room name

        if(adminMap.get(room)?.adminSocketId === socket.id){           
            adminMap.delete(room)
        }

            let obj = superSet.get(room)
            if(obj){
                if(obj.writerArrayOfRoom.length === 1){
                    superSet.delete(room)
                } else{
                        let userIndex = obj.writerArrayOfRoom.findIndex((val) => val === socket.id)
                        if(userIndex !== -1)  obj.writerArrayOfRoom.splice(userIndex, 1)
                        if(obj.ptr === obj.writerArrayOfRoom.length)  obj.ptr = 0
                    }     
            }                 

        io.to(room).emit('writerLeft', ({ userSocketId: socket.id }))
    })

    socket.on('published', ({ room, name }) => socket.broadcast.to(room).emit('published', (name)))
    socket.on('restartWriting', (room) => socket.broadcast.to(room).emit('restartWriting'))

    socket.on('closeRoom', ({ room }) => {
        socket.broadcast.to(room).emit('closeRoom')
    })

    // Disconnect Socket
    socket.on('disconnect', () => {
        // console.log('socket died')    
    })
})


server.listen(PORT, () => console.log(`Server is running on ${PORT}`))
mongoose.connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
                .then(() => console.log('successfully connected to Mongo'))
                .catch((error) => console.log(error.message))

mongoose.set('useFindAndModify', false)
