const { ipcMain } = require("electron");
const store = require("../store");
const { openTodosPopup } = require("../window");
const { broadcastStateUpdate } = require("./utils");

function handleTodos() {
  ipcMain.handle("get-todos", async () => {
    return store.get("todos") || [];
  });

  ipcMain.handle("add-todo", async (_e, item) => {
    const todos = store.get("todos") || [];
    const newTodo = { id: Date.now(), done: false, ...item };
    store.set("todos", [...todos, newTodo]);
    broadcastStateUpdate();
    return newTodo;
  });

  ipcMain.handle("toggle-todo", async (_e, id) => {
    const todos = store.get("todos") || [];
    const updated = todos.map(t => (t.id === id ? { ...t, done: !t.done } : t));
    store.set("todos", updated);
    broadcastStateUpdate();
    return true;
  });

  ipcMain.handle("delete-todo", async (_e, id) => {
    const todos = store.get("todos") || [];
    store.set("todos", todos.filter(t => t.id !== id));
    broadcastStateUpdate();
    return true;
  });

  // ✅ 원본: "open-todos"
  ipcMain.handle("open-todos", async () => {
    openTodosPopup();
    return true;
  });
}

module.exports = { handleTodos };
