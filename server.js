<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>唱什麼由你決定</title>
    <script src="/socket.io/socket.io.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/wordcloud2.js/1.2.2/wordcloud2.min.js"></script>
    <style>
        body { 
            margin: 0; 
            background-image: url('bg.jpg'); 
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            display: flex; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            overflow: hidden;
            position: relative;
            background-color: #1a1a1a;
        }
        body::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(26, 26, 26, 0.75); 
            z-index: 1;
        }
        /* 💡 加上 CSS 過渡動畫，讓畫布重新整理時有平滑的淡入效果，減少生硬感 */
        canvas { 
            width: 100vw; 
            height: 100vh; 
            position: relative;
            z-index: 2; 
            transition: opacity 0.4s ease-in-out; /* 0.4秒平滑淡入 */
            opacity: 1;
        }
        .refreshing {
            opacity: 0.3; /* 重新計算文字時稍微變透明，製造呼吸律動感 */
        }
    </style>
</head>
<body>
    <canvas id="cloud-canvas"></canvas>
    <script>
        const socket = io();
        const canvas = document.getElementById('cloud-canvas');
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();

        let renderTimeout;

        socket.on('update_cloud', (wordCounts) => {
            // 💡 動態優化：使用防抖機制 (Debounce)，當很多人連續送出字詞時，不會讓畫面瘋狂閃爍，而是平滑渲染
            clearTimeout(renderTimeout);
            
            // 讓畫布產生微弱的呼吸縮放動態
            canvas.classList.add('refreshing');

            renderTimeout = setTimeout(() => {
                const list = Object.keys(wordCounts).map(word => [word, wordCounts[word] * 20 + 20]); 
                
                WordCloud(canvas, { 
                    list: list, 
                    fontFamily: '微軟正黑體, Arial, sans-serif', 
                    weightFactor: 1, 
                    color: 'random-light', 
                    backgroundColor: 'transparent', 
                    rotateRatio: 0.3, // 30% 的文字會旋轉，增加構圖動態感
                    gridSize: 8,
                    // 💡 關鍵動態：啟用套件內建的彈跳流暢畫圖動畫
                    drawOutOfBound: false,
                    wait: 15 // 每個字體生成的間隔微秒，會看到字體「依序蹦出來」的酷炫效果
                });

                // 渲染完畢，文字雲平滑顯現
                setTimeout(() => {
                    canvas.classList.remove('refreshing');
                }, 200);

            }, 300); // 延遲 0.3 秒緩衝，讓連續輸入更流暢
        });

        window.addEventListener('resize', resizeCanvas);
    </script>
</body>
</html>