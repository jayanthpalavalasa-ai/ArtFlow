import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { customer, logout } = useAuth();
  const navigate = useNavigate();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  const linkClass =
    'text-[13px] tracking-[0.08em] text-paper-mute hover:text-paper transition-colors duration-500';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-line bg-ink/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between">
        <Link
          to="/"
          onClick={closeMenu}
          className="group flex flex-col leading-none"
        >
          <span className="font-display text-[15px] sm:text-[16px] font-medium tracking-[0.16em] text-paper transition-opacity duration-500 group-hover:opacity-70">
            ESWAR TALLAPUDI'S
          </span>
          <span className="mt-1.5 text-[8px] tracking-[0.46em] uppercase text-mist">
            Art
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          <Link to="/" className={linkClass}>
            Home
          </Link>
          <Link to="/portfolio" className={linkClass}>
            Portfolio
          </Link>
          <Link to="/commission" className={linkClass}>
            Commission
          </Link>
          <Link to="/track" className={linkClass}>
            Track
          </Link>

          <span className="h-3.5 w-px bg-line" />

          {customer ? (
            <>
              <Link to="/account" className={linkClass}>
                Account
              </Link>
              <button type="button" onClick={handleLogout} className={linkClass}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-[13px] tracking-[0.08em] text-paper hover:text-mist transition-colors duration-500">
              Sign In
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden flex flex-col justify-center gap-[5px] w-9 h-9"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span
            className={`block h-px w-6 bg-paper transition-transform duration-500 ${
              menuOpen ? 'translate-y-[6px] rotate-45' : ''
            }`}
          />
          <span
            className={`block h-px w-6 bg-paper transition-opacity duration-500 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-px w-6 bg-paper transition-transform duration-500 ${
              menuOpen ? '-translate-y-[6px] -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-500 ${
          menuOpen ? 'max-h-[420px] border-t border-line' : 'max-h-0'
        }`}
      >
        <div className="bg-ink px-5 py-2">
          <Link to="/" onClick={closeMenu} className="block py-3 text-sm tracking-[0.08em] text-paper-mute hover:text-paper">
            Home
          </Link>
          <Link to="/portfolio" onClick={closeMenu} className="block py-3 text-sm tracking-[0.08em] text-paper-mute hover:text-paper">
            Portfolio
          </Link>
          <Link to="/commission" onClick={closeMenu} className="block py-3 text-sm tracking-[0.08em] text-paper-mute hover:text-paper">
            Commission
          </Link>
          <Link to="/track" onClick={closeMenu} className="block py-3 text-sm tracking-[0.08em] text-paper-mute hover:text-paper">
            Track
          </Link>
          <div className="my-1 h-px bg-line" />
          {customer ? (
            <>
              <Link to="/account" onClick={closeMenu} className="block py-3 text-sm tracking-[0.08em] text-paper">
                Account
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full py-3 text-left text-sm tracking-[0.08em] text-paper-mute hover:text-paper"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={closeMenu} className="block py-3 text-sm tracking-[0.08em] text-paper">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
