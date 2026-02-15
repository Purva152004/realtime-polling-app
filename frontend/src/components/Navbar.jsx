import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isCreatePage = location.pathname === "/";

  const [dark, setDark] = useState(
  document.documentElement.classList.contains("dark")
);

const toggleTheme = () => {
  document.documentElement.classList.toggle("dark");
  const isDark = document.documentElement.classList.contains("dark");
  setDark(isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
};

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-lg animate-navbar">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Brand */}
        <div className="flex items-center gap-4 -ml-20">
          <div className="bg-white/20 p-2 rounded-xl shadow-md">
            <span className="text-white text-xl">🗳️</span>
          </div>

          <div>
            <h1 className="text-white text-2xl font-extrabold tracking-wide">
              Live Polls
            </h1>
            <div className="flex items-center gap-2">
  <span className="relative flex h-2 w-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
  </span>
  <p className="text-white/80 text-xs tracking-wide">
    Real-time voting dashboard
  </p>
</div>

          </div>
        </div>

        {/* Create Poll Button */}
        <button
          onClick={() => navigate("/")}
          className={`
            px-6 py-2 rounded-full font-semibold transition-all duration-300
            ${
              isCreatePage
                ? "bg-yellow-300 text-indigo-800 shadow-xl scale-105"
                : "bg-white text-indigo-600 hover:bg-yellow-100 hover:scale-105 shadow-md"
            }
          `}
          style={{ marginRight: "-2200px" }}
        >
          Create Poll
        </button>
         <span className="h-6 w-px bg-white/30"></span>
        <button
  onClick={toggleTheme}
  className="
    mr-1 rounded-full px-4 py-2 -mr-40 text-sm font-semibold
    bg-white/20 text-white hover:bg-white/30
    transition
  "
>
  {dark ? "🌙 Dark" : "☀️ Light"}
  
</button>

      </div>
    </nav>
  );
}
