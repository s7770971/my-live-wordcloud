const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// 💡 允許所有跨網域連線，並確保 WebSocket 傳輸協議正常
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    allowEIO3: true // 相容舊版協議，防止手機瀏覽器卡死
});

app.use(express.static('public'));

let wordCounts = {};

io.on('connection', (socket) => {
    // 觀眾進來時，先把目前的文字雲資料傳給他
    socket.emit('update_cloud', wordCounts);

    // 接收觀眾傳來的歌名或關鍵字
    socket.on('send_word', (word) => {
        if (word && word.trim() !== '') { 
            wordCounts[word] = (wordCounts[word] || 0) + 1;
            io.emit('update_cloud', wordCounts);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`=== 🚀 歌詞投票伺服器成功啟動在 PORT ${PORT} ===`);
});