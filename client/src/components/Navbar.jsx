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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0B0B]/90 backdrop-blur-md border-b border-white/10">

      <div className="max-w-7xl mx-auto px-5 sm:px-7 lg:px-10 h-[76px] flex items-center justify-between">

        {/* Brand */}
        <Link
          to="/"
          onClick={closeMenu}
          className="group flex flex-col leading-none"
        >
          <span className="font-display text-[17px] sm:text-[19px] font-medium tracking-[0.14em] text-[#F1EEE7] transition-opacity duration-300 group-hover:opacity-75">
  ESWAR TALLAPUDI'S
</span>

<span className="mt-1.5 text-[8px] sm:text-[9px] font-medium tracking-[0.58em] uppercase text-[#8F9BA6]">
  ART
</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-7 lg:gap-9 text-[13px] tracking-[0.06em] text-[#B8B3AA]">

          <Link
            to="/"
            className="hover:text-[#F1EEE7] transition-colors duration-300"
          >
            Home
          </Link>

          <Link
            to="/portfolio"
            className="hover:text-[#F1EEE7] transition-colors duration-300"
          >
            Portfolio
          </Link>

          <Link
            to="/commission"
            className="hover:text-[#F1EEE7] transition-colors duration-300"
          >
            Commission
          </Link>

          <Link
            to="/track"
            className="hover:text-[#F1EEE7] transition-colors duration-300"
          >
            Track
          </Link>

          <span className="h-4 w-px bg-white/15" />

          {customer ? (
            <>
              <Link
                to="/account"
                className="hover:text-[#F1EEE7] transition-colors duration-300"
              >
                My Account
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="hover:text-[#F1EEE7] transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-[#F1EEE7] hover:text-[#8F9BA6] transition-colors duration-300"
            >
              Sign In
            </Link>
          )}

        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden flex flex-col justify-center gap-[5px] w-9 h-9"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span
            className={`block h-px w-7 bg-[#F1EEE7] transition-transform duration-300 ${
              menuOpen ? 'translate-y-[3px] rotate-45' : ''
            }`}
          />

          <span
            className={`block h-px w-7 bg-[#F1EEE7] transition-opacity duration-300 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />

          <span
            className={`block h-px w-7 bg-[#F1EEE7] transition-transform duration-300 ${
              menuOpen ? '-translate-y-[9px] -rotate-45' : ''
            }`}
          />
        </button>

      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen
            ? 'max-h-[500px] border-t border-white/10'
            : 'max-h-0'
        }`}
      >
        <div className="bg-[#0B0B0B] px-5 sm:px-7 py-3">

          <Link
            to="/"
            onClick={closeMenu}
            className="block py-3.5 text-sm tracking-[0.06em] text-[#B8B3AA] hover:text-[#F1EEE7]"
          >
            Home
          </Link>

          <Link
            to="/portfolio"
            onClick={closeMenu}
            className="block py-3.5 text-sm tracking-[0.06em] text-[#B8B3AA] hover:text-[#F1EEE7]"
          >
            Portfolio
          </Link>

          <Link
            to="/commission"
            onClick={closeMenu}
            className="block py-3.5 text-sm tracking-[0.06em] text-[#B8B3AA] hover:text-[#F1EEE7]"
          >
            Commission
          </Link>

          <Link
            to="/track"
            onClick={closeMenu}
            className="block py-3.5 text-sm tracking-[0.06em] text-[#B8B3AA] hover:text-[#F1EEE7]"
          >
            Track
          </Link>

          <div className="my-2 h-px bg-white/10" />

          {customer ? (
            <>
              <Link
                to="/account"
                onClick={closeMenu}
                className="block py-3.5 text-sm tracking-[0.06em] text-[#F1EEE7]"
              >
                My Account
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="block w-full py-3.5 text-left text-sm tracking-[0.06em] text-[#B8B3AA] hover:text-[#F1EEE7]"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={closeMenu}
              className="block py-3.5 text-sm tracking-[0.06em] text-[#F1EEE7]"
            >
              Sign In
            </Link>
          )}

        </div>
      </div>

    </nav>
  );
}

export default Navbar;