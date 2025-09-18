// Background.tsx
import { useEffect, useState } from "react";
import "./Background.css";
import Character from "./Character";

type Props = {
  totalTasks?: number;      // 기본 10
  completed?: number;       // 기본 2
  workStartHour?: number;   // 기본 9 (변경 가능)
  workDurationHours?: number; // 기본 8
};

export default function Background({
  totalTasks = 10,
  completed = 3,
  workStartHour = 9,
  workDurationHours = 8,
}: Props) {
  const [timeProgress, setTimeProgress] = useState(0); // 0..1

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
    const id = setInterval(updateProgress, 1000); // 1초마다 갱신(부드러운 이동)
    return () => clearInterval(id);
  }, [workStartHour, workDurationHours]);

  const taskFill = Math.min(1, Math.max(0, completed / Math.max(1, totalTasks)));
  const leftCalc = `calc(${timeProgress * 100}% - 16px)`; // 캐릭터 폭 32px → 가운데 보정

  return (
    <div className="bg-container">
      <div className="bg-bar">
        <div className="bg-color-overlay" style={{ width: `${taskFill * 100}%` }} />
        <div className="character-wrapper" style={{ left: leftCalc }}>
          <Character />
        </div>
      </div>
    </div>
  );
}