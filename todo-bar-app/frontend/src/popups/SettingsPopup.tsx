import { useEffect, useState } from "react";
import "./SettingsPopup.css";

export default function SettingsPopup() {
  const [start, setStart] = useState(9);
  const [end, setEnd] = useState(18);

  useEffect(() => {
    (async () => {
      const s = await window.electronAPI.getSettings();
      setStart(s.startHour);
      setEnd(s.endHour);
    })();
  }, []);

  const cancel = () => window.electronAPI.close();
  const save = async () => {
    await window.electronAPI.saveSettings({ startHour: start, endHour: end });
    window.electronAPI.close();
  };

  return (
    <div className="settings-container">
      {/* 타이틀바 */}
      <div className="settings-titlebar">
        <div className="title">근무 시간 설정</div>
        <div className="right">
          <button className="tbtn" onClick={() => window.electronAPI.minimize()}>–</button>
          <button className="tbtn" onClick={() => window.electronAPI.close()}>×</button>
        </div>
      </div>

      {/* 본문 */}
      <div className="settings-body">
        <label>
          출근 시간(0~23)
          <input
            type="number"
            min={0}
            max={23}
            value={start}
            onChange={e => setStart(+e.target.value)}
          />
        </label>
        <label>
          퇴근 시간(0~23)
          <input
            type="number"
            min={0}
            max={23}
            value={end}
            onChange={e => setEnd(+e.target.value)}
          />
        </label>
      </div>

      {/* 푸터 */}
      <div className="settings-footer">
        <button className="ghost" onClick={cancel}>취소</button>
        <button className="primary" onClick={save}>완료</button>
      </div>
    </div>
  );
}
