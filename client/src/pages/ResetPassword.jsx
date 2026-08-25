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
    <main className="page-shell flex items-center justify-center">
      <div className="w-full max-w-md">

        <p className="kicker">
          Account
        </p>

        <h1 className="page-title mt-3">
          Reset Password
        </h1>

        <p className="lede mt-4">
          Create a new password for your Eswar Tallapudi's Art account.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          <div>
            <label className="label">
              New password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="field"
              placeholder="Enter new password"
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
              className="field"
              placeholder="Confirm new password"
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
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

        </form>

      </div>
    </main>
  );
}

export default ResetPassword;
