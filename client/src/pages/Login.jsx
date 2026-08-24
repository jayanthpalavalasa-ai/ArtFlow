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

      // If the user was redirected here from somewhere,
      // return them there. Otherwise go to account.
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
 

    <main className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center px-6 pt-32 pb-20">
      
      
      <div className="w-full max-w-md">

        <p className="text-sm tracking-[0.3em] uppercase text-[#B8B3AA]">
          Your Account
        </p>

        <h1 className="mt-3 text-4xl font-serif">
          Welcome back.
        </h1>

        <p className="mt-4 text-[#B8B3AA] leading-relaxed">
          Sign in to view your bookings and track your artwork.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          <div>
            <label className="block text-sm text-[#B8B3AA] mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-lg border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none focus:border-[#6F8499]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm text-[#B8B3AA]">
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-[#6F8499] hover:text-white transition"
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
              className="w-full rounded-lg border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none focus:border-[#6F8499]"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white px-5 py-3 font-semibold text-black transition hover:bg-[#D8D4CC] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        <p className="mt-8 text-center text-sm text-[#B8B3AA]">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-white hover:text-[#6F8499] transition"
          >
            Create one
          </Link>
        </p>

      </div>
        </main>

);
}

export default Login;