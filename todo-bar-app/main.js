const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 80, // 바 형태니까 높이는 얇게
    frame: false, // 윈도우 기본 프레임 제거
    alwaysOnTop: true, // 항상 위에
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadURL('http://localhost:5173'); // Vite dev 서버
}

app.whenReady().then(() => {
  createWindow();
});