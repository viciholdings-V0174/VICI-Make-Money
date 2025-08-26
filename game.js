const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 設定 canvas 為全螢幕
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const whaleImg = new Image();
whaleImg.src = 'images/whale.png';

const coinImgs = [
  'images/coin1.png',
  'images/coin2.png',
  'images/coin3.png',
  'images/coin4.png'
].map(src => {
  const img = new Image();
  img.src = src;
  return img;
});

// 載入背景圖
const bgImg = new Image();
bgImg.src = 'images/Charging_Bull_statue.jpg';

// 地圖格線設定
const GRID_SIZE = 100;

// 世界座標下的 whale
let whaleSpeedBase = 6;
const whale = {
  x: 0, // 世界座標
  y: 0,
  width: 80,
  height: 80,
  speed: whaleSpeedBase * 0.8,
  dx: 0,
  dy: 0
};

// coin 也用世界座標，改為多個
const COIN_COUNT = 30;
function generateCoins(centerX, centerY) {
  return Array.from({ length: COIN_COUNT }, () => ({
    x: centerX + (Math.random() - 0.5) * 2000,
    y: centerY + (Math.random() - 0.5) * 2000,
    width: 40,
    height: 40,
    img: coinImgs[Math.floor(Math.random() * coinImgs.length)]
  }));
}
let coins = generateCoins(whale.x, whale.y);

// 每10秒重新生成金幣
setInterval(() => {
  coins = generateCoins(whale.x, whale.y);
}, 10000);

let score = 0;
let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

canvas.addEventListener('pointermove', function(e) {
  e.preventDefault(); // 防止頁面滾動
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
}, { passive: false });

function worldToScreen(wx, wy) {
  // 以 whale 為中心，轉換世界座標到畫布座標
  return {
    x: canvas.width / 2 + (wx - whale.x),
    y: canvas.height / 2 + (wy - whale.y)
  };
}

function drawBackground() {
  // 純白底的灰色棋盤格
  const left = whale.x - canvas.width / 2;
  const top = whale.y - canvas.height / 2;
  const grid = GRID_SIZE;
  for (let x = Math.floor(left / grid) * grid; x < whale.x + canvas.width / 2; x += grid) {
    for (let y = Math.floor(top / grid) * grid; y < whale.y + canvas.height / 2; y += grid) {
      const sx = worldToScreen(x, y).x;
      const sy = worldToScreen(x, y).y;
      const isWhite = ((Math.floor(x / grid) + Math.floor(y / grid)) % 2 === 0);
      ctx.fillStyle = isWhite ? '#fff' : '#f0f0f0';
      ctx.fillRect(sx, sy, grid, grid);
    }
  }
}

function drawWhale() {
  // 鯨魚大小根據分數比例調整
  const baseSize = 80;
  const minSize = 20;
  const size = Math.max(minSize, baseSize + score * 2);
  whale.width = size * 1.5;
  whale.height = size;
  const pos = worldToScreen(whale.x, whale.y);

  // 判斷滑鼠在鯨魚左邊還是右邊
  const center = { x: canvas.width / 2, y: canvas.height / 2 };
  const isMouseLeft = mouse.x < center.x;

  // 計算角度
  let angle = 0;
  if (whale.dx !== 0 || whale.dy !== 0) {
    angle = Math.atan2(whale.dy, whale.dx);
  }

  ctx.save();
  ctx.translate(pos.x, pos.y);
  if (isMouseLeft) {
    ctx.scale(-1, 1); // 水平翻轉
    ctx.rotate(-angle + Math.PI); // 反向旋轉
  } else {
    ctx.rotate(angle);
  }
  ctx.drawImage(
    whaleImg,
    -whale.width / 2,
    -whale.height / 2,
    whale.width,
    whale.height
  );
  ctx.restore();
}

function drawCoin() {
  const now = Date.now();
  for (const coin of coins) {
    const pos = worldToScreen(coin.x, coin.y);
    let blinking = false;
    if (coin.blink) {
      // 閃爍效果：每 300ms 切換顯示/隱藏
      blinking = Math.floor(now / 300) % 2 === 0;
      ctx.globalAlpha = blinking ? 0.3 : 1;
    }
    ctx.drawImage(coin.img, pos.x - coin.width / 2, pos.y - coin.height / 2, coin.width, coin.height);
    // 金光描邊
    if (coin.blink) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, coin.width / 2 + 4, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(pos.x, pos.y, coin.width / 2, pos.x, pos.y, coin.width / 2 + 4);
      grad.addColorStop(0, 'rgba(255, 215, 0, 0.7)');
      grad.addColorStop(1, 'rgba(255, 215, 0, 0)');
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)';
      ctx.lineWidth = blinking ? 6 : 2;
      ctx.shadowColor = 'gold';
      ctx.shadowBlur = blinking ? 16 : 0;
      ctx.strokeStyle = grad;
      ctx.stroke();
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
}

