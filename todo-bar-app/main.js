const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let win;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    width,
    height: 80, // 바 형태니까 높이는 얇게
    x: 0,
    y: height - 80, // 기본은 하단
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

// React에서 위치 변경 요청 받기
ipcMain.handle("set-bar-position", (event, pos) => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  if (pos === "top") {
    win.setBounds({ x: 0, y: 0, width, height: 80 });
  } else {
    win.setBounds({ x: 0, y: height - 80, width, height: 80 });
  }
});