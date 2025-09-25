const { contextBridge, ipcRenderer } = require("electron");

// 원본과 동일: window.electronAPI 이름/메서드 시그니처 유지
contextBridge.exposeInMainWorld("electronAPI", {
  minimize: () => ipcRenderer.send("minimize"),
  close: () => ipcRenderer.send("close"),

  openTime: () => ipcRenderer.invoke("open-time"),
  openTodos: () => ipcRenderer.invoke("open-todos"),

  getTimeConfig: () => ipcRenderer.invoke("get-time-config"),
  saveTimeConfig: (data) => ipcRenderer.invoke("save-time-config", data),

  getTodos: () => ipcRenderer.invoke("get-todos"),
  addTodo: (item) => ipcRenderer.invoke("add-todo", item),
  toggleTodo: (id) => ipcRenderer.invoke("toggle-todo", id),
  deleteTodo: (id) => ipcRenderer.invoke("delete-todo", id),

  onStateUpdated: (cb) => {
    const listener = (_e, payload) => cb(payload);
    ipcRenderer.on("state-updated", listener);
    return () => ipcRenderer.off("state-updated", listener);
  },
});
