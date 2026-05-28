console.log("=== 🚀 系統開始啟動了！正在載入套件... ===");

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// 告訴伺服器去讀取 public 資料夾裡面的網頁
app.use(express.static('public'));

// 記憶體：用來記錄每個字出現的次數
let wordCounts = {};

io.on('connection', (socket) => {
    console.log('👀 有玩家連線了！');
    
    // 玩家一進來，先給他目前的畫面
    socket.emit('update_cloud', wordCounts);

    // 收到玩家送出的字
    socket.on('send_word', (word) => {
        const cleanWord = word.trim();
        if (cleanWord) {
            wordCounts[cleanWord] = (wordCounts[cleanWord] || 0) + 1;
            console.log(`收到字詞: [${cleanWord}] 目前次數: ${wordCounts[cleanWord]}`);
            
            // 廣播給所有人更新畫面
            io.emit('update_cloud', wordCounts);
        }
    });
});

// 雲端最重要的設定：PORT 和 0.0.0.0
const PORT = process.env.PORT || 3000;
http.listen(PORT, '0.0.0.0', () => {
    console.log(`=== 🟢 伺服器成功啟動在 PORT ${PORT} ===`);
});