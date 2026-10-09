import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const API_URL = 'http://localhost:5000';

function ArtistBookingDetails() {
  const { bookingId } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [reviewNote, setReviewNote] = useState('');
  const [completedArtwork, setCompletedArtwork] = useState(null);
const [completionMessage, setCompletionMessage] = useState('');
const [completionError, setCompletionError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem('artistToken');

        const response = await fetch(
          `${API_URL}/api/bookings/artist/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || 'Failed to load booking.'
          );
        }

        setBooking(data);
      } catch (err) {
        console.error(
          'Failed to load artist booking:',
          err
        );

        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleAcceptReference = async () => {
  setActionError('');
  setActionLoading(true);

  try {
    const token = localStorage.getItem('artistToken');

    const response = await fetch(
      `${API_URL}/api/bookings/${bookingId}/accept-image`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || 'Failed to accept reference.'
      );
    }

    setBooking(data.booking);
  } catch (err) {
    console.error('Accept reference error:', err);
    setActionError(err.message);
  } finally {
    setActionLoading(false);
  }
};

const handleRejectReference = async () => {
  if (!reviewNote.trim()) {
    setActionError(
      'Please provide a reason for requesting changes.'
    );
    return;
  }

  setActionError('');
  setActionLoading(true);

  try {
    const token = localStorage.getItem('artistToken');

    const response = await fetch(
      `${API_URL}/api/bookings/${bookingId}/reject-image`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reviewNote: reviewNote.trim(),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || 'Failed to request changes.'
      );
    }

    setBooking(data.booking);
    setReviewNote('');
  } catch (err) {
    console.error('Reject reference error:', err);
    setActionError(err.message);
  } finally {
    setActionLoading(false);
  }
};

const handleConfirmDeposit = async () => {
  setActionError('');
  setActionLoading(true);

  try {
    const token = localStorage.getItem('artistToken');

    const response = await fetch(
      `${API_URL}/api/bookings/${bookingId}/confirm-deposit`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || 'Failed to confirm deposit.'
      );
    }

    setBooking(data.booking);
  } catch (err) {
    console.error('Confirm deposit error:', err);
    setActionError(err.message);
  } finally {
    setActionLoading(false);
  }
};

const handleConfirmFinalPayment = async () => {
  setActionError('');
  setActionLoading(true);

  try {
    const token = localStorage.getItem('artistToken');

    const response = await fetch(
      `${API_URL}/api/bookings/${bookingId}/confirm-final-payment`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || 'Failed to confirm final payment.'
      );
    }

    setBooking(data.booking);
  } catch (err) {
    console.error('Confirm final payment error:', err);
    setActionError(err.message);
  } finally {
    setActionLoading(false);
  }
};

const handleCompleteArtwork = async () => {
  setCompletionMessage('');
  setCompletionError('');

  if (!completedArtwork) {
    setCompletionError('Please select a photo of the completed artwork.');
    return;
  }

  try {
    setActionLoading(true);

    const token = localStorage.getItem('artistToken');

    const formData = new FormData();
    formData.append('completedArtwork', completedArtwork);

    const response = await fetch(
      `${API_URL}/api/bookings/${bookingId}/complete`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || 'Failed to upload completed artwork.'
      );
    }

    setBooking(data.booking);
    setCompletedArtwork(null);
    setCompletionMessage('Artwork marked as completed successfully.');
  } catch (err) {
    console.error('Complete artwork error:', err);
    setCompletionError(err.message);
  } finally {
    setActionLoading(false);
  }
};

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-paper-mute">
          Loading booking...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="notice-error">
          {error}
        </div>

        <Link
          to="/artist/bookings"
          className="inline-block mt-6 text-accent"
        >
          ← Back to bookings
        </Link>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  const formatDate = (date) => {
    if (!date) return 'Not specified';

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    );
  };

  const formatDateTime = (date) => {
    if (!date) return 'Not available';

    return new Date(date).toLocaleString(
      'en-IN',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }
    );
  };

  return (
    <div className="p-8 max-w-6xl">

      {/* Header */}
      <div>
        <Link
          to="/artist/bookings"
          className="text-sm text-paper-mute hover:text-paper transition-colors"
        >
          ← Back to bookings
        </Link>

        <div className="mt-6">

          <p className="kicker">
            Booking
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-3">

            <h1 className="page-title">
              {booking.bookingId}
            </h1>

            <span className="px-3 py-1 rounded-full border border-paper/10 text-sm">
              {booking.status}
            </span>

          </div>

        </div>
      </div>

      {/* Dates */}
      <section className="mt-10">
        <p className="kicker">
          Schedule
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

          <div className="border border-paper/10 rounded-xl p-5">
            <p className="text-sm text-paper-mute">
              Booking date
            </p>

            <p className="mt-2">
              {formatDateTime(booking.createdAt)}
            </p>
          </div>

          <div className="border border-paper/10 rounded-xl p-5">
            <p className="text-sm text-paper-mute">
              Preferred deadline
            </p>

            <p className="mt-2">
              {formatDate(booking.preferredDeadline)}
            </p>
          </div>

        </div>
      </section>

      {/* Customer */}
      <section className="mt-10">
        <p className="kicker">
          Customer
        </p>

        <div className="border border-paper/10 rounded-xl p-6 mt-4 space-y-4">

          <div>
            <p className="text-sm text-paper-mute">
              Name
            </p>

            <p className="mt-1">
              {booking.customerName}
            </p>
          </div>

          <div>
            <p className="text-sm text-paper-mute">
              Email
            </p>

           <p className="mt-1 break-all">
  {booking.customerEmail || 'Not provided'}
</p>
          </div>

          <div>
            <p className="text-sm text-paper-mute">
              Phone
            </p>

            <p className="mt-1">
              {booking.customerPhone}
            </p>
          </div>

        </div>
      </section>

      {/* Artwork */}
      <section className="mt-10">
        <p className="kicker">
          Artwork
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

          <div className="border border-paper/10 rounded-xl p-5">
            <p className="text-sm text-paper-mute">
              Type
            </p>

            <p className="mt-2 capitalize">
              {booking.artworkType}
            </p>
          </div>

          <div className="border border-paper/10 rounded-xl p-5">
            <p className="text-sm text-paper-mute">
              Size
            </p>

            <p className="mt-2">
              {booking.size}
            </p>
          </div>

          <div className="border border-paper/10 rounded-xl p-5">
            <p className="text-sm text-paper-mute">
              People
            </p>

            <p className="mt-2">
              {booking.numberOfPeople}
            </p>
          </div>

        </div>

        {booking.description && (
          <div className="border border-paper/10 rounded-xl p-6 mt-4">

            <p className="text-sm text-paper-mute">
              Description
            </p>

            <p className="mt-2 whitespace-pre-wrap">
              {booking.description}
            </p>

          </div>
        )}

        {booking.artistNote && (
          <div className="border border-paper/10 rounded-xl p-6 mt-4">

            <p className="text-sm text-paper-mute">
              Artist Note
            </p>

            <p className="mt-2 whitespace-pre-wrap">
              {booking.artistNote}
            </p>

          </div>
        )}
      </section>

      {/* Reference images */}
      <section className="mt-10">
        <p className="kicker">
          Reference Images
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">

          {booking.images?.map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              className="border border-paper/10 rounded-xl overflow-hidden"
            >

              <img
                src={image.url}
                alt={`Reference ${index + 1}`}
                className="w-full aspect-square object-cover"
              />

              <div className="p-4">

                <p className="text-sm capitalize">
                  {image.reviewStatus}
                </p>

                {image.reviewNote && (
                  <p className="text-sm text-paper-mute mt-2">
                    {image.reviewNote}
                  </p>
                )}

              </div>

            </div>
          ))}

        </div>
      </section>

      {booking.status === 'pending_review' && (
  <section className="mt-10">

    <p className="kicker">
      Reference Review
    </p>

    <div className="border border-paper/10 rounded-xl p-6 mt-4">

      <p className="text-paper-mute text-sm">
        Review the latest reference image before accepting the
        commission.
      </p>

      {actionError && (
        <div className="notice-error mt-5">
          {actionError}
        </div>
      )}

      <div className="mt-6">

        <button
          type="button"
          onClick={handleAcceptReference}
          disabled={actionLoading}
          className="btn-solid"
        >
          {actionLoading
            ? 'Processing...'
            : 'Accept Reference'}
        </button>

      </div>

      <div className="mt-8 pt-6 border-t border-paper/10">

        <label className="label">
          Request changes
        </label>

        <textarea
          value={reviewNote}
          onChange={(e) => setReviewNote(e.target.value)}
          rows={4}
          className="field mt-2"
          placeholder="Explain what needs to be changed in the reference..."
        />

        <button
          type="button"
          onClick={handleRejectReference}
          disabled={actionLoading}
          className="btn-outline mt-4"
        >
          {actionLoading
            ? 'Processing...'
            : 'Request Changes'}
        </button>

      </div>

    </div>

  </section>
)}

          {/* Payment */}
      <section className="mt-10">
        <p className="kicker">
          Payment
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

          {/* Total */}
          <div className="border border-paper/10 rounded-xl p-6">

            <p className="text-sm text-paper-mute">
              Total
            </p>

            <p className="text-2xl mt-2">
              {booking.totalPrice !== null &&
              booking.totalPrice !== undefined
                ? `₹${booking.totalPrice}`
                : 'Price consultation'}
            </p>

          </div>

          {/* Deposit */}
          <div className="border border-paper/10 rounded-xl p-6">

            <p className="text-sm text-paper-mute">
              Deposit
            </p>

            <p className="mt-2">
              {booking.payment?.depositPaid
                ? `₹${booking.payment.depositAmount} deposit confirmed`
                : booking.payment?.depositScreenshotUrl
                  ? `Customer paid ₹${booking.payment.depositAmount} as the deposit`
                  : 'Not paid'}
            </p>

            {/* Payment submission status */}
            {booking.payment?.depositScreenshotUrl && (
              <p className="mt-2 text-sm text-paper-mute">
                Payment screenshot submitted — awaiting your confirmation.
              </p>
            )}

            {/* Payment submission date and time */}
            {booking.payment?.depositSubmittedAt && (
              <p className="mt-2 text-sm text-paper-mute">
                Submitted on{' '}
                {new Date(
                  booking.payment.depositSubmittedAt
                ).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            )}

            {/* Payment screenshot */}
            {booking.payment?.depositScreenshotUrl && (
              <div className="mt-6 border-t border-paper/10 pt-6">

                <p className="text-sm text-paper-mute">
                  Payment Screenshot
                </p>

                <div className="mt-4 overflow-hidden rounded-lg border border-paper/10">
                  <img
                    src={booking.payment.depositScreenshotUrl}
                    alt="Customer deposit payment screenshot"
                    className="w-full max-h-[600px] object-contain bg-black"
                  />
                </div>

              </div>
            )}

            {/* Confirm deposit */}
            {booking.payment?.depositScreenshotUrl &&
              !booking.payment?.depositPaid && (
                <div className="mt-6 border-t border-paper/10 pt-6">

                  <p className="text-sm text-paper-mute">
                    Payment verification
                  </p>

                  <p className="mt-2 text-sm leading-6 text-paper-mute">
                    Verify that the payment screenshot shows the correct
                    deposit payment before confirming.
                  </p>

                  <button
                    type="button"
                    onClick={handleConfirmDeposit}
                    disabled={actionLoading}
                    className="btn-solid mt-4"
                  >
                    {actionLoading
                      ? 'Confirming...'
                      : 'Confirm Deposit'}
                  </button>

                </div>
              )}

            {/* Payment confirmation date and time */}
            {booking.payment?.depositConfirmedAt && (
              <p className="mt-4 text-sm text-paper-mute">
                Confirmed on{' '}
                {new Date(
                  booking.payment.depositConfirmedAt
                ).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            )}

          </div>

          {/* Final Payment */}
          <div className="border border-paper/10 rounded-xl p-6">

  <p className="text-sm text-paper-mute">
    Final payment
  </p>

  <p className="mt-2">
    {booking.payment?.finalPaid
      ? 'Confirmed'
      : booking.payment?.finalScreenshotUrl
        ? 'Submitted — awaiting confirmation'
        : 'Not paid'}
  </p>

  {/* Final Payment Submission Date */}
  {booking.payment?.finalSubmittedAt && (
    <p className="mt-2 text-sm text-paper-mute">
      Submitted on{' '}
      {new Date(
        booking.payment.finalSubmittedAt
      ).toLocaleString('en-IN')}
    </p>
  )}

  {/* Final Payment Screenshot */}
 {booking.payment?.finalScreenshotUrl && (
  <div className="mt-6 border-t border-paper/10 pt-5">

    <p className="text-sm text-paper-mute">
      Final Payment Screenshot
    </p>

    <div className="mt-4 overflow-hidden rounded-lg border border-paper/10 bg-black">
      <a
        href={booking.payment.finalScreenshotUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={booking.payment.finalScreenshotUrl}
          alt="Customer's final payment screenshot"
          className="max-h-[500px] w-full object-contain"
        />
      </a>
    </div>

    <p className="mt-3 text-xs text-paper-mute">
      Click the image to view it in full size.
    </p>

    {/* Confirm Final Payment Button */}
    {!booking.payment?.finalPaid && (
      <button
        type="button"
        onClick={handleConfirmFinalPayment}
        disabled={actionLoading}
        className="mt-6 rounded-lg bg-paper px-5 py-3 text-sm font-medium text-ink transition hover:opacity-90 disabled:opacity-50"
      >
        {actionLoading
          ? 'Confirming Payment...'
          : 'Confirm Final Payment'}
      </button>
    )}

  </div>
)}

</div>

        </div>
      </section>

      {/* Delivery */}
      {booking.deliveryAddress && (
        <section className="mt-10">

          <p className="kicker">
            Delivery
          </p>

          <div className="border border-paper/10 rounded-xl p-6 mt-4">

            <p>
              {booking.deliveryAddress.addressLine}
            </p>

            <p className="text-paper-mute mt-1">
              {booking.deliveryAddress.city},{' '}
              {booking.deliveryAddress.state}{' '}
              {booking.deliveryAddress.pincode}
            </p>

          </div>

        </section>
      )}

              {/* Complete Artwork */}
      {booking.status === 'in_progress' && (
        <section className="mt-10">
          <p className="kicker">
            Complete Artwork
          </p>

          <div className="border border-paper/10 rounded-xl p-6 mt-4">
            <p className="text-sm text-paper-mute">
              Upload a photo of the finished artwork to complete this booking.
            </p>

            {/* Artwork image selector */}
            <label
              htmlFor="completed-artwork"
              className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-paper/20 px-6 py-10 text-center transition hover:border-paper/50"
            >
              <span className="text-sm">
                {completedArtwork
                  ? completedArtwork.name
                  : 'Choose completed artwork photo'}
              </span>

              <span className="mt-2 text-xs text-paper-mute">
                Select an image of the finished artwork
              </span>

              <span className="mt-4 rounded-md border border-paper/10 px-4 py-2 text-xs text-paper-mute">
                Browse files
              </span>

              <input
                id="completed-artwork"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setCompletedArtwork(e.target.files[0] || null);
                  setCompletionMessage('');
                  setCompletionError('');
                }}
                className="hidden"
              />
            </label>

            {/* Selected image preview */}
            {completedArtwork && (
              <div className="mt-5">
                <p className="text-sm text-paper-mute mb-3">
                  Selected image
                </p>

                <img
                  src={URL.createObjectURL(completedArtwork)}
                  alt="Selected completed artwork preview"
                  className="w-full max-w-xl max-h-[600px] rounded-lg object-contain bg-black"
                />
              </div>
            )}

            {/* Upload button */}
            <button
              type="button"
              onClick={handleCompleteArtwork}
              disabled={actionLoading}
              className="btn-solid mt-5"
            >
              {actionLoading
                ? 'Uploading artwork...'
                : 'Upload & Complete Booking'}
            </button>

            {/* Success message */}
            {completionMessage && (
              <p className="mt-4 text-sm text-green-400">
                {completionMessage}
              </p>
            )}

            {/* Error message */}
            {completionError && (
              <div className="notice-error mt-4">
                {completionError}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Completed artwork */}
      {booking.completedArtworkUrl && (
        <section className="mt-10">

          <p className="kicker">
            Completed Artwork
          </p>

          <div className="mt-4 max-w-xl">

            <img
              src={booking.completedArtworkUrl}
              alt="Completed artwork"
              className="w-full rounded-xl"
            />

          </div>

        </section>
      )}

    </div>
  );
}

export default ArtistBookingDetails;