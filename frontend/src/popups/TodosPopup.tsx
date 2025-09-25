import { useEffect, useState } from "react";
import "./TodosPopup.css";

type Todo = { id: number; title: string; done: boolean; due?: string };

// 클라이언트에서도 정렬 함수 한 번 더
function sortTodos(list: Todo[]): Todo[] {
  const withDue = list.filter(t => t.due);
  const withoutDue = list.filter(t => !t.due);

  withDue.sort((a, b) => a.due!.localeCompare(b.due!));

  return [...withDue, ...withoutDue];
}

export default function TodosPopup() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [due, setDue] = useState<string>("");

  useEffect(() => {
    (async () => { 
      const raw = await window.electronAPI.getTodos();
      setTodos(sortTodos(raw));
    })();
    const off = window.electronAPI.onStateUpdated(({ todos }) => 
      setTodos(sortTodos(todos))
    );
    return off;
  }, []);

  const add = async () => {
    const t = title.trim();
    if (!t) return;
    await window.electronAPI.addTodo({ title: t, due: due || undefined });
    setTitle(""); setDue("");
  };

  return (
    <div className="todos-container">
      {/* 타이틀바 */}
      <div className="todos-titlebar">
        <div className="title">일정 추가/완료</div>
        <div className="right">
          <button className="tbtn" onClick={() => window.electronAPI.minimize()}>–</button>
          <button className="tbtn" onClick={() => window.electronAPI.close()}>×</button>
        </div>
      </div>

      {/* 본문 */}
      <div className="todos-body">
        <div className="row">
          <input
            placeholder="할 일 제목"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input
            type="time"
            value={due}
            onChange={e => setDue(e.target.value)}
          />
          <button className="primary" onClick={add}>추가</button>
        </div>

        <ul className="todo-list">
          {todos.map(t => (
            <li key={t.id}>
              <label>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => window.electronAPI.toggleTodo(t.id)}
                />
                <span className={t.done ? "done" : ""}>{t.title}</span>
                {t.due ? <small className="due">{t.due}</small> : null}
              </label>
              <button
                className="ghost"
                onClick={() => window.electronAPI.deleteTodo(t.id)}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 푸터 */}
      <div className="todos-footer">
        <span />
        <span style={{ opacity: 0.7, fontSize: 12 }}>
          완료: {todos.filter(t => t.done).length} / 총 {todos.length}
        </span>
      </div>
    </div>
  );
}
