// main.js
const { app, BrowserWindow, ipcMain, screen, BrowserWindowConstructorOptions } = require('electron');
const path = require('path');

let win;               // 메인 바 창
let settingsWin = null;
let todosWin = null;

// ---------- 공유 상태 ----------
let settings = { startHour: 9, endHour: 18 }; // 기본값
let todos = []; // {id:number, title:string, done:boolean, due?:string}

// ---------- 유틸 ----------
const isDev = process.env.ELECTRON_DEV === 'true' || !app.isPackaged;
const rootUrl = isDev ? 'http://localhost:5173' : `file://${path.join(__dirname, 'dist', 'index.html')}`;

// 팝업 공통 옵션
/** @type {BrowserWindowConstructorOptions} */
const popupOpts = {
  width: 420,
  height: 520,
  resizable: true,
  frame: false,
  alwaysOnTop: true,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    contextIsolation: true,
    nodeIntegration: false
  }
};

function createWindow() {
  win = new BrowserWindow({
    width: 640,
    height: 152, // 본체 128 + 타이틀바 24
    resizable: false,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (isDev) {
    win.loadURL(rootUrl);
    win.webContents.openDevTools({ mode: 'undocked' });
  } else {
    win.loadURL(rootUrl);
  }
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

// ---------- 창 제어 ----------
ipcMain.on("minimize", (e) => {
  const bw = BrowserWindow.fromWebContents(e.sender);
  if (bw) bw.minimize();
});
ipcMain.on("close", (e) => {
  const bw = BrowserWindow.fromWebContents(e.sender);
  if (bw) bw.close();
});

// ---------- 팝업 열기 ----------
ipcMain.handle('open-settings', () => {
  const makeUrl = () => {
    if (isDev) return `${rootUrl}?window=settings`;
    // file://에서는 loadFile의 query 옵션이 안전하다
    return null;
  };

  if (!settingsWin || settingsWin.isDestroyed()) {
    settingsWin = new BrowserWindow({ ...popupOpts });
    settingsWin.on('closed', () => { settingsWin = null; });
  } else {
    settingsWin.focus();
  }

  if (isDev) {
    settingsWin.loadURL(makeUrl());
  } else {
    settingsWin.loadFile(path.join(__dirname, 'dist', 'index.html'), {
      query: { window: 'settings' }
    });
  }
});

ipcMain.handle('open-todos', () => {
  const makeUrl = () => {
    if (isDev) return `${rootUrl}?window=todos`;
    return null;
  };

  if (!todosWin || todosWin.isDestroyed()) {
    todosWin = new BrowserWindow({ ...popupOpts, width: 500, height: 560 });
    todosWin.on('closed', () => { todosWin = null; });
  } else {
    todosWin.focus();
  }

  if (isDev) {
    todosWin.loadURL(makeUrl());
  } else {
    todosWin.loadFile(path.join(__dirname, 'dist', 'index.html'), {
      query: { window: 'todos' }
    });
  }
});


// ---------- 상태 IPC ----------
ipcMain.handle('get-settings', () => settings);
ipcMain.handle('save-settings', (e, next) => {
  // 검증 최소화: 0~23 시만 허용
  const s = Math.max(0, Math.min(23, Number(next.startHour)));
  const t = Math.max(0, Math.min(23, Number(next.endHour)));
  settings = { startHour: s, endHour: t };
  broadcastState();
});

ipcMain.handle('get-todos', () => todos);
ipcMain.handle('add-todo', (e, item) => {
  const id = Date.now();
  const title = String(item?.title || '').trim();
  const due = item?.due ? String(item.due) : undefined;
  if (!title) return;
  todos.push({ id, title, done: false, due });
  broadcastState();
});
ipcMain.handle('toggle-todo', (e, id) => {
  todos = todos.map(x => x.id === id ? { ...x, done: !x.done } : x);
  broadcastState();
});
ipcMain.handle('delete-todo', (e, id) => {
  todos = todos.filter(x => x.id !== id);
  broadcastState();
});

function broadcastState() {
  const payload = { settings, todos };
  if (win && !win.isDestroyed()) win.webContents.send('state-updated', payload);
  if (settingsWin && !settingsWin.isDestroyed()) settingsWin.webContents.send('state-updated', payload);
  if (todosWin && !todosWin.isDestroyed()) todosWin.webContents.send('state-updated', payload);
}
