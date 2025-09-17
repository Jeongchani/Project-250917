export {};

declare global {
  interface Window {
    electronAPI: {
      setBarPosition: (pos: "top" | "bottom") => void;
    };
  }
}
