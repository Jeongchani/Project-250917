import { useState } from 'react';

function App() {
  const [todos, setTodos] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, input]);
    setInput("");
  };

  const changePosition = (pos: "top" | "bottom") => {
    setMenuOpen(false);
    // Electron 메인 프로세스에 IPC로 전달
    window.electronAPI.setBarPosition(pos);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", background: "#222", color: "#fff", position: "relative" }}>
      {/* 왼쪽: Todo 입력 */}
      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="할 일 입력..."
          style={{ flex: 1, marginRight: "10px" }}
        />
        <button onClick={addTodo}>추가</button>
        <ul style={{ marginLeft: "20px" }}>
          {todos.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>

      {/* 오른쪽: 설정 버튼 */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", fontSize: "18px" }}
        >
          ⚙️
        </button>

        {menuOpen && (
          <div style={{
            position: "absolute",
            right: 0,
            top: "100%",
            background: "#333",
            border: "1px solid #555",
            borderRadius: "4px",
            padding: "5px",
            zIndex: 1000
          }}>
            <div style={{ padding: "5px", cursor: "pointer" }} onClick={() => changePosition("top")}>
              상단
            </div>
            <div style={{ padding: "5px", cursor: "pointer" }} onClick={() => changePosition("bottom")}>
              하단
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;