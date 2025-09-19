import { useEffect, useState } from "react";
import "./SettingsPopup.css";

export default function SettingsPopup() {
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("18:00");

  useEffect(() => {
    (async () => {
      const s = await window.electronAPI.getSettings();
      const startStr =
        String(s.startHour).padStart(2, "0") +
        ":" +
        String(s.startMinute).padStart(2, "0");
      const endStr =
        String(s.endHour).padStart(2, "0") +
        ":" +
        String(s.endMinute).padStart(2, "0");
      setStart(startStr);
      setEnd(endStr);
    })();
  }, []);

  const cancel = () => window.electronAPI.close();
  const save = async () => {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    await window.electronAPI.saveSettings({
      startHour: sh,
      startMinute: sm,
      endHour: eh,
      endMinute: em,
    });
    window.electronAPI.close();
  };

  return (
    <div className="settings-container">
      <div className="settings-titlebar">
        <div className="title">근무 시간 설정</div>
        <div className="right">
          <button className="tbtn" onClick={() => window.electronAPI.minimize()}>–</button>
          <button className="tbtn" onClick={() => window.electronAPI.close()}>×</button>
        </div>
      </div>

      <div className="settings-body">
        <label>
          출근 시간
          <input
            type="time"
            step={1800}
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </label>
        <label>
          퇴근 시간
          <input
            type="time"
            step={1800}
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </label>
      </div>

      <div className="settings-footer">
        <button className="ghost" onClick={cancel}>취소</button>
        <button className="primary" onClick={save}>완료</button>
      </div>
    </div>
  );
}
