import { useEffect, useState } from "react";
import "./Popup.css";

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
    <div className="popup-container">
      <div className="popup-titlebar">
        <div className="title">근무 시간 설정</div>
        <div className="right">
          <button className="tbtn" onClick={() => window.electronAPI.minimize()}>–</button>
          <button className="tbtn" onClick={() => window.electronAPI.close()}>×</button>
        </div>
      </div>

      <div className="popup-body">
        <label>출근 시간(0~23)
          <input type="number" min={0} max={23} value={start} onChange={e=>setStart(+e.target.value)} />
        </label>
        <label>퇴근 시간(0~23)
          <input type="number" min={0} max={23} value={end} onChange={e=>setEnd(+e.target.value)} />
        </label>
      </div>

      <div className="popup-footer">
        <button className="ghost" onClick={cancel}>취소</button>
        <button className="primary" onClick={save}>완료</button>
      </div>
    </div>
  );
}