function drawScore() {
  ctx.font = '24px Arial';
  ctx.fillStyle = '#333';
  ctx.fillText('$' + score, 20, 40);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function newCoinPosition(nearX, nearY) {
  return {
    x: nearX + (Math.random() - 0.5) * 2000,
    y: nearY + (Math.random() - 0.5) * 2000,
    width: 40,
    height: 40,
    img: coinImgs[Math.floor(Math.random() * coinImgs.length)]
  };
}

// adam 設定
const adamImg = new Image();
adamImg.src = 'images/adam.png';
let adams = [];

function randomCorner(centerX, centerY, distance = 0) {
  // 以目前畫面為基準的四個角落
  const corners = [
    { x: centerX - canvas.width / 2 + 40, y: centerY - canvas.height / 2 + 40 }, // 左上
    { x: centerX + canvas.width / 2 - 40, y: centerY - canvas.height / 2 + 40 }, // 右上
    { x: centerX - canvas.width / 2 + 40, y: centerY + canvas.height / 2 - 40 }, // 左下
    { x: centerX + canvas.width / 2 - 40, y: centerY + canvas.height / 2 - 40 }  // 右下
  ];
  return corners[Math.floor(Math.random() * 4)];
}

function spawnAdam(centerX, centerY) {
  const pos = randomCorner(centerX, centerY);
  adams.push({
    x: pos.x,
    y: pos.y,
    width: 60,
    height: 60,
    speed: whale.speed * 0.5
  });
  // adam 出現時不再自動產生 coin
}

// 遊戲開始時不產生 adam，10秒後開始產生
setTimeout(() => {
  spawnAdam(whale.x, whale.y);
  setInterval(() => {
    spawnAdam(whale.x, whale.y);
  }, 10000);
}, 10000);

function drawAdam() {
  for (const adam of adams) {
    const pos = worldToScreen(adam.x, adam.y);
    ctx.drawImage(adamImg, pos.x - adam.width / 2, pos.y - adam.height / 2, adam.width, adam.height);
  }
}

function updateAdam() {
  for (const adam of adams) {
    // 以 50% 速度遠離 whale
    const dx = adam.x - whale.x;
    const dy = adam.y - whale.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 1) {
      adam.x += (dx / dist) * adam.speed;
      adam.y += (dy / dist) * adam.speed;
    }
  }
}

function scatterCoins(centerX, centerY, count, blink = false) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 80 + Math.random() * 60;
    coins.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      width: 40,
      height: 40,
      img: coinImgs[Math.floor(Math.random() * coinImgs.length)],
      blink: blink
    });
  }
}

// hank 設定
const hankImg = new Image();
hankImg.src = 'images/hank.png';
let hanks = [];

function spawnHank(centerX, centerY) {
  const pos = randomCorner(centerX, centerY);
  hanks.push({
    x: pos.x,
    y: pos.y,
    width: 60 * 0.6,
    height: 60 * 0.6,
    speed: whale.speed * 0.3
  });
}

setTimeout(() => {
  spawnHank(whale.x, whale.y);
  setInterval(() => {
    spawnHank(whale.x, whale.y);
  }, 8000);
}, 8000);

function drawHank() {
  for (const hank of hanks) {
    const pos = worldToScreen(hank.x, hank.y);
    ctx.drawImage(hankImg, pos.x - hank.width / 2, pos.y - hank.height / 2, hank.width, hank.height);
  }
}

function updateHank() {
  for (const hank of hanks) {
    // 以 30% 速度遠離 whale
    const dx = hank.x - whale.x;
    const dy = hank.y - whale.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 1) {
      hank.x += (dx / dist) * hank.speed;
      hank.y += (dy / dist) * hank.speed;
    }
  }
}

// bomb 設定
const bombImg = new Image();
bombImg.src = 'images/bomd.png'; // 若檔名為 bomb.png 請修正
const BOMB_COUNT = 5;
function generateBombs(centerX, centerY) {
  return Array.from({ length: BOMB_COUNT }, () => ({
    x: centerX + (Math.random() - 0.5) * 2000,
    y: centerY + (Math.random() - 0.5) * 2000,
    width: 56,
    height: 56
  }));
}
let bombs = generateBombs(whale.x, whale.y);

function drawBomb() {
  for (const bomb of bombs) {
    const pos = worldToScreen(bomb.x, bomb.y);
    ctx.drawImage(bombImg, pos.x - bomb.width / 2, pos.y - bomb.height / 2, bomb.width, bomb.height);
  }
}

function updateBomb() {
  for (const bomb of bombs) {
    // 以 40% 速度追鯨魚
    const dx = whale.x - bomb.x;
    const dy = whale.y - bomb.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const speed = whale.speed * 0.4;
    if (dist > 1) {
      bomb.x += (dx / dist) * speed;
      bomb.y += (dy / dist) * speed;
    }
  }
}

