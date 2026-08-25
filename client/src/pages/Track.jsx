import { useState } from 'react';

function Track() {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [trackingId, setTrackingId] = useState('');
  const [trackingError, setTrackingError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchBooking = async (bookingId) => {
    setIsLoading(true);
    setTrackingError('');
    setBookingDetails(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}`
      );

      const result = await response.json();

      if (response.ok) {
        setBookingDetails(result);
      } else {
        setTrackingError(
          result.error || 'Booking not found.'
        );
      }
    } catch (error) {
      setTrackingError(
        'Unable to connect to the server. Please try again.'
      );

      console.error('Error fetching booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrackBooking = async (e) => {
    e.preventDefault();

    const id = trackingId.trim();

    if (!id) {
      setTrackingError('Please enter your booking ID.');
      return;
    }

    fetchBooking(id);
  };

  const getStatusLabel = (status) => {
    if (!status) return 'Pending';

    return status
      .replaceAll('_', ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  return (
    <main className="page-shell">

      <div className="max-w-3xl mx-auto">

        <header className="max-w-2xl">

          <p className="kicker">
            Track Your Artwork
          </p>

          <h1 className="page-title mt-4">
            Follow the journey
            <br className="hidden sm:block" />
            of your artwork.
          </h1>

          <p className="lede mt-5">
            Enter your booking ID to see the latest status of your
            commission and its current progress.
          </p>

        </header>


        <section className="panel mt-12 p-5 sm:p-7">

          <div className="mb-5">

            <p className="kicker">
              Booking ID
            </p>

            <h2 className="font-display mt-2 text-xl">
              Find your commission
            </h2>

          </div>

          <form
            onSubmit={handleTrackBooking}
            className="flex flex-col sm:flex-row gap-3"
          >

            <input
              type="text"
              placeholder="e.g. AF-2026-0001"
              value={trackingId}
              onChange={(e) => {
                setTrackingId(e.target.value);
                setTrackingError('');
              }}
              className="field min-w-0 flex-1"
              aria-label="Booking ID"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="btn-solid sm:whitespace-nowrap"
            >
              {isLoading ? 'Searching...' : 'Track Booking'}
            </button>

          </form>

          <p className="mt-4 text-xs text-mist">
            Your booking ID was provided when your commission was submitted.
          </p>

        </section>


        {trackingError && (
          <section className="notice-error mt-6">

            <p className="text-sm">
              {trackingError}
            </p>

          </section>
        )}


        {bookingDetails && (
          <section className="mt-10">

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

              <div>

                <p className="kicker">
                  Commission
                </p>

                <h2 className="section-title mt-2">
                  {bookingDetails.bookingId}
                </h2>

              </div>

              <div className="self-start sm:self-auto">

                <span className="chip">
                  {getStatusLabel(bookingDetails.status)}
                </span>

              </div>

            </div>


            <div className="panel mt-6 overflow-hidden">

              <div className="p-5 sm:p-7">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">

                  <div>
                    <p className="kicker">
                      Customer
                    </p>

                    <p className="mt-2 text-sm text-paper">
                      {bookingDetails.customerName || 'Guest'}
                    </p>
                  </div>


                  <div>
                    <p className="kicker">
                      Artwork
                    </p>

                    <p className="mt-2 text-sm capitalize text-paper">
                      {bookingDetails.artworkType || 'â€”'}
                    </p>
                  </div>


                  <div>
                    <p className="kicker">
                      Size
                    </p>

                    <p className="mt-2 text-sm text-paper">
                      {bookingDetails.size || 'â€”'}
                    </p>
                  </div>


                  <div>
                    <p className="kicker">
                      People
                    </p>

                    <p className="mt-2 text-sm text-paper">
                      {bookingDetails.numberOfPeople || 'â€”'}
                    </p>
                  </div>


                  <div>
                    <p className="kicker">
                      Total Price
                    </p>

                   <p className="mt-2 text-sm text-paper">
  {bookingDetails.totalPrice !== null &&
  bookingDetails.totalPrice !== undefined
    ? `\u20B9${bookingDetails.totalPrice}`
    : 'To be confirmed'}
</p>
                  </div>


                  {bookingDetails.preferredDeadline && (
                    <div>
                      <p className="kicker">
                        Preferred Deadline
                      </p>

                      <p className="mt-2 text-sm text-paper">
                        {bookingDetails.preferredDeadline}
                      </p>
                    </div>
                  )}

                </div>

              </div>


              <div className="border-t border-line px-5 sm:px-7 py-5">

                <p className="kicker">
                  Current Status
                </p>

                <p className="mt-2 text-base text-accent">
                  {getStatusLabel(bookingDetails.status)}
                </p>

              </div>

            </div>

          </section>
        )}


        {!bookingDetails &&
          !trackingError &&
          !isLoading && (
            <div className="mt-12 border-t border-line pt-8">

              <p className="text-sm leading-6 text-mist">
                Enter your booking ID above to view your commission details.
              </p>

            </div>
          )}

      </div>

    </main>
  );
}

export default Track;
