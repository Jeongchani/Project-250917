import { useEffect, useState } from "react";
import "./Background.css";
import Character from "./Character";

type TimeConfig = {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
};
type Todo = { id: number; title: string; done: boolean; due?: string };

export default function Background() {
  const [timeConfig, setTimeConfig] = useState<TimeConfig>({
    startHour: 9,
    startMinute: 0,
    endHour: 18,
    endMinute: 0,
  });
  const [todos, setTodos] = useState<Todo[]>([]);
  const [timeProgress, setTimeProgress] = useState(0);

  useEffect(() => {
    (async () => {
      setTimeConfig(await window.electronAPI.getTimeConfig());
      setTodos(await window.electronAPI.getTodos());
    })();
    const off = window.electronAPI.onStateUpdated(({ timeConfig, todos }) => {
      setTimeConfig(timeConfig);
      setTodos(todos);
    });
    return off;
  }, []);

  useEffect(() => {
    let id: NodeJS.Timeout;
    function updateProgress() {
      const now = new Date();
      const start = new Date(now);
      const end = new Date(now);

      start.setHours(timeConfig.startHour, timeConfig.startMinute, 0, 0);
      end.setHours(timeConfig.endHour, timeConfig.endMinute, 0, 0);

      const denom = end.getTime() - start.getTime();
      const p =
        denom <= 0
          ? 1
          : Math.min(
              1,
              Math.max(0, (now.getTime() - start.getTime()) / denom)
            );
      setTimeProgress(p);
    }
    updateProgress();
    id = setInterval(updateProgress, 1000);
    return () => clearInterval(id);
  }, [timeConfig]);

  const total = todos.length || 1;
  const completed = todos.filter((x) => x.done).length;
  const fillPercent = (completed / total) * 100;

  const barWidth = 640,
    charWidth = 32,
    homeWidth = 64;
  const leftPx = timeProgress * (barWidth - charWidth - homeWidth);
  const leftCalc = `${leftPx}px`;

  return (
    <div className="bg-container">
      <div className="titlebar">
        <div className="left-controls">
          <button className="icon-btn" title="일정 팝업" onClick={() => window.electronAPI.openTodos()}>＋</button>
          <button className="icon-btn" title="시간 기능" onClick={() => window.electronAPI.openTime()}>🕒</button>
        </div>
        <div className="right-controls">
          <button className="icon-btn" onClick={() => window.electronAPI.minimize()}>–</button>
          <button className="icon-btn" onClick={() => window.electronAPI.close()}>×</button>
        </div>
      </div>

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