function detectCollision() {
  // whale 與 coin
  for (let i = coins.length - 1; i >= 0; i--) {
    const coin = coins[i];
    if (
      whale.x - whale.width / 2 < coin.x + coin.width / 2 &&
      whale.x + whale.width / 2 > coin.x - coin.width / 2 &&
      whale.y - whale.height / 2 < coin.y + coin.height / 2 &&
      whale.y + whale.height / 2 > coin.y - coin.height / 2
    ) {
      score++;
      coins.splice(i, 1);
      coins.push(newCoinPosition(whale.x, whale.y));
    }
  }
  // whale 與 adams
  for (let i = adams.length - 1; i >= 0; i--) {
    const adam = adams[i];
    if (
      whale.x - whale.width / 2 < adam.x + adam.width / 2 &&
      whale.x + whale.width / 2 > adam.x - adam.width / 2 &&
      whale.y - whale.height / 2 < adam.y + adam.height / 2 &&
      whale.y + whale.height / 2 > adam.y - adam.height / 2
    ) {
      adams.splice(i, 1);
      scatterCoins(whale.x, whale.y, 20, true);
    }
  }
  // whale 與 hanks
  for (let i = hanks.length - 1; i >= 0; i--) {
    const hank = hanks[i];
    if (
      whale.x - whale.width / 2 < hank.x + hank.width / 2 &&
      whale.x + whale.width / 2 > hank.x - hank.width / 2 &&
      whale.y - whale.height / 2 < hank.y + hank.height / 2 &&
      whale.y + whale.height / 2 > hank.y - hank.height / 2
    ) {
      hanks.splice(i, 1);
      scatterCoins(whale.x, whale.y, 10, true);
    }
  }
  // whale 與 bomb
  for (let i = 0; i < bombs.length; i++) {
    const bomb = bombs[i];
    if (
      whale.x - whale.width / 2 < bomb.x + bomb.width / 2 &&
      whale.x + whale.width / 2 > bomb.x - bomb.width / 2 &&
      whale.y - whale.height / 2 < bomb.y + bomb.height / 2 &&
      whale.y + whale.height / 2 > bomb.y - bomb.height / 2
    ) {
      score -= 5;
      whale.width = whale.height = Math.max(20, whale.width - 10);
      bombs[i] = {
        x: whale.x + (Math.random() - 0.5) * 2000,
        y: whale.y + (Math.random() - 0.5) * 2000,
        width: 56,
        height: 56
      };
    }
  }
}

let gameTime = 40; // 秒
let gameOver = false;
let timerInterval = setInterval(() => {
  if (!gameOver) {
    gameTime--;
    if (gameTime <= 0) {
      gameOver = true;
      clearInterval(timerInterval);
    }
  }
}, 1000);

function drawTimer() {
  ctx.font = '24px Arial';
  ctx.fillStyle = '#333';
  ctx.fillText('Time: ' + gameTime, canvas.width - 140, 40);
}

function drawResult() {
  ctx.save();
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;
  ctx.font = 'bold 48px Arial';
  ctx.fillStyle = '#222';
  ctx.textAlign = 'center';
  ctx.fillText('遊戲結束', canvas.width / 2, canvas.height / 2 - 60);
  ctx.font = '36px Arial';
  ctx.fillText('分數：$' + score, canvas.width / 2, canvas.height / 2);
  ctx.font = '32px Arial';
  if (score < 31) {
    ctx.fillStyle = '#c00';
    ctx.fillText('公司倒閉', canvas.width / 2, canvas.height / 2 + 60);
  } else if (score < 51) {
    ctx.fillStyle = '#c00';
    ctx.fillText('再接再厲', canvas.width / 2, canvas.height / 2 + 60);
  } else if (score < 81) {
    ctx.fillStyle = '#1a9c36';
    ctx.fillText('進軍國際', canvas.width / 2, canvas.height / 2 + 60);
  } else {
    ctx.fillStyle = '#1a9c36';
    ctx.fillText('威旭賺大錢', canvas.width / 2, canvas.height / 2 + 60);
  }
  ctx.textAlign = 'left';
  ctx.restore();
}

function update() {
  if (gameOver) return;
  // 滑鼠控制：計算目標方向
  const center = { x: canvas.width / 2, y: canvas.height / 2 };
  const dx = mouse.x - center.x;
  const dy = mouse.y - center.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  let maxSpeed = whale.speed;
  if (dist > 5) {
    whale.dx = (dx / dist) * maxSpeed;
    whale.dy = (dy / dist) * maxSpeed;
    whale.x += whale.dx;
    whale.y += whale.dy;
  }
  updateAdam();
  updateHank();
  updateBomb();
  detectCollision();
}

function draw() {
  drawBackground();
  drawCoin();
  drawBomb();
  drawAdam();
  drawHank();
  drawWhale();
  drawScore();
  drawTimer();
  if (gameOver) {
    drawResult();
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// 移除鍵盤事件與相關函式

whaleImg.onload = () => {
  // 確保所有 coin 圖片都載入
  let loaded = 0;
  coinImgs.forEach(img => {
    img.onload = () => {
      loaded++;
      if (loaded === coinImgs.length) {
        gameLoop();
      }
    };
  });
};
