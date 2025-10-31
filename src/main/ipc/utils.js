const { BrowserWindow } = require("electron");
const store = require("../store");

function broadcastStateUpdate() {
  const payload = {
    timeConfig: store.get("timeConfig") || { startHour: 9, startMinute: 0, endHour: 18, endMinute: 0 },
    todos: store.get("todos") || [],
  };
  BrowserWindow.getAllWindows().forEach(win => {
    if (!win.isDestroyed()) {
      win.webContents.send("state-updated", payload);
    }
  });
}

module.exports = { broadcastStateUpdate };
