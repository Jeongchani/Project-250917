import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import TimePopup from "./popups/TimePopup";
import TodosPopup from "./popups/TodosPopup";

const params = new URLSearchParams(window.location.search);
const w = params.get("window");

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    {w === "time" ? <TimePopup /> : w === "todos" ? <TodosPopup /> : <App />}
  </StrictMode>
);
