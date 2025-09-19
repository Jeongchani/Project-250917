const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  setBarPosition: (pos) => ipcRenderer.invoke('set-bar-position', pos),
  minimize: () => ipcRenderer.send('minimize'),
  close: () => ipcRenderer.send('close')
});
