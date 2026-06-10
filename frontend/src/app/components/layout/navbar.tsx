import clsx from "clsx";
import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import Avatar from "../ui/avatar";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const user = {
    name: "Amy Cons",
  };

  const navLinks = [
    { to: "/", label: "Protocols" },
    { to: "/threads", label: "Threads" },
    { to: "/search", label: "Search" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#2a2820] bg-green-900 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div
              className="w-7 h-7 rounded-lg bg-sage-700 flex items-center justify-center
                            group-hover:bg-sage-600 transition-colors"
            >
              <img src="meditation.png" />
            </div>
            <span className="text-lg text-stone-100 tracking-tight">
              Wellness Hub
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={clsx(
                  "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                  location.pathname === l.to
                    ? "text-sage-300 bg-sage-950/60"
                    : "text-stone-400 hover:text-stone-200 hover:bg-white/5",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user ? (
              <div
                className="relative"
                //   ref={menuRef}
              >
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 hover:bg-white/5 rounded-lg px-2 py-1.5 transition-colors"
                >
                  <Avatar name={user.name} size="sm" />
                  <span className="hidden sm:block text-sm text-stone-300 font-medium">
                    {user.name}
                  </span>
                  <svg
                    className="w-3.5 h-3.5 text-stone-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-1.5 w-44 card shadow-2xl py-1 animate-fade-up">
                    <button
                      //   onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-stone-400 hover:text-stone-200 hover:bg-white/5 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">
                  Sign in
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden btn-ghost p-1.5"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    mobileOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden py-3 border-t border-[#2a2820] animate-fade-up">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  "block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === l.to
                    ? "text-sage-300 bg-sage-950/40"
                    : "text-stone-400 hover:text-stone-200",
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
