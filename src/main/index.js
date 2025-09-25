// src/main/index.js
const { app } = require("electron");
const { createMainWindow } = require("./window");
const { setupIPC } = require("./ipc");   // ← 인자 없이
const { setupUpdater } = require("./updater");
const { initLogger, log } = require("./logger");

app.whenReady().then(() => {
  initLogger();
  createMainWindow();
  setupIPC();                             // ← 인자 제거
  setupUpdater();
  log("앱 시작");
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
  
