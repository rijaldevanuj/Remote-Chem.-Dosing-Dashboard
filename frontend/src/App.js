import { Routes, Route } from "react-router-dom";
import TailwindDemo from "./TailwindDemo";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TailwindDemo />} />
    </Routes>
  );
}

export default App;

