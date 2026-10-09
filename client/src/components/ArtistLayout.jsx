import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useArtistAuth } from '../context/ArtistAuthContext';

function ArtistLayout() {
  const { artist, logout } = useArtistAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/artist/login');
  };

  const navLinkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-paper text-ink'
        : 'text-paper-mute hover:text-paper'
    }`;

  return (
    <div className="min-h-screen bg-ink text-paper">

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 border-r border-paper/10 p-6 flex-col">

        <div>
          <p className="kicker">
            ArtFlow
          </p>

          <h1 className="text-xl font-medium mt-2">
            Artist Studio
          </h1>
        </div>

        <nav className="mt-10 space-y-2">
          <NavLink
            to="/artist/dashboard"
            className={navLinkClass}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/artist/bookings"
            className={navLinkClass}
          >
            Bookings
          </NavLink>
        </nav>

        <div className="mt-auto">

          <div className="border-t border-paper/10 pt-5 mb-5">
            <p className="text-sm text-paper-mute">
              Signed in as
            </p>

            <p className="mt-1 text-sm truncate">
              {artist?.name}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full btn-outline"
          >
            Logout
          </button>

        </div>

      </aside>

      {/* Mobile header */}
      <header className="md:hidden border-b border-paper/10 px-5 py-4">

        <div className="flex items-center justify-between gap-4">

          <div className="min-w-0">
            <p className="kicker">
              ArtFlow
            </p>

            <p className="text-lg font-medium mt-1">
              Artist Studio
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="text-sm text-paper-mute hover:text-paper transition-colors shrink-0"
          >
            Logout
          </button>

        </div>

        <nav className="flex gap-2 mt-5 overflow-x-auto pb-1">
          <NavLink
            to="/artist/dashboard"
            className={navLinkClass}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/artist/bookings"
            className={navLinkClass}
          >
            Bookings
          </NavLink>
        </nav>

      </header>

      {/* Main content */}
      <main className="w-full md:ml-64 md:w-[calc(100%-16rem)] min-h-screen">
        <Outlet />
      </main>

    </div>
  );
}

export default ArtistLayout;