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
  workDurationHours = 8, // 기본 8시간
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

  const taskFill = Math.min(1, Math.max(0, completed / Math.max(1, totalTasks)));
  const leftPercent = Math.min(100, Math.max(0, timeProgress * 100));
  const leftCalc = `calc(${leftPercent}% - 16px)`; // 16px = half 캐릭터 폭

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
