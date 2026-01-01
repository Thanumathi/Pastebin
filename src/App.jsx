import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreatePaste from "./Pages/CreatePaste.jsx";
import ViewPaste from "./Pages/ViewPaste.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreatePaste />} />
        <Route path="/p/:id" element={<ViewPaste />} />
      </Routes>
    </Router>
  );
}

export default App;
