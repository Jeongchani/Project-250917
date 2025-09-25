const { ipcMain, BrowserWindow } = require("electron");

function handleWindow() {
  const getSenderWindow = (e) => BrowserWindow.fromWebContents(e.sender);

  ipcMain.on("minimize", (e) => {
    const bw = getSenderWindow(e);
    if (bw && !bw.isDestroyed()) bw.minimize();
  });

  ipcMain.on("close", (e) => {
    const bw = getSenderWindow(e);
    if (bw && !bw.isDestroyed()) bw.close();
  });
}

module.exports = { handleWindow };
