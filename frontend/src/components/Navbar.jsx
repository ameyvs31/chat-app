import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const copyKey = () => {
    navigator.clipboard.writeText(user.chatKey);
    alert("Chat Key copied! 🔑");
  };

  return (
    <div className="bg-blue-600 dark:bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-md transition-colors">

      {/* App name */}
      <h1 className="text-xl font-bold">💬 PrivateChat</h1>

      {/* Chat Key */}
      <div className="flex items-center gap-2 bg-blue-500 dark:bg-gray-700 px-4 py-1 rounded-full">
        <span className="text-sm">Your Key:</span>
        <span className="font-bold tracking-widest">{user?.chatKey}</span>
        <button
          onClick={copyKey}
          className="bg-white text-blue-600 text-xs px-2 py-0.5 rounded-full font-semibold hover:bg-blue-100"
        >
          Copy
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="text-xl hover:scale-110 transition-transform"
          title="Toggle Dark/Light Mode"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <span className="text-sm">Hi, {user?.name}!</span>

        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 text-sm font-semibold px-3 py-1 rounded-lg hover:bg-blue-100"
        >
          Logout
        </button>
      </div>

    </div>
  );
};

export default Navbar;