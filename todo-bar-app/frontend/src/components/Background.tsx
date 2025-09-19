// Background.tsx
import { useEffect, useState } from "react";
import "./Background.css";
import Character from "./Character";

type Props = {
  totalTasks?: number;
  completed?: number;
  workStartHour?: number;
  workDurationHours?: number;
};

export default function Background({
  totalTasks = 10,
  completed = 2,
  workStartHour = 9,
  workDurationHours = 8,
}: Props) {
  const [timeProgress, setTimeProgress] = useState(0);

  useEffect(() => {
    function updateProgress() {
      const now = new Date();
      const start = new Date(now);
      start.setHours(workStartHour, 0, 0, 0);
      const end = new Date(start.getTime() + workDurationHours * 3600 * 1000);
      const p = Math.min(1, Math.max(0, (now.getTime() - start.getTime()) / (end.getTime() - start.getTime())));
      setTimeProgress(p);
    }
    updateProgress();
    const id = setInterval(updateProgress, 1000);
    return () => clearInterval(id);
  }, [workStartHour, workDurationHours]);

  const barWidth = 640;
  const charWidth = 32;
  const homeWidth = 64;
  const leftPx = timeProgress * (barWidth - charWidth - homeWidth);
  const leftCalc = `${leftPx}px`;

  return (
    <div className="bg-container">
      <div className="bg-bar">
        <div className="bg-color-overlay" style={{ width: `${(completed / totalTasks) * 100}%` }} />
        <div className="home" />
        <div className="character-wrapper" style={{ left: leftCalc }}>
          <Character />
        </div>
      </div>
    </div>
  );
}
