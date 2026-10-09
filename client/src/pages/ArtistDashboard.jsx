import { useEffect, useState } from 'react';
import { useArtistAuth } from '../context/ArtistAuthContext';

const API_URL = 'http://localhost:5000';

function ArtistDashboard() {
  const { artist } = useArtistAuth();

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

  const getCount = (status) => {
    return bookings.filter(
      (booking) => booking.status === status
    ).length;
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-paper-mute">
          Loading dashboard...
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

      <div>
        <p className="kicker">
          Artist Dashboard
        </p>

        <h1 className="page-title mt-3">
          Welcome, {artist?.name}.
        </h1>

        <p className="lede mt-4">
          Here's what's happening with your artwork.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">

        <div className="border border-paper/10 rounded-xl p-6">
          <p className="text-sm text-paper-mute">
            Pending Review
          </p>

          <p className="text-3xl mt-2">
            {getCount('pending_review')}
          </p>
        </div>

        <div className="border border-paper/10 rounded-xl p-6">
          <p className="text-sm text-paper-mute">
            In Progress
          </p>

          <p className="text-3xl mt-2">
            {getCount('in_progress')}
          </p>
        </div>

        <div className="border border-paper/10 rounded-xl p-6">
          <p className="text-sm text-paper-mute">
            Completed
          </p>

          <p className="text-3xl mt-2">
            {getCount('completed')}
          </p>
        </div>

      </div>

      <div className="mt-10">

        <div className="flex items-center justify-between">
          <div>
            <p className="kicker">
              Recent Bookings
            </p>

            <h2 className="text-2xl mt-2">
              Latest commissions
            </h2>
          </div>

          <p className="text-sm text-paper-mute">
            {bookings.length} total
          </p>
        </div>

        <div className="mt-6 space-y-3">

          {bookings.slice(0, 5).map((booking) => (
            <div
              key={booking.bookingId}
              className="border border-paper/10 rounded-xl p-5"
            >
              <div className="flex items-center justify-between gap-4">

                <div>
                  <p className="font-medium">
                    {booking.bookingId}
                  </p>

                  <p className="text-sm text-paper-mute mt-1">
                    {booking.customerName} · {booking.artworkType}
                  </p>
                </div>

                <span className="text-sm text-paper-mute">
                  {booking.status}
                </span>

              </div>
            </div>
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

    </div>
  );
}

export default ArtistDashboard;
