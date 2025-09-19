const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 640,
    height: 152,       // 128 (본체) + 24 (타이틀바)
    resizable: false,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const devUrl = 'http://localhost:5173';
  const isDev = process.env.ELECTRON_DEV === 'true' || !app.isPackaged;

  if (isDev) {
    win.loadURL(devUrl);
    win.webContents.openDevTools({ mode: 'undocked' });
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
}


app.whenReady().then(createWindow);

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

ipcMain.handle("set-bar-position", (event, pos) => {
  if (!win) return;
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  if (pos === "top") win.setBounds({ x: 0, y: 0, width, height: 80 });
  else win.setBounds({ x: 0, y: height - 80, width, height: 80 });
});

ipcMain.on("minimize", () => { if (win) win.minimize(); });
ipcMain.on("close", () => { if (win) win.close(); });
