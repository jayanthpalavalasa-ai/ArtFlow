import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/customer/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Something went wrong. Please try again.'
        );
      }

      setMessage(
        'If an account with that email exists, a password reset link has been sent.'
      );

      setEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
   
      <main className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center px-5 sm:px-8 pt-32 pb-20">
        <div className="w-full max-w-md">

          <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[#B8B3AA]">
            Your Account
          </p>

          <h1 className="mt-3 text-4xl sm:text-5xl font-serif leading-tight">
            Forgot your password?
          </h1>

          <p className="mt-5 text-sm sm:text-base text-[#B8B3AA] leading-relaxed">
            Enter the email associated with your account and we'll
            send you a link to create a new password.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-[#B8B3AA] mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-white/10 bg-[#151515] px-4 py-3.5 text-white outline-none focus:border-[#6F8499] transition"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300 leading-relaxed">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-white px-5 py-3.5 font-semibold text-black transition hover:bg-[#D8D4CC] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#B8B3AA]">
            Remember your password?{' '}
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

export default ForgotPassword;