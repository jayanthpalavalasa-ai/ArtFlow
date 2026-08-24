import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
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

      const response = await fetch(
        'http://localhost:5000/api/auth/customer/reset-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            newPassword: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password.');
      }

      setMessage('Password reset successfully. You can now log in.');

      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/account');
      }, 2000);

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
          Account
        </p>

        <h1 className="mt-3 text-4xl font-serif">
          Reset Password
        </h1>

        <p className="mt-4 text-[#B8B3AA] leading-relaxed">
          Create a new password for your Eswar Tallapudi's Art account.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          <div>
            <label className="block text-sm text-[#B8B3AA] mb-2">
              New password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-lg border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none focus:border-[#6F8499]"
              placeholder="Enter new password"
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
              className="w-full rounded-lg border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none focus:border-[#6F8499]"
              placeholder="Confirm new password"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white px-5 py-3 font-semibold text-black transition hover:bg-[#D8D4CC] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

        </form>

      </div>
    </main>
  );
}

export default ResetPassword;