const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  setBarPosition: (pos) => ipcRenderer.invoke("set-bar-position", pos),
});