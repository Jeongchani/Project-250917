// src/index.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import SettingsPopup from './popups/SettingsPopup';
import TodosPopup from './popups/TodosPopup';

const params = new URLSearchParams(window.location.search);
const w = params.get('window');

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    { w === 'settings' ? <SettingsPopup /> :
      w === 'todos' ? <TodosPopup /> :
      <App /> }
  </StrictMode>
);
