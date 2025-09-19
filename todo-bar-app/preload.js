// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // 창 제어
  minimize: () => ipcRenderer.send('minimize'),
  close: () => ipcRenderer.send('close'),

  // 팝업
  openSettings: () => ipcRenderer.invoke('open-settings'),
  openTodos: () => ipcRenderer.invoke('open-todos'),

  // 상태
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (data) => ipcRenderer.invoke('save-settings', data),
  getTodos: () => ipcRenderer.invoke('get-todos'),
  addTodo: (item) => ipcRenderer.invoke('add-todo', item),
  toggleTodo: (id) => ipcRenderer.invoke('toggle-todo', id),
  deleteTodo: (id) => ipcRenderer.invoke('delete-todo', id),

  // 구독
  onStateUpdated: (cb) => {
    const listener = (_e, payload) => cb(payload);
    ipcRenderer.on('state-updated', listener);
    return () => ipcRenderer.off('state-updated', listener);
  }
});
