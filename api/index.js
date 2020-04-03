const express = require('express');
const cors = require('cors');
const expressWs = require('express-ws');
const mongoose = require('mongoose');
const {nanoid} = require('nanoid');

const config = require('./config');
const users = require('./app/users');
const Message = require('./models/Message');
const User = require('./models/User');


const app = express();
const port = 8000;

expressWs(app);

app.use(express.json());
app.use(cors());

mongoose.connect(config.database, config.databaseOptions);

const connections = {};
const onlineUsers = [];

app.ws('/chatApp', async function (ws, req) {
    const id = nanoid();
    const user = await User.findOne({token: req.query.token});
    onlineUsers.push(user);

    connections[id] = ws;

    console.log('total clients connected: ' + Object.keys(connections).length);

    const array = await Message.find().populate('user');
    const turnedArray = array.reverse();
    let messages = [];
    for (let i = 0; i < 30; i++) {
        messages.push(turnedArray[i]);
    }

    ws.send(JSON.stringify({
        type: 'USERS_ONLINE',
        users: onlineUsers
    }));

    ws.send(JSON.stringify({
        type: 'LAST_MESSAGES',
        messages: messages
    }));


    ws.on('message', async (msg) => {

        const parsed = JSON.parse(msg);
        switch (parsed.type) {
            case 'CREATE_MESSAGE':
                const whiteList = {
                    user: parsed.user,
                    message: parsed.message
                };
                const newMessage = await new Message(whiteList);
                newMessage.save();
                const user = await User.findOne({token: req.query.token});
                const obj = {
                    _id: newMessage._id,
                    user: user,
                    message: newMessage.message
                };
                Object.keys(connections).forEach(connId => {
                    const connection = connections[connId];
                    connection.send(JSON.stringify({
                        type: 'NEW_MESSAGE',
                        message: obj
                    }));
                });
                break;
            default:
                console.log('NO TYPE: ' + parsed.type);
        }
    });
    ws.on('close', () => {
        console.log(`client disconnected! ${id}`);

        delete connections[id];
        for (let i = 0; i < onlineUsers.length; i++) {
            if (onlineUsers[i].username === user.username) {
                onlineUsers.splice(i ,1);
            }
        }
        Object.keys(connections).forEach(connId => {
            const connection = connections[connId];

            connection.send(JSON.stringify({
                type: 'USERS_ONLINE',
                users: onlineUsers
            }))
        })
    });
});

app.use('/users', users);


app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
});