const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// 💡 關鍵修改：允許所有網域（包括 Vercel 和 5G 手機）自由連線，不再阻擋！
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
        if (word && word.length === 1) { // 配合歌詞投票限制 1 個字
            wordCounts[word] = (wordCounts[word] || 0) + 1;
            io.emit('update_cloud', wordCounts);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`=== 🚀 系統開始啟動了！正在載入套件... ===`);
    console.log(`=== 🟢 伺服器成功啟動在 PORT ${PORT} ===`);
});