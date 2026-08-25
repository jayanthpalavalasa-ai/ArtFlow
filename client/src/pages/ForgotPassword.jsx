import { useState } from 'react';
import { Link } from 'react-router-dom';

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
    <main className="page-shell flex items-center justify-center">
      <div className="w-full max-w-md">

        <p className="kicker">
          Your Account
        </p>

        <h1 className="page-title mt-3">
          Forgot your password?
        </h1>

        <p className="lede mt-5">
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
              className="label"
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
              className="field"
            />
          </div>

          {error && (
            <div className="notice-error">
              {error}
            </div>
          )}

          {message && (
            <div className="notice-ok">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-solid w-full"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-paper-mute">
          Remember your password?{' '}
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

export default ForgotPassword;
