// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  setBarPosition: (pos) => ipcRenderer.invoke('set-bar-position', pos),
  // 예: renderer에서 필요할 때 추가
  // getAppPath: () => ipcRenderer.invoke('get-app-path')
});
