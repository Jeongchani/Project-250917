const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWin = null;
let popupRefs = {}; 

const isDev =
  process.env.ELECTRON_DEV === "true" ||
  process.env.ELECTRON_DEV === "1" ||
  !app.isPackaged;

const rootUrl = isDev
  ? "http://localhost:5173"
  : `file://${path.join(__dirname, "../../frontend/dist/index.html")}`;

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

  if (isDev) mainWin.loadURL(rootUrl);
  else mainWin.loadFile(path.join(__dirname, "../../frontend/dist/index.html"));

  return mainWin;
}

function getMainWindow() {
  return mainWin || null;
}

/**
 * 팝업 생성 공통 함수
 * @param {string} name 
 * @param {object} options 
 */
function openPopup(name, options) {
  if (!popupRefs[name] || popupRefs[name].isDestroyed()) {
    popupRefs[name] = new BrowserWindow({
      ...options,
      alwaysOnTop: true,
      frame: false,
      webPreferences: {
        preload: path.join(__dirname, "../preload/index.js"),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });
    popupRefs[name].on("closed", () => (popupRefs[name] = null));
  } else {
    popupRefs[name].focus();
  }

  if (isDev) {
    popupRefs[name].loadURL(`${rootUrl}/popup/${name}`);
  } else {
    popupRefs[name].loadFile(
      path.join(__dirname, "../../frontend/dist/index.html"),
      { query: { window: name } }
    );
  }
}

module.exports = {
  createMainWindow,
  getMainWindow,
  openPopup,
};
