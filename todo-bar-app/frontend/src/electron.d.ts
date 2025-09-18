// frontend/src/electron.d.ts
export type BarPosition = 'top' | 'bottom';

declare global {
  interface Window {
    electronAPI: {
      setBarPosition: (pos: BarPosition) => Promise<void>;
      // 필요시 추가 API 선언
    };
  }
}

export {};
