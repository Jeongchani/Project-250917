import { useState } from 'react';

function App() {
  const [todos, setTodos] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, input]);
    setInput("");
  };

  return (
    <div style={{ display: "flex", alignItems: "center", padding: "10px", background: "#222", color: "#fff" }}>
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
  );
}

export default App;
