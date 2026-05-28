const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.static('public'));

let wordCounts = {};

io.on('connection', (socket) => {
    socket.emit('update_cloud', wordCounts);

    socket.on('send_word', (word) => {
        if (word && word.trim() !== '') { 
            wordCounts[word] = (wordCounts[word] || 0) + 1;
            io.emit('update_cloud', wordCounts);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server rolling on port ${PORT}`);
});