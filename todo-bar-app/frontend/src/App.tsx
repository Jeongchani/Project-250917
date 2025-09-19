// import { useState } from 'react';

// import Character from "./components/Character";
import Background from "./components/Background";

function App() {
  // 예시: 총 10개 중 2개 완료, 출근 9시, 근무 8시간
  return <Background totalTasks={10} completed={3} workStartHour={9} workDurationHours={3} />;
}
export default App;
