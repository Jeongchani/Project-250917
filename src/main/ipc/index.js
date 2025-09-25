const { handleWindow } = require("./windowHandler");
const { handleTime } = require("./timeHandler");
const { handleTodos } = require("./todoHandler");


function setupIPC() {
  handleWindow();
  handleTime();
  handleTodos();
}

module.exports = { setupIPC };
