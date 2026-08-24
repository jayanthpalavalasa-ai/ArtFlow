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
    <main className="min-h-screen bg-[#0B0B0B] text-[#F1EEE7] px-5 sm:px-8 lg:px-10 pt-32 pb-20">

      <div className="max-w-3xl mx-auto">

        {/* Page heading */}
        <header className="max-w-2xl">

          <p className="text-xs sm:text-sm tracking-[0.32em] uppercase text-[#8F9BA6]">
            Track Your Artwork
          </p>

          <h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
            Follow the journey
            <br className="hidden sm:block" />
            of your artwork.
          </h1>

          <p className="mt-6 max-w-xl text-sm sm:text-base leading-7 text-[#B8B3AA]">
            Enter your booking ID to see the latest status of your
            commission and its current progress.
          </p>

        </header>


        {/* Tracking form */}
        <section className="mt-12 rounded-2xl border border-white/10 bg-[#111111] p-5 sm:p-7">

          <div className="mb-5">

            <p className="text-xs tracking-[0.25em] uppercase text-[#8F9BA6]">
              Booking ID
            </p>

            <h2 className="mt-2 text-xl sm:text-2xl font-medium">
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
              className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#181818] px-4 py-3.5 text-sm sm:text-base text-[#F1EEE7] placeholder:text-[#686868] outline-none focus:border-[#6F8499] transition"
              aria-label="Booking ID"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-[#F1EEE7] px-6 py-3.5 text-sm font-medium text-[#0B0B0B] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 sm:whitespace-nowrap"
            >
              {isLoading ? 'Searching...' : 'Track Booking'}
            </button>

          </form>

          <p className="mt-4 text-xs sm:text-sm text-[#686868]">
            Your booking ID was provided when your commission was submitted.
          </p>

        </section>


        {/* Error */}
        {trackingError && (
          <section className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4">

            <p className="text-sm text-red-300">
              {trackingError}
            </p>

          </section>
        )}


        {/* Booking details */}
        {bookingDetails && (
          <section className="mt-10">

            {/* Result heading */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

              <div>

                <p className="text-xs tracking-[0.25em] uppercase text-[#8F9BA6]">
                  Commission
                </p>

                <h2 className="mt-2 text-3xl sm:text-4xl font-serif">
                  {bookingDetails.bookingId}
                </h2>

              </div>

              <div className="self-start sm:self-auto">

                <span className="inline-flex rounded-full border border-[#6F8499]/30 bg-[#6F8499]/10 px-4 py-2 text-sm text-[#AFC0CF]">
                  {getStatusLabel(bookingDetails.status)}
                </span>

              </div>

            </div>


            {/* Details card */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-[#111111] overflow-hidden">

              <div className="p-5 sm:p-7">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">

                  {/* Customer */}
                  <div>
                    <p className="text-xs tracking-[0.2em] uppercase text-[#686868]">
                      Customer
                    </p>

                    <p className="mt-2 text-sm sm:text-base text-[#F1EEE7]">
                      {bookingDetails.customerName || 'Guest'}
                    </p>
                  </div>


                  {/* Artwork */}
                  <div>
                    <p className="text-xs tracking-[0.2em] uppercase text-[#686868]">
                      Artwork
                    </p>

                    <p className="mt-2 text-sm sm:text-base capitalize text-[#F1EEE7]">
                      {bookingDetails.artworkType || '—'}
                    </p>
                  </div>


                  {/* Size */}
                  <div>
                    <p className="text-xs tracking-[0.2em] uppercase text-[#686868]">
                      Size
                    </p>

                    <p className="mt-2 text-sm sm:text-base text-[#F1EEE7]">
                      {bookingDetails.size || '—'}
                    </p>
                  </div>


                  {/* People */}
                  <div>
                    <p className="text-xs tracking-[0.2em] uppercase text-[#686868]">
                      People
                    </p>

                    <p className="mt-2 text-sm sm:text-base text-[#F1EEE7]">
                      {bookingDetails.numberOfPeople || '—'}
                    </p>
                  </div>


                  {/* Price */}
                  <div>
                    <p className="text-xs tracking-[0.2em] uppercase text-[#686868]">
                      Total Price
                    </p>

                    <p className="mt-2 text-sm sm:text-base text-[#F1EEE7]">
                      {bookingDetails.totalPrice !== null &&
                      bookingDetails.totalPrice !== undefined
                        ? `₹${bookingDetails.totalPrice}`
                        : 'To be confirmed'}
                    </p>
                  </div>


                  {/* Deadline */}
                  {bookingDetails.preferredDeadline && (
                    <div>
                      <p className="text-xs tracking-[0.2em] uppercase text-[#686868]">
                        Preferred Deadline
                      </p>

                      <p className="mt-2 text-sm sm:text-base text-[#F1EEE7]">
                        {bookingDetails.preferredDeadline}
                      </p>
                    </div>
                  )}

                </div>

              </div>


              {/* Status footer */}
              <div className="border-t border-white/10 px-5 sm:px-7 py-5">

                <p className="text-xs tracking-[0.2em] uppercase text-[#686868]">
                  Current Status
                </p>

                <p className="mt-2 text-base sm:text-lg text-[#AFC0CF]">
                  {getStatusLabel(bookingDetails.status)}
                </p>

              </div>

            </div>

          </section>
        )}


        {/* Initial state */}
        {!bookingDetails &&
          !trackingError &&
          !isLoading && (
            <div className="mt-12 border-t border-white/10 pt-8">

              <p className="text-sm leading-6 text-[#686868]">
                Enter your booking ID above to view your commission details.
              </p>

            </div>
          )}

      </div>

    </main>
  );
}

export default Track;