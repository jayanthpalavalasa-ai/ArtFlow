import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Signup() {
  const { signup } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      await signup(name, email, password);

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
          Create your account.
        </h1>

        <p className="lede mt-4">
          Keep your commissions connected to you and track their progress
          from one place.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          <div>
            <label className="label">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              className="field"
              placeholder="Your name"
            />
          </div>

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
            <label className="label">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="field"
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label className="label">
              Confirm password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="field"
              placeholder="Enter your password again"
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

        </form>

        <p className="mt-8 text-center text-sm text-paper-mute">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-paper hover:text-mist transition-colors duration-500"
          >
            Sign in
          </Link>
        </p>

      </div>
    </main>
  );
}

export default Signup;
