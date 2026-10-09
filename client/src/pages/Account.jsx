import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000';

function Account() {
  const { customer, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [error, setError] = useState('');
  const [claimBookingId, setClaimBookingId] = useState('');

  const [phone, setPhone] = useState('');
const [phoneSaving, setPhoneSaving] = useState(false);
const [phoneMessage, setPhoneMessage] = useState('');
const [phoneError, setPhoneError] = useState('');

const [claimLoading, setClaimLoading] = useState(false);
const [claimMessage, setClaimMessage] = useState('');
const [claimError, setClaimError] = useState('');



  useEffect(() => {
    if (authLoading) return;

    if (!customer) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('customerToken');

        const response = await fetch(
          `${API_URL}/api/customers/me/bookings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || 'Failed to load bookings.'
          );
        }

        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [customer, authLoading, navigate]);

  useEffect(() => {
  if (customer) {
    setPhone(customer.phone || '');
  }
}, [customer]);

  const handleClaimBooking = async (e) => {
  e.preventDefault();

  setClaimMessage('');
  setClaimError('');

  if (!claimBookingId.trim()) {
    setClaimError('Please enter your booking ID.');
    return;
  }

  try {
    setClaimLoading(true);

    const token = localStorage.getItem('customerToken');

    const response = await fetch(
      `${API_URL}/api/customers/me/claim-booking`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId: claimBookingId.trim(),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || 'Could not add this booking.'
      );
    }

    setClaimMessage(
      'Booking added to your account successfully.'
    );

    setClaimBookingId('');

    // Refresh My Bookings
    const bookingsResponse = await fetch(
      `${API_URL}/api/customers/me/bookings`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const bookingsData = await bookingsResponse.json();

    if (bookingsResponse.ok) {
      setBookings(bookingsData);
    }

  } catch (err) {
    setClaimError(err.message);
  } finally {
    setClaimLoading(false);
  }
};


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (authLoading) {
    return (
      <main className="page-shell flex items-center justify-center">
        <p className="text-paper-mute">
          Loading account...
        </p>
      </main>
    );
  }

  if (!customer) {
    return null;
  }


  const handleSavePhone = async () => {
  setPhoneMessage('');
  setPhoneError('');

  if (!/^[6-9][0-9]{9}$/.test(phone)) {
    setPhoneError('Phone number must be exactly 10 digits.');
    return;
  }

  try {
    setPhoneSaving(true);

    const token = localStorage.getItem('customerToken');

    const response = await fetch(`${API_URL}/api/customers/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        phone,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update phone number.');
    }

    setPhoneMessage('Phone number updated successfully.');
  } catch (err) {
    setPhoneError(err.message);
  } finally {
    setPhoneSaving(false);
  }
};


  return (
    <main className="page-shell">
      <div className="max-w-5xl mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="kicker">
              Your Account
            </p>

            <h1 className="page-title mt-3">
              Welcome, {customer.name}.
            </h1>

            <p className="mt-3 text-sm text-paper-mute">
              {customer.email}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="btn self-start sm:self-auto"
          >
            Log out
          </button>
        </div>

        <section className="mt-16">

          <div>
            <p className="kicker">
              Your Work
            </p>

            <h2 className="section-title mt-2">
              My Bookings
            </h2>
          </div>

          {loadingBookings && (
            <p className="mt-8 text-paper-mute">
              Loading your bookings...
            </p>
          )}

          {error && (
            <div className="notice-error mt-8">
              {error}
            </div>
          )}

          {!loadingBookings &&
            !error &&
            bookings.length === 0 && (
              <div className="panel mt-8 p-7">
                <h3 className="font-display text-xl">
                  No bookings yet.
                </h3>

                <p className="mt-2 text-paper-mute">
                  Ready to create something?
                </p>

                <button
                  type="button"
                  onClick={() => navigate('/commission')}
                  className="btn-solid mt-6"
                >
                  Start a Commission
                </button>
              </div>
            )}

          {!loadingBookings &&
            !error &&
            bookings.length > 0 && (
              <div className="mt-8 space-y-3">

                {bookings.map((booking) => (
                  <div
                  key={booking.bookingId}
                  onClick={() =>
                  navigate(`/account/bookings/${booking.bookingId}`)
                }
                  className="panel cursor-pointer p-5 sm:p-6 transition hover:border-paper-mute"
>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                      <div>
                        <p className="kicker">
                          Booking
                        </p>

                        <h3 className="font-display mt-1 text-lg">
                          {booking.bookingId}
                        </h3>
                      </div>

                      <span className="chip self-start capitalize">
                        {booking.status?.replaceAll('_', ' ')}
                      </span>

                    </div>

                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-5 text-sm">

                      <div>
                        <p className="text-paper-mute">
                          Artwork
                        </p>

                        <p className="mt-1 capitalize">
                          {booking.artworkType}
                        </p>
                      </div>

                      <div>
                        <p className="text-paper-mute">
                          Size
                        </p>

                        <p className="mt-1">
                          {booking.size}
                        </p>
                      </div>

                      <div>
                        <p className="text-paper-mute">
                          People
                        </p>

                        <p className="mt-1">
                          {booking.numberOfPeople}
                        </p>
                      </div>

                      <div>
                        <p className="text-paper-mute">
                          Price
                        </p>

                        <p className="mt-1">
                          {booking.totalPrice !== null &&
                          booking.totalPrice !== undefined
                            ?`\u20B9${booking.totalPrice}`
                            : 'To be confirmed'}
                        </p>
                      </div>

                    </div>

                  </div>
                ))}

              </div>
            )}

        </section>

        <section className="mt-16 border-t border-line pt-10">

          <p className="kicker">
            Previous Booking
          </p>

          <h2 className="section-title mt-2">
            Add an earlier booking
          </h2>

          <p className="lede mt-3">
            If you placed a commission before creating your account,
            you can add that booking to your account using its booking ID.
          </p>

          <form
            onSubmit={handleClaimBooking}
            className="panel mt-6 p-5 sm:p-6"
          >

            <label
              htmlFor="claimBookingId"
              className="label"
            >
              Booking ID
            </label>

            <div className="flex flex-col sm:flex-row gap-3">

              <input
                id="claimBookingId"
                type="text"
                value={claimBookingId}
                onChange={(e) => setClaimBookingId(e.target.value)}
                placeholder="AF-2026-0004"
                className="field flex-1"
              />

              <button
                type="submit"
                disabled={claimLoading}
                className="btn-solid sm:whitespace-nowrap"
              >
                {claimLoading
                  ? 'Adding...'
                  : 'Add to My Account'}
              </button>

            </div>

            {claimMessage && (
              <p className="mt-4 text-sm text-paper-mute">
                {claimMessage}
              </p>
            )}

            {claimError && (
              <p className="mt-4 text-sm text-mark">
                {claimError}
              </p>
            )}

          </form>

        </section>

        <section className="mt-16 border-t border-line pt-10">

  <p className="kicker">
    Account
  </p>

  <h2 className="section-title mt-2">
    Account Details
  </h2>

  <div className="panel mt-6 p-5 sm:p-6 space-y-5">

    <div>
      <p className="text-sm text-paper-mute">
        Name
      </p>

      <p className="mt-1">
        {customer.name}
      </p>
    </div>

    <div>
      <p className="text-sm text-paper-mute">
        Email
      </p>

      <p className="mt-1">
        {customer.email}
      </p>
    </div>

    <div>
      <label
        htmlFor="account-phone"
        className="text-sm text-paper-mute"
      >
        Phone Number
      </label>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id="account-phone"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value.replace(/\D/g, ''));
            setPhoneMessage('');
            setPhoneError('');
          }}
          placeholder="10-digit mobile number"
          className="w-full rounded-lg border border-line bg-transparent px-4 py-2.5 text-sm outline-none"
        />

        <button
         type="button"
         disabled={phoneSaving}
         onClick={handleSavePhone}
          className="rounded-lg bg-paper px-5 py-2.5 text-sm font-medium text-ink disabled:opacity-50"
        >
          {phoneSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {phoneMessage && (
        <p className="mt-2 text-sm text-green-400">
          {phoneMessage}
        </p>
      )}

      {phoneError && (
        <p className="mt-2 text-sm text-red-400">
          {phoneError}
        </p>
      )}
    </div>

  </div>

</section>

      </div>
    </main>
  );
}

export default Account;
