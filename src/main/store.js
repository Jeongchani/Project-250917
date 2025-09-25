const Store = require("electron-store");

const schema = {
  timeConfig: {
    type: "object",
    properties: {
      startHour: { type: "number" },
      startMinute: { type: "number" },
      endHour: { type: "number" },
      endMinute: { type: "number" }
    },
    additionalProperties: true
  },
  todos: {
    type: "array",
    items: {
      type: "object",
      properties: {
        id: { type: "number" },
        title: { type: "string" },
        done: { type: "boolean" },
        due: { type: ["string", "null"] }
      },
      additionalProperties: true
    }
  }
};

const store = new Store({ schema });
module.exports = store;
