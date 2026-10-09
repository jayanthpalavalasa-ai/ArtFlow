import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000';

function ArtistBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('artistToken');

        const response = await fetch(
          `${API_URL}/api/bookings`,
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
        console.error('Failed to load artist bookings:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-paper-mute">
          Loading bookings...
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
      </div>
    );
  }

  return (
    <div className="p-8">

      {/* Header */}
      <div>
        <p className="kicker">
          Artist Studio
        </p>

        <h1 className="page-title mt-3">
          Bookings
        </h1>

        <p className="lede mt-4">
          Manage your commissions and artwork workflow.
        </p>
      </div>

      {/* Booking count */}
      <div className="mt-8">
        <p className="text-sm text-paper-mute">
          {bookings.length} total booking
          {bookings.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Booking list */}
      <div className="mt-6 space-y-3">

        {bookings.map((booking) => (
      <Link
  key={booking.bookingId}
  to={`/artist/bookings/${booking.bookingId}`}
  className="block border border-paper/10 rounded-xl p-5 hover:border-paper/30 transition-colors"
>
            <div className="flex items-center justify-between gap-6">

              <div className="min-w-0">

                <p className="font-medium">
                  {booking.bookingId}
                </p>

                <p className="text-sm text-paper-mute mt-1">
                  {booking.customerName}
                </p>

                <p className="text-sm text-paper-mute mt-1">
                  {booking.artworkType} · {booking.size} ·{' '}
                  {booking.numberOfPeople}{' '}
                  {booking.numberOfPeople === 1
                    ? 'person'
                    : 'people'}
                </p>

              </div>

              <div className="text-right shrink-0">

                <p className="text-sm">
                  {booking.status}
                </p>

                {booking.totalPrice !== null &&
                  booking.totalPrice !== undefined && (
                    <p className="text-sm text-paper-mute mt-1">
                      ₹{booking.totalPrice}
                    </p>
                  )}

              </div>

            </div>
          </Link>
        ))}

        {bookings.length === 0 && (
          <div className="border border-paper/10 rounded-xl p-6">
            <p className="text-paper-mute">
              No bookings yet.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}

export default ArtistBookings;