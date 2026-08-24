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
    <main className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">

        <p className="text-sm tracking-[0.3em] uppercase text-[#B8B3AA]">
          Your Account
        </p>

        <h1 className="mt-3 text-4xl font-serif">
          Create your account.
        </h1>

        <p className="mt-4 text-[#B8B3AA] leading-relaxed">
          Keep your commissions connected to you and track their progress
          from one place.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          <div>
            <label className="block text-sm text-[#B8B3AA] mb-2">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              className="w-full rounded-lg border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none focus:border-[#6F8499]"
              placeholder="Your name"
            />
          </div>

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
            <label className="block text-sm text-[#B8B3AA] mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full rounded-lg border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none focus:border-[#6F8499]"
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label className="block text-sm text-[#B8B3AA] mb-2">
              Confirm password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full rounded-lg border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none focus:border-[#6F8499]"
              placeholder="Enter your password again"
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

        </form>

        <p className="mt-8 text-center text-sm text-[#B8B3AA]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-white hover:text-[#6F8499] transition"
          >
            Sign in
          </Link>
        </p>

      </div>
    </main>
  );
}

export default Signup;