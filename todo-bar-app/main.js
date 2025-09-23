const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { autoUpdater } = require("electron-updater");

// ---------- 로그 ----------
const logPath = path.join(app.getPath("userData"), "app.log");
function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(logPath, line);
  console.log(line);
}

// ---------- 전역 변수 ----------
let win;
let settingsWin = null;
let todosWin = null;

// ---------- electron-store ----------
const Store = require("electron-store");
let store;
function initStore() {
  store = new Store();
}

// ---------- 공유 상태 ----------
let settings = { startHour: 9, startMinute: 0, endHour: 18, endMinute: 0 };
let todos = [];

// ---------- 창 생성 ----------
const isDev = process.env.ELECTRON_DEV === "true" || !app.isPackaged;
const rootUrl = isDev
  ? "http://localhost:5173"
  : `file://${path.join(__dirname, "frontend", "dist", "index.html")}`;

const popupOpts = {
  width: 420,
  height: 520,
  resizable: true,
  frame: false,
  alwaysOnTop: true,
  webPreferences: {
    preload: path.join(__dirname, "preload.js"),
    contextIsolation: true,
    nodeIntegration: false,
  },
};

function createWindow() {
  try {
    log("메인 윈도우 생성 시작");
    win = new BrowserWindow({
      width: 640,
      height: 152,
      resizable: false,
      frame: false,
      alwaysOnTop: true,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });

    if (isDev) {
      log("DEV 모드 → " + rootUrl);
      win.loadURL(rootUrl);
    } else {
      log("PROD 모드 → frontend/dist/index.html 로드 시도");
      win.loadFile(path.join(__dirname, "frontend", "dist", "index.html"));
    }

    win.on("closed", () => {
      log("메인 윈도우 닫힘");
      win = null;
    });
  } catch (err) {
    log("createWindow 에러: " + err.stack);
  }
}

// ---------- 앱 시작 ----------
app.whenReady().then(() => {
  try {
    log("앱 시작");

    // 스토어 초기화
    initStore();
    log("스토어 초기화 완료");

    // 저장된 값 불러오기
    settings = store.get("settings", settings);
    todos = store.get("todos", []);

    // 메인 윈도우 생성
    createWindow();

    // 업데이트 확인 (여기서만 호출)
    log("업데이트 확인 시작");
    autoUpdater.checkForUpdatesAndNotify();
  } catch (err) {
    log("app.whenReady 에러: " + err.stack);
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    log("모든 창 닫힘 → 앱 종료");
    app.quit();
  }
});

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
ipcMain.handle("open-settings", () => {
  if (!settingsWin || settingsWin.isDestroyed()) {
    settingsWin = new BrowserWindow({
      width: 420,
      height: 230,
      resizable: false,
      frame: false,
      alwaysOnTop: true,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });
    settingsWin.on("closed", () => {
      settingsWin = null;
    });
  } else {
    settingsWin.focus();
  }

  if (isDev) {
    settingsWin.loadURL(`${rootUrl}?window=settings`);
  } else {
    settingsWin.loadFile(path.join(__dirname, "frontend", "dist", "index.html"), {
      query: { window: "settings" },
    });
  }
});

ipcMain.handle("open-todos", () => {
  if (!todosWin || todosWin.isDestroyed()) {
    todosWin = new BrowserWindow({ ...popupOpts, width: 500, height: 560 });
    todosWin.on("closed", () => {
      todosWin = null;
    });
  } else {
    todosWin.focus();
  }

  if (isDev) {
    todosWin.loadURL(`${rootUrl}?window=todos`);
  } else {
    todosWin.loadFile(path.join(__dirname, "frontend", "dist", "index.html"), {
      query: { window: "todos" },
    });
  }
});

// ---------- 상태 IPC ----------
ipcMain.handle("get-settings", () => settings);

ipcMain.handle("save-settings", (e, next) => {
  const sH = Math.max(0, Math.min(23, Number(next.startHour)));
  const sM = [0, 30].includes(Number(next.startMinute)) ? Number(next.startMinute) : 0;
  const eH = Math.max(0, Math.min(23, Number(next.endHour)));
  const eM = [0, 30].includes(Number(next.endMinute)) ? Number(next.endMinute) : 0;

  settings = { startHour: sH, startMinute: sM, endHour: eH, endMinute: eM };
  store.set("settings", settings);
  broadcastState();
});

ipcMain.handle("get-todos", () => sortTodos(todos));

ipcMain.handle("add-todo", (e, item) => {
  const id = Date.now();
  const title = String(item?.title || "").trim();
  const due = item?.due ? String(item.due) : undefined;
  if (!title) return;
  todos.push({ id, title, done: false, due });
  todos = sortTodos(todos);
  store.set("todos", todos);
  broadcastState();
});

ipcMain.handle("toggle-todo", (e, id) => {
  todos = todos.map((x) => (x.id === id ? { ...x, done: !x.done } : x));
  todos = sortTodos(todos);
  store.set("todos", todos);
  broadcastState();
});

ipcMain.handle("delete-todo", (e, id) => {
  todos = todos.filter((x) => x.id !== id);
  todos = sortTodos(todos);
  store.set("todos", todos);
  broadcastState();
});

// ---------- 유틸 ----------
function sortTodos(list) {
  const withDue = list.filter((t) => t.due);
  const withoutDue = list.filter((t) => !t.due);

  withDue.sort((a, b) => a.due.localeCompare(b.due));
  return [...withDue, ...withoutDue];
}

function broadcastState() {
  const payload = { settings, todos: sortTodos(todos) };
  if (win && !win.isDestroyed()) win.webContents.send("state-updated", payload);
  if (settingsWin && !settingsWin.isDestroyed())
    settingsWin.webContents.send("state-updated", payload);
  if (todosWin && !todosWin.isDestroyed())
    todosWin.webContents.send("state-updated", payload);
}

// ---------- 업데이트 이벤트 ----------
autoUpdater.on("checking-for-update", () => log("업데이트 확인 중..."));
autoUpdater.on("update-available", () => log("새 업데이트 있음. 다운로드 시작..."));
autoUpdater.on("update-not-available", () => log("최신 버전입니다."));
autoUpdater.on("error", (err) => log("업데이트 에러: " + err.toString()));
autoUpdater.on("update-downloaded", () => {
  log("업데이트 다운로드 완료. 재시작 시 적용됩니다.");
  autoUpdater.quitAndInstall();
});

