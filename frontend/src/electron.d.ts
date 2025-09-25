export type TimeConfig = {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
};
export type Todo = { id: number; title: string; done: boolean; due?: string };

declare global {
  declare module "*.css";
  interface Window {
    electronAPI: {
      minimize: () => void;
      close: () => void;

      openTime: () => Promise<void>;
      openTodos: () => Promise<void>;

      getTimeConfig: () => Promise<TimeConfig>;
      saveTimeConfig: (data: TimeConfig) => Promise<void>;

      getTodos: () => Promise<Todo[]>;
      addTodo: (item: { title: string; due?: string }) => Promise<void>;
      toggleTodo: (id: number) => Promise<void>;
      deleteTodo: (id: number) => Promise<void>;

      onStateUpdated: (
      cb: (p: { timeConfig: TimeConfig; todos: Todo[] }) => void
      ) => () => void;
    };
  }
}
export {};
