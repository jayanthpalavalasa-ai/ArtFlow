import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArtistAuth } from '../context/ArtistAuthContext';

function ArtistLogin() {
  const { login } = useArtistAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      await login(email, password);

      navigate('/artist/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell flex items-center justify-center">
      <div className="w-full max-w-md">

        <p className="kicker">
          Artist Studio
        </p>

        <h1 className="page-title mt-3">
          Welcome back.
        </h1>

        <p className="lede mt-4">
          Sign in to manage your commissions and artwork.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          <div>
            <label className="label">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="field"
              placeholder="artist@example.com"
            />
          </div>

          <div>
            <label className="label">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="field"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="notice-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-solid w-full"
          >
            {loading ? 'Signing in...' : 'Artist Sign In'}
          </button>

        </form>

      </div>
    </main>
  );
}

export default ArtistLogin;