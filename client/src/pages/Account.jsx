import Navbar from '../components/Navbar';

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center">
        <p className="text-[#B8B3AA]">
          Loading account...
        </p>
      </main>
    );
  }

  if (!customer) {
    return null;
  }
return (
  <>
    <Navbar />

    <main className="min-h-screen bg-[#0B0B0B] text-white px-6 pt-32 pb-16">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="text-sm tracking-[0.3em] uppercase text-[#B8B3AA]">
              Your Account
            </p>

            <h1 className="mt-3 text-4xl md:text-5xl font-serif">
              Welcome, {customer.name}.
            </h1>

            <p className="mt-3 text-[#B8B3AA]">
              {customer.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="self-start sm:self-auto border border-white/15 px-5 py-2.5 rounded-lg text-sm hover:bg-white/5 transition"
          >
            Log out
          </button>
        </div>

        {/* Bookings */}
        <section className="mt-16">

          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-[#6F8499]">
              Your Work
            </p>

            <h2 className="mt-2 text-3xl font-serif">
              My Bookings
            </h2>
          </div>

          {loadingBookings && (
            <p className="mt-8 text-[#B8B3AA]">
              Loading your bookings...
            </p>
          )}

          {error && (
            <div className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300">
              {error}
            </div>
          )}

          {!loadingBookings &&
            !error &&
            bookings.length === 0 && (
              <div className="mt-8 rounded-2xl border border-white/10 bg-[#111111] p-8">
                <h3 className="text-xl font-serif">
                  No bookings yet.
                </h3>

                <p className="mt-2 text-[#B8B3AA]">
                  Ready to create something?
                </p>

                <button
                  onClick={() => navigate('/commission')}
                  className="mt-6 bg-white text-black px-5 py-3 rounded-lg font-semibold hover:bg-[#D8D4CC] transition"
                >
                  Start a Commission
                </button>
              </div>
            )}

          {!loadingBookings &&
            !error &&
            bookings.length > 0 && (
              <div className="mt-8 space-y-4">

                {bookings.map((booking) => (
                  <div
                    key={booking.bookingId}
                    className="rounded-2xl border border-white/10 bg-[#111111] p-6"
                  >

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                      <div>
                        <p className="text-xs tracking-[0.2em] uppercase text-[#B8B3AA]">
                          Booking
                        </p>

                        <h3 className="mt-1 text-xl font-serif">
                          {booking.bookingId}
                        </h3>
                      </div>

                      <span className="self-start rounded-full border border-[#6F8499]/30 bg-[#6F8499]/10 px-4 py-1.5 text-sm capitalize text-[#AFC0CF]">
                        {booking.status?.replaceAll('_', ' ')}
                      </span>

                    </div>

                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-5 text-sm">

                      <div>
                        <p className="text-[#B8B3AA]">
                          Artwork
                        </p>

                        <p className="mt-1 capitalize">
                          {booking.artworkType}
                        </p>
                      </div>

                      <div>
                        <p className="text-[#B8B3AA]">
                          Size
                        </p>

                        <p className="mt-1">
                          {booking.size}
                        </p>
                      </div>

                      <div>
                        <p className="text-[#B8B3AA]">
                          People
                        </p>

                        <p className="mt-1">
                          {booking.numberOfPeople}
                        </p>
                      </div>

                      <div>
                        <p className="text-[#B8B3AA]">
                          Price
                        </p>

                        <p className="mt-1">
                          {booking.totalPrice !== null &&
                          booking.totalPrice !== undefined
                            ? `₹${booking.totalPrice}`
                            : 'To be confirmed'}
                        </p>
                      </div>

                    </div>

                  </div>
                ))}

              </div>
            )}

        </section>

        {/* Account details */}
        <section className="mt-16 border-t border-white/10 pt-10">

          <p className="text-xs tracking-[0.25em] uppercase text-[#6F8499]">
            Account
          </p>

          <h2 className="mt-2 text-3xl font-serif">
            Account Details
          </h2>

          <div className="mt-6 rounded-2xl border border-white/10 bg-[#111111] p-6 space-y-5">

            <div>
              <p className="text-sm text-[#B8B3AA]">
                Name
              </p>

              <p className="mt-1">
                {customer.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#B8B3AA]">
                Email
              </p>

              <p className="mt-1">
                {customer.email}
              </p>
            </div>

          </div>

        </section>

      </div>
        </main>
  </>
);
}

export default Account;