import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

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

      const destination =
        location.state?.from || '/account';

      navigate(destination);
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
          Your Account
        </p>

        <h1 className="page-title mt-3">
          Welcome back.
        </h1>

        <p className="lede mt-4">
          Sign in to view your bookings and track your artwork.
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
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label mb-0">
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-accent hover:text-paper transition-colors duration-500"
              >
                Forgot password?
              </Link>
            </div>

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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        <p className="mt-8 text-center text-sm text-paper-mute">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-paper hover:text-mist transition-colors duration-500"
          >
            Create one
          </Link>
        </p>

      </div>
    </main>
  );
}

export default Login;
