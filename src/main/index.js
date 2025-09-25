// src/main/index.js
const { app } = require("electron");
const { createMainWindow } = require("./window");
const { setupIPC } = require("./ipc");  
const { setupUpdater } = require("./updater");
const { initLogger, log } = require("./logger");

app.whenReady().then(() => {
  initLogger();
  createMainWindow();
  setupIPC();                            
  setupUpdater();
  log("앱 시작");
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

