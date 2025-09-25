const { app } = require("electron");
const fs = require("fs");
const path = require("path");

let logPath;

function initLogger() {
  logPath = path.join(app.getPath("userData"), "app.log");
}

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  if (logPath) {
    try {
      fs.appendFileSync(logPath, line + "\n");
    } catch {}
  }
}

module.exports = { initLogger, log };
