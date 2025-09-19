import { useEffect, useState } from "react";
import "./Popup.css";

type Todo = { id:number; title:string; done:boolean; due?:string };

export default function TodosPopup() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [due, setDue] = useState<string>('');

  useEffect(() => {
    (async () => { setTodos(await window.electronAPI.getTodos()); })();
    const off = window.electronAPI.onStateUpdated(({ todos }) => setTodos(todos));
    return off;
  }, []);

  const add = async () => {
    const t = title.trim();
    if (!t) return;
    await window.electronAPI.addTodo({ title: t, due: due || undefined });
    setTitle(''); setDue('');
  };

  return (
    <div className="popup-container">
      <div className="popup-titlebar">
        <div className="title">일정 추가/완료</div>
        <div className="right">
          <button className="tbtn" onClick={() => window.electronAPI.minimize()}>–</button>
          <button className="tbtn" onClick={() => window.electronAPI.close()}>×</button>
        </div>
      </div>

      <div className="popup-body">
        <div className="row">
          <input placeholder="할 일 제목" value={title} onChange={e=>setTitle(e.target.value)} />
          <input type="time" value={due} onChange={e=>setDue(e.target.value)} />
          <button className="primary" onClick={add}>추가</button>
        </div>

        <ul className="todo-list">
          {todos.map(t => (
            <li key={t.id}>
              <label>
                <input type="checkbox" checked={t.done} onChange={() => window.electronAPI.toggleTodo(t.id)} />
                <span className={t.done ? 'done' : ''}>{t.title}</span>
                {t.due ? <small className="due">{t.due}</small> : null}
              </label>
              <button className="ghost" onClick={() => window.electronAPI.deleteTodo(t.id)}>삭제</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="popup-footer">
        <span/>
        <span style={{opacity:.7, fontSize:12}}>
          완료: {todos.filter(t=>t.done).length} / 총 {todos.length || 0}
        </span>
      </div>
    </div>
  );
}
