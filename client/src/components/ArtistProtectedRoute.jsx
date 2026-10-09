import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useArtistAuth } from '../context/ArtistAuthContext';

function ArtistProtectedRoute() {
  const { artist, loading } = useArtistAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-paper-mute">
          Loading...
        </p>
      </div>
    );
  }

  if (!artist) {
    return (
      <Navigate
        to="/artist/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <Outlet />;
}

export default ArtistProtectedRoute;