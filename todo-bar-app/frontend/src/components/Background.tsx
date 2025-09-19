// Background.tsx
import { useEffect, useState } from "react";
import "./Background.css";
import Character from "./Character";

type Settings = { startHour: number; endHour: number };
type Todo = { id:number; title:string; done:boolean; due?:string };

export default function Background() {
  const [settings, setSettings] = useState<Settings>({ startHour: 9, endHour: 18 });
  const [todos, setTodos] = useState<Todo[]>([]);
  const [timeProgress, setTimeProgress] = useState(0); // 0..1

  // 초기 로드 + 구독
  useEffect(() => {
    async function load() {
      const s = await window.electronAPI.getSettings();
      const t = await window.electronAPI.getTodos();
      setSettings(s);
      setTodos(t);
    }
    load();
    const off = window.electronAPI.onStateUpdated(({ settings, todos }) => {
      setSettings(settings);
      setTodos(todos);
    });
    return off;
  }, []);

  // 시간 진행도
  useEffect(() => {
    function updateProgress() {
      const now = new Date();
      const start = new Date(now);
      start.setHours(settings.startHour, 0, 0, 0);
      const end = new Date(now);
      end.setHours(settings.endHour, 0, 0, 0);
      const denom = end.getTime() - start.getTime();
      const p = denom <= 0 ? 1 : Math.min(1, Math.max(0, (now.getTime() - start.getTime()) / denom));
      setTimeProgress(p);
    }
    updateProgress();
    const id = setInterval(updateProgress, 1000);
    return () => clearInterval(id);
  }, [settings]);

  // 배경 채움
  const total = todos.length || 1;
  const completed = todos.filter(x => x.done).length;
  const fillPercent = (completed / total) * 100;

  // 캐릭터 x 이동
  const barWidth = 640, charWidth = 32, homeWidth = 64;
  const leftPx = timeProgress * (barWidth - charWidth - homeWidth);
  const leftCalc = `${leftPx}px`;

  return (
    <div className="bg-container">
      {/* 타이틀바 */}
      <div className="titlebar">
        <div className="left-controls">
          <button className="icon-btn" title="할 일 추가" onClick={() => window.electronAPI.openTodos()}>＋</button>
          <button className="icon-btn" title="설정" onClick={() => window.electronAPI.openSettings()}>⚙</button>
        </div>
        <div className="right-controls">
          <button className="icon-btn" onClick={() => window.electronAPI.minimize()}>–</button>
          <button className="icon-btn" onClick={() => window.electronAPI.close()}>×</button>
        </div>
      </div>

      {/* 본체 */}
      <div className="bg-bar">
        <div className="bg-color-overlay" style={{ width: `${fillPercent}%` }} />
        <div className="home" />
        <div className="character-wrapper" style={{ left: leftCalc }}>
          <Character />
        </div>
      </div>
    </div>
  );
}
