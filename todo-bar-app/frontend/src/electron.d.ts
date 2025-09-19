export type BarPosition = "top" | "bottom";
type Settings = { startHour: number; endHour: number };
type Todo = { id: number; title: string; done: boolean; due?: string };

declare global {
  interface Window {
    electronAPI: {
      minimize: () => void;
      close: () => void;
      openSettings: () => Promise<void>;
      openTodos: () => Promise<void>;

      getSettings: () => Promise<Settings>;
      saveSettings: (data: Settings) => Promise<void>;

      getTodos: () => Promise<Todo[]>;
      addTodo: (item: { title: string; due?: string }) => Promise<void>;
      toggleTodo: (id: number) => Promise<void>;
      deleteTodo: (id: number) => Promise<void>;

      onStateUpdated: (cb: (p:{settings:Settings; todos:Todo[]}) => void) => () => void;
      setBarPosition: (pos: BarPosition) => Promise<void>;
    };
  }
}
export {};
