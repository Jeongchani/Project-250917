const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  minimize: () => ipcRenderer.send("minimize"),
  close: () => ipcRenderer.send("close"),

  openSettings: () => ipcRenderer.invoke("open-settings"),
  openTodos: () => ipcRenderer.invoke("open-todos"),

  getSettings: () => ipcRenderer.invoke("get-settings"),
  saveSettings: (data) => ipcRenderer.invoke("save-settings", data),

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
