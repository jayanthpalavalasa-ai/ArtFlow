import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = 'http://localhost:5000';

function BookingDetails() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const statusLabels = {
  pending_review: 'Pending Review',
  rejected: 'Changes Requested',
  accepted: 'Accepted',
  in_progress: 'In Progress',
  completed: 'Completed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const [booking, setBooking] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [replacementImage, setReplacementImage] = useState(null);
const [uploadingReplacement, setUploadingReplacement] = useState(false);
const [uploadMessage, setUploadMessage] = useState('');
const [uploadError, setUploadError] = useState('');
const [upiCopied, setUpiCopied] = useState(false);
const [depositScreenshot, setDepositScreenshot] = useState(null);
const [depositUploading, setDepositUploading] = useState(false);
const [depositMessage, setDepositMessage] = useState('');
const [depositError, setDepositError] = useState('');
const [finalScreenshot, setFinalScreenshot] = useState(null);
const [finalUploading, setFinalUploading] = useState(false);
const [finalMessage, setFinalMessage] = useState('');
const [finalError, setFinalError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem('customerToken');

        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(
          `${API_URL}/api/customers/me/bookings/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch booking.');
        }

        setBooking(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, navigate]);

    const handleReplacementUpload = async () => {
    setUploadMessage('');
    setUploadError('');

    if (!replacementImage) {
      setUploadError('Please select an image first.');
      return;
    }

    try {
      setUploadingReplacement(true);

      const token = localStorage.getItem('customerToken');

      const formData = new FormData();
      formData.append('image', replacementImage);

      const response = await fetch(
        `${API_URL}/api/bookings/${bookingId}/upload-replacement`,
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
          data.error || 'Failed to upload replacement image.'
        );
      }

    setBooking(data.booking);
setReplacementImage(null);
setUploadMessage('Replacement image uploaded successfully.');
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploadingReplacement(false);
    }
  };

  const handleCopyUpi = async () => {
  try {
    await navigator.clipboard.writeText('9951299112@ybl');
    setUpiCopied(true);

    setTimeout(() => {
      setUpiCopied(false);
    }, 2000);
  } catch (err) {
    setUploadError('Could not copy the UPI ID. Please copy it manually.');
  }
};

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-paper-mute">Loading booking...</p>
      </main>
    );
  }

  const handleDepositPayment = async () => {
  setDepositMessage('');
  setDepositError('');

  if (!depositScreenshot) {
    setDepositError('Please upload your payment screenshot first.');
    return;
  }

  try {
    setDepositUploading(true);

    const token = localStorage.getItem('customerToken');

    const formData = new FormData();
    formData.append('paymentScreenshot', depositScreenshot);

    const response = await fetch(
      `${API_URL}/api/bookings/${bookingId}/deposit-payment`,
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
        data.error || 'Failed to submit deposit payment.'
      );
    }

    setBooking(data.booking);
    setDepositScreenshot(null);
    setDepositMessage(
      'Payment screenshot submitted successfully. Waiting for confirmation.'
    );
  } catch (err) {
    setDepositError(err.message);
  } finally {
    setDepositUploading(false);
  }
};

    const handleFinalPayment = async () => {
  setFinalMessage('');
  setFinalError('');

  if (!finalScreenshot) {
    setFinalError('Please upload your payment screenshot first.');
    return;
  }

  try {
    setFinalUploading(true);

    const token = localStorage.getItem('customerToken');

    const formData = new FormData();
    formData.append('paymentScreenshot', finalScreenshot);

    const response = await fetch(
      `${API_URL}/api/bookings/${bookingId}/final-payment`,
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
        data.error || 'Failed to submit final payment.'
      );
    }

    setBooking(data.booking);
    setFinalScreenshot(null);

    setFinalMessage(
      'Final payment screenshot submitted successfully. Waiting for the artist to verify your payment.'
    );
  } catch (err) {
    setFinalError(err.message);
  } finally {
    setFinalUploading(false);
  }
};

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-red-400">{error}</p>

        <button
          type="button"
          onClick={() => navigate('/account')}
          className="mt-6 rounded-lg bg-paper px-5 py-2.5 text-sm font-medium text-ink"
        >
          Back to Account
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="kicker">Booking</p>

      <h1 className="section-title mt-2">
        Booking Details
      </h1>

      <p className="mt-4 text-paper-mute">
        Booking ID: {booking.bookingId}
      </p>

      <div className="panel mt-8 p-5 sm:p-6">
  <div>
    <p className="text-sm text-paper-mute">Booking Date</p>

    <p className="mt-1">
      {new Date(booking.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}
    </p>
  </div>

  <div className="mt-6">
    <p className="text-sm text-paper-mute">Status</p>

    <p className="mt-1">
  {statusLabels[booking.status] || booking.status}
</p>


  </div>
  

</div>
<div className="panel mt-4 p-5 sm:p-6">
  <p className="text-sm text-paper-mute">Artwork Details</p>

  <div className="mt-5 grid gap-5 sm:grid-cols-3">
    <div>
      <p className="text-sm text-paper-mute">Artwork Type</p>
      <p className="mt-1 capitalize">
        {booking.artworkType} Art
      </p>
    </div>

    <div>
      <p className="text-sm text-paper-mute">Size</p>
      <p className="mt-1">
        {booking.size}
      </p>
    </div>

    <div>
      <p className="text-sm text-paper-mute">People</p>
      <p className="mt-1">
        {booking.numberOfPeople}
      </p>
    </div>
  </div>
</div>



{booking.images && booking.images.length > 0 && (
  <div className="panel mt-4 p-5 sm:p-6">
    <p className="text-sm text-paper-mute">
      Reference Images
    </p>

    <div className="mt-5 space-y-8">
      {booking.images.map((image, index) => (
        <div key={`${image.url}-${index}`}>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-paper">
              Reference {index + 1}
            </p>

            <p className="text-xs text-paper-mute">
              {image.reviewStatus === 'rejected'
                ? 'Changes Requested'
                : image.reviewStatus === 'accepted'
                  ? 'Accepted'
                  : 'Pending Review'}
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border border-line">
            <img
              src={image.url}
              alt={`Reference ${index + 1} for your artwork`}
              className="w-full max-h-[600px] object-contain bg-black"
            />
          </div>

          {image.reviewStatus === 'rejected' && image.reviewNote && (
            <div className="mt-4 rounded-lg border border-red-400/30 p-4">
              <p className="text-sm text-red-300">
                Changes Requested
              </p>

              <p className="mt-2 text-sm leading-6 text-paper-mute">
                {image.reviewNote}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
)}

{booking.status === 'accepted' &&
  !booking.payment?.depositPaid && (
    <div className="panel mt-4 border border-line p-5 sm:p-6">
      <p className="text-sm text-paper-mute">
        Deposit Payment
      </p>

      <h2 className="mt-2 text-xl">
        50% deposit required
      </h2>

      <p className="mt-3 text-sm leading-6 text-paper-mute">
        Your reference image has been accepted. Please pay the
        50% deposit to begin your artwork.
      </p>

      <div className="mt-6">
        <p className="text-sm text-paper-mute">
          Deposit Amount
        </p>

        <p className="mt-1 text-2xl">
          ₹{booking.totalPrice / 2}
        </p>
      </div>

     <div className="mt-6 border-t border-line pt-6">
  <p className="text-sm text-paper-mute">
    Payment Instructions
  </p>

  <p className="mt-3 text-sm leading-6 text-paper-mute">
    Pay the deposit using PhonePe, then upload your payment
    screenshot below.
  </p>

  <div className="mt-6 grid gap-8 md:grid-cols-2 md:items-center">
    <div>
      <p className="text-sm text-paper-mute">
        Scan & Pay
      </p>

      <div className="mt-4 overflow-hidden rounded-lg border border-line bg-white p-4">
        <img
          src="/payment/phonepe-qr.jpeg"
          alt="PhonePe payment QR code"
          className="mx-auto w-full max-w-[280px]"
        />
      </div>
    </div>

    <div>
      <p className="text-sm text-paper-mute">
        UPI ID
      </p>

      <div className="mt-3 flex items-center gap-3 rounded-lg border border-line px-4 py-3">
        <span className="min-w-0 flex-1 truncate text-sm">
          9951299112@ybl
        </span>

        <button
  type="button"
  onClick={handleCopyUpi}
  className="shrink-0 rounded-md border border-line px-3 py-1.5 text-xs text-paper-mute transition hover:text-paper"
>
  {upiCopied ? 'Copied' : 'Copy'}
</button>
      </div>

      <p className="mt-4 text-xs leading-5 text-paper-mute">
        After completing the payment, upload your payment
        screenshot below for verification.
      </p>
    </div>
  </div>
</div>
   

    
  
  <div className="mt-8 border-t border-line pt-6">
  <p className="text-sm text-paper-mute">
    Upload Payment Screenshot
  </p>

  <label
    htmlFor="deposit-screenshot"
    className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-line px-6 py-10 text-center transition hover:border-paper-mute"
  >
    <span className="text-sm text-paper">
      {depositScreenshot
        ? depositScreenshot.name
        : 'Choose your payment screenshot'}
    </span>

    <span className="mt-2 text-xs text-paper-mute">
      Upload the screenshot showing your completed payment
    </span>

    <span className="mt-4 rounded-md border border-line px-4 py-2 text-xs text-paper-mute">
      Browse files
    </span>

    <input
      id="deposit-screenshot"
      type="file"
      accept="image/*"
      onChange={(e) => {
        setDepositScreenshot(e.target.files[0] || null);
        setDepositMessage('');
        setDepositError('');
      }}
      className="hidden"
    />
  </label>

  <button
    type="button"
    disabled={depositUploading}
    onClick={handleDepositPayment}
    className="mt-4 rounded-lg bg-paper px-5 py-2.5 text-sm font-medium text-ink disabled:opacity-50"
  >
    {depositUploading
      ? 'Submitting...'
      : 'Submit Deposit Payment'}
  </button>

  {depositMessage && (
    <p className="mt-3 text-sm text-green-400">
      {depositMessage}
    </p>
  )}
  {depositError && (
    <p className="mt-3 text-sm text-red-400">
      {depositError}
    </p>
  )}
      </div>
    </div>
  )}

{booking.status === 'rejected' &&
  booking.images &&
  booking.images.length > 0 && (
    <div className="panel mt-4 border border-red-400/30 p-5 sm:p-6">
      <p className="text-sm text-red-300">
        Changes Requested
      </p>

      <p className="mt-3 text-sm leading-6 text-paper-mute">
        {booking.images[booking.images.length - 1].reviewNote ||
          'The artist has requested a new reference image.'}
      </p>

      <div className="mt-6 border-t border-line pt-6">
        <p className="text-sm text-paper-mute">
          Upload a new reference image
        </p>
<label
  htmlFor="replacement-image"
  className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-line px-6 py-10 text-center transition hover:border-paper-mute"
>
  <span className="text-sm text-paper">
    {replacementImage
      ? replacementImage.name
      : 'Choose a new reference image'}
  </span>

  <span className="mt-2 text-xs text-paper-mute">
    JPG, PNG or other image files
  </span>

  <span className="mt-4 rounded-md border border-line px-4 py-2 text-xs text-paper-mute">
    Browse files
  </span>

  <input
    id="replacement-image"
    type="file"
    accept="image/*"
    onChange={(e) => {
      setReplacementImage(e.target.files[0] || null);
      setUploadMessage('');
      setUploadError('');
    }}
    className="hidden"
  />
</label>

        <button
          type="button"
          disabled={uploadingReplacement}
          onClick={handleReplacementUpload}
          className="mt-4 rounded-lg bg-paper px-5 py-2.5 text-sm font-medium text-ink disabled:opacity-50"
        >
          {uploadingReplacement
            ? 'Uploading...'
            : 'Upload Replacement'}
        </button>

        {uploadMessage && (
          <p className="mt-3 text-sm text-green-400">
            {uploadMessage}
          </p>
        )}

        {uploadError && (
          <p className="mt-3 text-sm text-red-400">
            {uploadError}
          </p>
        )}
      </div>
    </div>
  )}

    {uploadMessage && booking.status !== 'rejected' && (
  <div className="panel mt-4 border border-green-400/30 p-5 sm:p-6">
    <p className="text-sm text-green-300">
      Reference Submitted
    </p>

    <p className="mt-3 text-sm leading-6 text-paper-mute">
      Your new reference image has been submitted successfully
      and is waiting for the artist's review.
    </p>
  </div>
)}


{['completed', 'shipped', 'delivered'].includes(booking.status) && (
  <div className="panel mt-4 border border-line p-5 sm:p-6">
    <p className="text-sm text-paper-mute">
      Final Payment
    </p>

    <h2 className="mt-2 text-2xl">
      Your artwork is complete!
    </h2>

    <p className="mt-3 text-sm leading-6 text-paper-mute">
  {booking.status === 'delivered'
    ? 'Your artwork has been delivered! Thank you for choosing us.'
    : booking.status === 'shipped'
      ? 'Your artwork is complete, and your final payment has been confirmed. Your artwork is on its way!'
      : 'Your artwork has been completed. Please review the artwork below and pay the remaining balance to proceed with shipping.'}
</p>

    {/* Completed Artwork */}
    {booking.completedArtworkUrl && (
      <div className="mt-6">
        <p className="text-sm text-paper-mute">
          Your Completed Artwork
        </p>

        <div className="mt-3 overflow-hidden rounded-lg border border-line bg-black">
          <img
            src={booking.completedArtworkUrl}
            alt="Your completed commissioned artwork"
            className="mx-auto max-h-[600px] w-full object-contain"
          />
        </div>
      </div>
    )}

    {/* Remaining Balance */}
    <div className="mt-6 rounded-lg border border-line p-4">
      <p className="text-sm text-paper-mute">
        Remaining Balance
      </p>

      <p className="mt-2 text-3xl">
        ₹
        {booking.payment?.finalAmount ??
          (
            (booking.totalPrice ?? 0) -
            (booking.payment?.depositAmount ?? 0)
          )}
      </p>

      <p className="mt-2 text-xs leading-5 text-paper-mute">
        This is the remaining 50% payment for your artwork.
      </p>
    </div>

    {/* Payment Already Submitted */}
    {booking.payment?.finalScreenshotUrl ? (
      <div className="mt-6 rounded-lg border border-green-400/30 p-4">
        <p className="text-sm text-green-300">
          Payment Screenshot Submitted
        </p>

        <p className="mt-2 text-sm leading-6 text-paper-mute">
          Your final payment screenshot has been submitted.
          Please wait while the artist verifies your payment.
        </p>

        <div className="mt-4 overflow-hidden rounded-lg border border-line">
          <img
            src={booking.payment.finalScreenshotUrl}
            alt="Submitted final payment screenshot"
            className="max-h-[400px] w-full object-contain bg-black"
          />
        </div>

        {booking.payment.finalSubmittedAt && (
          <p className="mt-3 text-xs text-paper-mute">
            Submitted on{' '}
            {new Date(
              booking.payment.finalSubmittedAt
            ).toLocaleString('en-IN')}
          </p>
        )}
      </div>
    ) : (
      <>
        {/* Payment Instructions */}
        <div className="mt-6 border-t border-line pt-6">
          <p className="text-sm text-paper-mute">
            Payment Instructions
          </p>

          <p className="mt-3 text-sm leading-6 text-paper-mute">
            Scan the QR code using PhonePe or another UPI app.
            Pay the remaining balance shown above and upload
            your payment screenshot for verification.
          </p>

          <div className="mt-6 grid gap-8 md:grid-cols-2 md:items-center">
            {/* QR Code */}
            <div>
              <p className="text-sm text-paper-mute">
                Scan & Pay
              </p>

              <div className="mt-4 overflow-hidden rounded-lg border border-line bg-white p-4">
                <img
                  src="/payment/phonepe-qr.jpeg"
                  alt="PhonePe payment QR code"
                  className="mx-auto w-full max-w-[280px]"
                />
              </div>
            </div>

            {/* UPI ID */}
            <div>
              <p className="text-sm text-paper-mute">
                UPI ID
              </p>

              <div className="mt-3 flex items-center gap-3 rounded-lg border border-line px-4 py-3">
                <span className="min-w-0 flex-1 truncate text-sm">
                  9951299112@ybl
                </span>

                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="shrink-0 rounded-md border border-line px-3 py-1.5 text-xs text-paper-mute transition hover:text-paper"
                >
                  {upiCopied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <p className="mt-4 text-xs leading-5 text-paper-mute">
                Please verify the amount before completing
                the transaction.
              </p>
            </div>
          </div>
        </div>

        {/* Screenshot Upload */}
        <div className="mt-8 border-t border-line pt-6">
          <p className="text-sm text-paper-mute">
            Upload Final Payment Screenshot
          </p>

          <label
            htmlFor="final-payment-screenshot"
            className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-line px-6 py-10 text-center transition hover:border-paper-mute"
          >
            <span className="text-sm text-paper">
              {finalScreenshot
                ? finalScreenshot.name
                : 'Choose your payment screenshot'}
            </span>

            <span className="mt-2 text-xs text-paper-mute">
              Upload an image showing your completed payment.
            </span>

            <span className="mt-4 rounded-md border border-line px-4 py-2 text-xs text-paper-mute">
              Browse files
            </span>

            <input
              id="final-payment-screenshot"
              type="file"
              accept="image/*"
              onChange={(e) => {
                setFinalScreenshot(
                  e.target.files?.[0] || null
                );
                setFinalMessage('');
                setFinalError('');
              }}
              className="hidden"
            />
          </label>

          <button
            type="button"
            disabled={finalUploading}
            onClick={handleFinalPayment}
            className="mt-4 rounded-lg bg-paper px-5 py-2.5 text-sm font-medium text-ink disabled:opacity-50"
          >
            {finalUploading
              ? 'Submitting...'
              : 'Submit Final Payment'}
          </button>

          {finalMessage && (
            <p className="mt-3 text-sm text-green-400">
              {finalMessage}
            </p>
          )}

          {finalError && (
            <p className="mt-3 text-sm text-red-400">
              {finalError}
            </p>
          )}
        </div>
      </>
    )}
  </div>
)}

  <div className="panel mt-4 p-5 sm:p-6">
  <p className="text-sm text-paper-mute">Payment</p>

  <div className="mt-5 grid gap-5 sm:grid-cols-2">
    <div>
      <p className="text-sm text-paper-mute">Total Price</p>
      <p className="mt-1">
        {booking.requiresPriceConsultation
          ? 'Price to be confirmed'
          : booking.totalPrice
            ? `₹${booking.totalPrice}`
            : 'Not set yet'}
      </p>
    </div>

    <div>
      <p className="text-sm text-paper-mute">Deposit</p>
      <p className="mt-1">
        {booking.payment?.depositAmount
          ? `₹${booking.payment.depositAmount}`
          : 'Not set yet'}
      </p>
    </div>

    <div>
      <p className="text-sm text-paper-mute">Deposit Status</p>
      <p className="mt-1">
        {booking.payment?.depositPaid ? 'Paid' : 'Not Paid'}
      </p>
    </div>

    <div>
      <p className="text-sm text-paper-mute">Final Payment</p>
      <p className="mt-1">
        {booking.payment?.finalAmount
          ? `₹${booking.payment.finalAmount}`
          : 'Not set yet'}
      </p>
    </div>

    <div>
      <p className="text-sm text-paper-mute">Final Payment Status</p>
      <p className="mt-1">
        {booking.payment?.finalPaid ? 'Paid' : 'Not Paid'}
      </p>
    </div>
  </div>
</div>

{booking.preferredDeadline && (
  <div className="panel mt-4 p-5 sm:p-6">
    <p className="text-sm text-paper-mute">Preferred Deadline</p>

    <p className="mt-1">
      {new Date(booking.preferredDeadline).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}
    </p>
  </div>
)}



    </main>
  );
}

export default BookingDetails;