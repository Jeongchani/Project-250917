const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWin = null;
let settingsWin = null;
let todosWin = null;


const isDev =
  process.env.ELECTRON_DEV === "true" ||
  process.env.ELECTRON_DEV === "1" ||
  !app.isPackaged;

const rootUrl = isDev
  ? "http://localhost:5173"
  : `file://${path.join(__dirname, "../../frontend", "dist", "index.html")}`;

function createMainWindow() {
  mainWin = new BrowserWindow({
    width: 640,
    height: 152,
    resizable: false,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWin.loadURL(rootUrl);
  } else {
    mainWin.loadFile(path.join(__dirname, "../../frontend/dist/index.html"));
  }

  return mainWin;
}

function getMainWindow() {
  return mainWin || null;
}

// ✅ 원본과 동일한 쿼리스트링 방식으로 팝업 오픈
function openTimePopup() {
  if (!settingsWin || settingsWin.isDestroyed()) {
    settingsWin = new BrowserWindow({
      width: 420,
      height: 230,
      resizable: false,
      frame: false,
      alwaysOnTop: true,
      webPreferences: {
        preload: path.join(__dirname, "../preload/index.js"),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });
    settingsWin.on("closed", () => (settingsWin = null));
  } else {
    settingsWin.focus();
  }

  if (isDev) {
    settingsWin.loadURL(`${rootUrl}?window=settings`);
  } else {
    settingsWin.loadFile(
      path.join(__dirname, "../../frontend/dist/index.html"),
      { query: { window: "settings" } }
    );
  }
}

function openTodosPopup() {
  if (!todosWin || todosWin.isDestroyed()) {
    todosWin = new BrowserWindow({
      width: 500,
      height: 560,
      resizable: true,
      frame: false,
      alwaysOnTop: true,
      webPreferences: {
        preload: path.join(__dirname, "../preload/index.js"),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });
    todosWin.on("closed", () => (todosWin = null));
  } else {
    todosWin.focus();
  }

  if (isDev) {
    todosWin.loadURL(`${rootUrl}?window=todos`);
  } else {
    todosWin.loadFile(
      path.join(__dirname, "../../frontend/dist/index.html"),
      { query: { window: "todos" } }
    );
  }
}

module.exports = {
  createMainWindow,
  getMainWindow,
  openTimePopup,
  openTodosPopup,
};