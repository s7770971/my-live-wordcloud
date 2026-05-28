const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// 允許所有跨網域連線，確保手機 5G/Wi-Fi 都能順暢通關
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.static('public'));

let wordCounts = {};

io.on('connection', (socket) => {
    // 觀眾一進來，先把目前的統計資料同步給他
    socket.emit('update_cloud', wordCounts);

    // 接收手機端傳來的字詞
    socket.on('send_word', (word) => {
        // 💡 核心修正：確認 word 存在且不是空白
        if (word && word.trim() !== '') { 
            const cleanWord = word.trim(); // 去除前後空白
            
            // 💡 這裡絕對不對字串做任何 .charAt(0) 或限制！你傳什麼歌名，這裡就原封不動存進去！
            wordCounts[cleanWord] = (wordCounts[cleanWord] || 0) + 1;
            
            // 把最完整的字詞資料廣播給大螢幕
            io.emit('update_cloud', wordCounts);
        }
    });
});

// 💡 現場清理大招：提供一個秘密通道，在網址輸入 /clear 就能一秒清空大螢幕，方便現場重來
app.get('/clear', (req, res) => {
    wordCounts = {};
    io.emit('update_cloud', wordCounts);
    res.send('<h1>✅ 大螢幕文字雲已成功清空重置！</h1>');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`=== 🚀 核心大腦已完全解除封印，運行在 PORT ${PORT} ===`);
});