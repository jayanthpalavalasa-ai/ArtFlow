import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000';

function DepositPaymentSection({ booking, onPaymentUpdated }) {
  const { customer } = useAuth();

  const [screenshotFile, setScreenshotFile] = useState(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!booking) return null;

  const payment = booking.payment || {};
  const isDepositPaid = payment.depositPaid || booking.status === 'in_progress';
  const isScreenshotSubmitted = payment.depositScreenshotSubmitted || !!payment.depositScreenshotUrl;
  const depositAmount = payment.depositAmount ?? (booking.totalPrice ? booking.totalPrice / 2 : null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setScreenshotFile(file);
    setErrorMsg('');
  };

  const handleSubmitDeposit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!screenshotFile) {
      setErrorMsg('Please select a payment screenshot image.');
      return;
    }

    if (booking.isGuest && !customer && !guestEmail.trim()) {
      setErrorMsg('Please enter the email address used when booking to verify your guest request.');
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('paymentScreenshot', screenshotFile);

      if (booking.isGuest && !customer) {
        formData.append('customerEmail', guestEmail.trim());
      } else if (guestEmail.trim()) {
        formData.append('customerEmail', guestEmail.trim());
      }

      const token = localStorage.getItem('customerToken');

      const response = await fetch(
        `${API_URL}/api/bookings/${booking.bookingId}/deposit-payment`,
        {
          method: 'PATCH',
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit deposit payment.');
      }

      setSuccessMsg('Payment submitted. Awaiting confirmation.');
      setScreenshotFile(null);

      if (onPaymentUpdated) {
        onPaymentUpdated(data.booking || data);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // State 3: Deposit Confirmed / In Progress
  if (isDepositPaid) {
    return (
      <div className="panel mt-6 p-5 sm:p-7 border-l-2 border-l-accent">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
          <p className="kicker">Deposit Confirmed</p>
        </div>
        <h3 className="font-display mt-2 text-xl text-paper">
          Payment confirmed.
        </h3>
        <p className="mt-2 text-sm leading-6 text-paper-mute">
          Your artwork is now in progress.
        </p>
      </div>
    );
  }

  // State 2: Screenshot Submitted & Waiting for Confirmation
  if (booking.status === 'accepted' && isScreenshotSubmitted) {
    return (
      <div className="panel mt-6 p-5 sm:p-7">
        <p className="kicker">Payment Verification</p>
        <h3 className="font-display mt-2 text-xl text-paper">
          Payment submitted. Awaiting confirmation.
        </h3>
        <p className="mt-3 text-sm leading-6 text-paper-mute">
          Thank you for uploading your payment screenshot. The artist will verify your deposit shortly and update your commission to in progress.
        </p>
      </div>
    );
  }

  // State 1: Artwork Accepted & Deposit Required
  if (booking.status === 'accepted' && !isDepositPaid && !isScreenshotSubmitted) {
    return (
      <div className="panel mt-6 p-5 sm:p-7">
        <div className="mb-6">
          <p className="kicker">Deposit Payment Required</p>
          <h3 className="section-title mt-2 text-xl sm:text-2xl">
            Your artwork has been accepted.
          </h3>
          <p className="mt-2 text-sm leading-6 text-paper-mute">
            Please submit the 50% deposit to begin creation.
          </p>
        </div>

        {/* Deposit details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="border border-line bg-ink-soft p-4">
            <p className="kicker">Deposit Amount (50%)</p>
            <p className="mt-2 text-2xl font-mono text-paper">
              {depositAmount !== null ? `₹${depositAmount}` : 'To be calculated'}
            </p>
          </div>

          <div className="border border-line bg-ink-soft p-4">
            <p className="kicker">Payment Method</p>
            <p className="mt-2 text-sm text-paper font-mono">UPI ID: eswar.art@upi</p>
            <p className="mt-1 text-xs text-mist">
              Scan or copy UPI ID to transfer deposit
            </p>
          </div>
        </div>

        {/* Submit form */}
        <form onSubmit={handleSubmitDeposit} className="space-y-5">
          {/* Guest email verification if guest booking */}
          {(booking.isGuest || !customer) && (
            <div>
              <label htmlFor="depositGuestEmail" className="label">
                Email Address Verification
              </label>
              <input
                id="depositGuestEmail"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="Enter email used for booking"
                required
                className="field"
              />
              <p className="mt-1.5 text-xs text-mist">
                Required for guest booking payment verification.
              </p>
            </div>
          )}

          {/* Screenshot upload */}
          <div>
            <label htmlFor="paymentScreenshot" className="label">
              Upload Payment Screenshot
            </label>
            <div className="border border-dashed border-line bg-ink-soft p-4">
              <input
                id="paymentScreenshot"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="w-full text-sm text-paper-mute file:mr-4 file:border-0 file:bg-paper file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink cursor-pointer"
              />
              <p className="mt-2 text-xs text-mist">
                Please attach a clear image of your completed transfer receipt/screenshot.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="notice-error text-xs">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="notice-ok text-xs">
              {successMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-solid w-full"
          >
            {isSubmitting ? 'Uploading Payment Screenshot...' : 'Submit Deposit Payment'}
          </button>
        </form>
      </div>
    );
  }

  // Fallback for other statuses (pending_review, etc.)
  return null;
}

export default DepositPaymentSection;
