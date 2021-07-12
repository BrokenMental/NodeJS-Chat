const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const {addUser , removeUser, getUser, getUserInRoom} = require('./users.js');


const router = require('./router');

const app = express();
const server = http.createServer(app);
const io =  socketio(server);

app.use(router);
app.use(cors());

io.on('connection', (socket) =>{
    socket.on('join', ({name, room}, callback) =>{
        const {error, user} = addUser({id: socket.id , name, room});

        if(error) return callback(error);

        socket.emit('message', {user: 'admin', text : `${user.name}님, 환영합니다 ${user.room}방`});
        socket.broadcast.to(user.room).emit('message', {user:'admin',text : `${user.name}, has joined`});

        socket.join(user.room);

        io.to(user.room).emit('roomData',{room: user.room}, users.getUserInRoom(user.room));

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        //console.log(users)

        io.to(user.room).emit('message', {user : user.name, text:{message}});
        io.to(user.room).emit('message', {room : user.room, users : getUserInRoom(user.room)});

        callback();
    });

    socket.on('disconnect', () =>{
        const user = removeUser(socket.id);

        if(user){
            io.to(user.room).emit('message', {user : 'admin',  text : `${user.name} has left`});
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        }
    })
});

app.use(router);

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));