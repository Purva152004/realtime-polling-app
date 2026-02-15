import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreatePoll from "./pages/CreatePoll";
import PollPage from "./pages/PollPage";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<CreatePoll />} />
        <Route path="/poll/:id" element={<PollPage />} />
      </Routes>
    </BrowserRouter>
  );
}
