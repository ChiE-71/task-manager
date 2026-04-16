import { useState } from "react";
import Tasks from "./Tasks";

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <div className="bg-background text-font">
      <div className="login-page flex flex-col items-center min-h-screen relative">
        <button
          onClick={() => setMenuOpen(true)}
          className="absolute top-4 right-4 w-10 h-10 flex flex-col justify-center items-center gap-1"
          aria-label="Open menu"
        >
          <span className="w-6 h-0.5 bg-font"></span>
          <span className="w-6 h-0.5 bg-font"></span>
          <span className="w-6 h-0.5 bg-font"></span>
        </button>
        <div className="my-10">
          <h1 className="font-heading text-4xl font-semibold">TASK MANAGER</h1>
        </div>
        <div className="bg-font w-full h-0.5" />
        <div className="flex flex-col items-center gap-5 py-10">
          <Tasks />
        </div>
      </div>
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-200 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-background border-l border-white/10 transform transition-transform duration-300 z-50 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col gap-4">
          <button
            onClick={logout}
            className="text-left px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
          >
            Log out
          </button>

          <button
            onClick={() => setMenuOpen(false)}
            className="text-sm text-gray-400 hover:text-white text-left"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
