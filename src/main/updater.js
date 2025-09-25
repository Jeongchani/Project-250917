const { autoUpdater } = require("electron-updater");
const { app } = require("electron");
const { log } = require("./logger");

function setupUpdater() {
  if (!app.isPackaged) {
    log("Skip checkForUpdates because application is not packed and dev update config is not forced");
    return;
  }

  autoUpdater.on("update-available", () => log("업데이트 가능"));
  autoUpdater.on("update-downloaded", () => {
    log("업데이트 다운로드 완료");
    autoUpdater.quitAndInstall();
  });
  autoUpdater.on("error", (err) => log("업데이트 오류: " + err));

  autoUpdater.checkForUpdatesAndNotify();
}

module.exports = { setupUpdater };
