const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));
let wordCounts = {};

io.on('connection', (socket) => {
    socket.emit('update_cloud', wordCounts);
    socket.on('send_word', (word) => {
        const cleanWord = word.trim();
        if (cleanWord) {
            wordCounts[cleanWord] = (wordCounts[cleanWord] || 0) + 1;
            io.emit('update_cloud', wordCounts);
        }
    });
});

// 這裡已經改成雲端專用的設定了！
const PORT = process.env.PORT || 3000;
http.listen(PORT, '0.0.0.0', () => {
    console.log(`伺服器啟動在 PORT ${PORT}`);
});