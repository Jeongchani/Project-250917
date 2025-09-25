import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import TimePopup from "./popups/TimePopup";
import TodosPopup from "./popups/TodosPopup";

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/popup/time" element={<TimePopup />} />
        <Route path="/popup/todos" element={<TodosPopup />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
