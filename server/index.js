const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const {addUser , removeUser, getUser, getUsersInRoom} = require('./users');


const router = require('./router');

const app = express();
const server = http.createServer(app);
const corsOptions = {
    cors: true,
    origins:["http://localhost:3000"],
}

const io = socketio(server, corsOptions);

app.use(cors());
app.use(router);

/*
* socket
* on : 이벤트를 받는 역할, api등에 미리 지정된 명령어 사용시 활용
* emit : 이벤트를 보내는 역할, 특정 명칭을 지정 후 이벤트 명령 입력, 받는곳에서 이벤트 발생 시 on으로 받음
*/
io.on('connect', (socket) => {
    socket.on('join', ({name, room}, callback) => {
        const {error, user} = addUser({id: socket.id , name, room});

        if(error) return callback(error);

        socket.join(user.room);
        
        //메시지 주고 싶을 때
        //socket.emit('alert', 'text');

        socket.emit('message', {user: 'admin', text : `${user.name}님, 환영합니다. 방 : ${user.room}`});
        socket.broadcast.to(user.room).emit('message', {user : 'admin', text : `${user.name}, 입장`});

        io.to(user.room).emit('roomData', { room: user.room, users : getUsersInRoom(user.room)});

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', {user : user.name, text: message });

        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if(user){
            io.to(user.room).emit('message', {user : 'admin',  text : `${user.name} has left`});
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        }
    })
});

app.use(router);

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));