const { ipcMain } = require("electron");
const store = require("../store");
const { openPopup } = require("../window");
const { broadcastStateUpdate } = require("./utils");

function handleTime() {
  ipcMain.handle("get-time-config", async () => {
    return (
      store.get("timeConfig") || {
        startHour: 9,
        startMinute: 0,
        endHour: 18,
        endMinute: 0,
      }
    );
  });

  ipcMain.handle("save-time-config", async (_e, next) => {
    store.set("timeConfig", next);
    broadcastStateUpdate();
    return true;
  });

  ipcMain.handle("open-time", async () => {
    openPopup("time", { width: 420, height: 230 });
    return true;
  });
}

module.exports = { handleTime };
