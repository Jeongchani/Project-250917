export type BarPosition = "top" | "bottom";

declare global {
  interface Window {
    electronAPI: {
      setBarPosition: (pos: BarPosition) => Promise<void>;
      minimize: () => void;
      close: () => void;
    };
  }
}

export {};
