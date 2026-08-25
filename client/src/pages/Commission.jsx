import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

function Commission() {
  const { customer } = useAuth();

 const [formData, setFormData] = useState({
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  artistNote: '',
  description: '',
  artworkType: 'pencil',
  size: 'A4',
  numberOfPeople: 1,
  preferredDeadline: '',
});
const resultRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Automatically use the logged-in customer's name, email too.
 useEffect(() => {
  if (customer) {
    setFormData((prev) => ({
      ...prev,
      customerName: customer.name || '',
      customerEmail: customer.email || '',
    }));
  }
}, [customer]);

useEffect(() => {
  if (bookingResult && bookingDetails && resultRef.current) {
    resultRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}, [bookingResult, bookingDetails]);

  const getWhatsAppLink = (bookingId) => {
    const phoneNumber = '919951299112';

    const message = `Hi! I would like to discuss pricing for my A2 booking, ID: ${bookingId}`;

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

 const fetchBooking = async (bookingId) => {
  try {
    const token = localStorage.getItem('customerToken');

    const response = await fetch(
      `http://localhost:5000/api/bookings/${bookingId}`,
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      }
    );

    const result = await response.json();

    if (response.ok) {
      setBookingDetails(result);
    } else {
      setBookingDetails(null);
    }
  } catch (error) {
    setBookingDetails(null);
    console.error('Error fetching booking:', error);
  }
};
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage(null);
    setBookingResult(null);
    setBookingDetails(null);
    setIsSubmitting(true);

    const data = new FormData();
    data.append('customerName', formData.customerName);
    data.append('customerEmail', formData.customerEmail);
    data.append('customerPhone', formData.customerPhone);
    data.append('artistNote', formData.artistNote);
data.append('description', formData.description);
    data.append('artworkType', formData.artworkType);
    data.append('size', formData.size);
    data.append('numberOfPeople', formData.numberOfPeople);
    data.append('preferredDeadline', formData.preferredDeadline);
    data.append('image', imageFile);

    try {
      const token = localStorage.getItem('customerToken');

      const response = await fetch(
        'http://localhost:5000/api/bookings',
        {
          method: 'POST',
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
          body: data,
        }
      );

      const result = await response.json();

      console.log('Server response:', result);

      if (response.ok) {
        setBookingResult(result);
        fetchBooking(result.bookingId);
      } else {
        setErrorMessage(
          result.error || 'Something went wrong. Please try again.'
        );
      }
    } catch (error) {
      setErrorMessage(
        'Could not reach the server. Please check your connection.'
      );

      console.error('Booking failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-shell">

      <div className="max-w-3xl mx-auto">

        {/* Page heading */}
        <header className="max-w-2xl">

          <p className="kicker">
            Commission
          </p>

          <h1 className="page-title mt-4">
            Create something
            <br />
              meaningful.
          </h1>

          <p className="lede mt-5">
            Tell us about the artwork you'd like to create.
            We'll review your request and get back to you with
            the next steps.
          </p>

        </header>


        {/* Logged-in customer notice */}
        {customer && (
          <div className="mt-8 panel px-5 py-4">

            <p className="kicker">
              Signed in as
            </p>

            <p className="mt-1 text-sm text-paper">
              {customer.name}
            </p>

          </div>
        )}


        {/* Commission form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 panel p-5 sm:p-7"
        >

          <div className="mb-8">

            <p className="kicker">
              Your Commission
            </p>

            <h2 className="section-title mt-2 text-[1.65rem]">
              Tell us what you have in mind.
            </h2>

          </div>


          <div className="space-y-7">

            {/* Name + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <div>
                <label
                  htmlFor="customerName"
                  className="label"
                >
                  Your Name
                </label>

                <input
                  id="customerName"
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  className="field"
                />
              </div>

              <div>
  <label
    htmlFor="customerEmail"
    className="label"
  >
    Email Address
  </label>

  <input
    id="customerEmail"
    type="email"
    name="customerEmail"
    value={formData.customerEmail}
    onChange={handleChange}
    required={!customer}
    disabled={!!customer}
    placeholder="you@example.com"
    autoComplete="email"
    className="field"
  />

  {customer ? (
    <p className="mt-2 text-xs text-mist">
      This email is linked to your account.
    </p>
  ) : (
    <p className="mt-2 text-xs text-mist">
      We'll use this email to connect your booking if you create an account later.
    </p>
  )}
</div>

              <div>
                <label
                  htmlFor="customerPhone"
                  className="label"
                >
                  Phone Number
                </label>

                <input
                  id="customerPhone"
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                  placeholder="+91..."
                  className="field"
                />
              </div>

            </div>


            {/* Artwork type */}
            <div>
              <label
                htmlFor="artworkType"
                className="label"
              >
                Artwork Type
              </label>

              <select
                id="artworkType"
                name="artworkType"
                value={formData.artworkType}
                onChange={handleChange}
                className="field"
              >
                <option value="pencil">
                  Pencil Portrait
                </option>

                <option value="blood">
                  Blood Art
                </option>
              </select>
            </div>


            {/* Size + People */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <div>
                <label
                  htmlFor="size"
                  className="label"
                >
                  Size
                </label>

                <select
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="field"
                >
                  <option value="A4">A4</option>
                  <option value="A3">A3</option>
                  <option value="A2">
                    A2 — custom pricing
                  </option>
                </select>
              </div>


              <div>
                <label
                  htmlFor="numberOfPeople"
                  className="label"
                >
                  Number of People
                </label>

                <input
                  id="numberOfPeople"
                  type="number"
                  name="numberOfPeople"
                  min="1"
                  max="3"
                  value={formData.numberOfPeople}
                  onChange={handleChange}
                  className="field"
                />
              </div>

            </div>


            {/* Deadline */}
            <div>
              <label
                htmlFor="preferredDeadline"
                className="label"
              >
                Preferred Deadline
              </label>

              <input
                id="preferredDeadline"
                type="date"
                name="preferredDeadline"
                value={formData.preferredDeadline}
                onChange={handleChange}
                className="field"
              />
            </div>

            {/* Note to Artist */}
<div>
  <label
    htmlFor="artistNote"
    className="label"
  >
    Note to the Artist
  </label>

  <textarea
    id="artistNote"
    name="artistNote"
    value={formData.artistNote}
    onChange={handleChange}
    rows={3}
    placeholder="e.g. Happy birthday brother"
    className="field resize-none"
  />

  <p className="mt-2 text-xs text-mist">
    Add text, dedications, or specific instructions you'd like the artist to follow.
  </p>
</div>

{/* Additional Description */}
<div>
  <label
    htmlFor="description"
    className="label"
  >
    Additional Description
    <span className="ml-2 text-mist">
      Optional
    </span>
  </label>

  <textarea
    id="description"
    name="description"
    value={formData.description}
    onChange={handleChange}
    rows={4}
    placeholder="Tell us anything else that may help us understand your commission."
    className="field resize-none"
  />
</div>


            {/* Reference image */}
            <div>

              <label
                htmlFor="image"
                className="label"
              >
                Reference Photo
              </label>

              <div className="border border-dashed border-line bg-ink-soft p-5">

                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  className="w-full text-sm text-paper-mute file:mr-4 file:border-0 file:bg-paper file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink"
                />

                <p className="mt-3 text-xs text-mist">
                  Upload a clear reference image for the artwork.
                </p>

              </div>

            </div>


            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-solid w-full"
            >
              {isSubmitting
                ? 'Submitting commission...'
                : 'Submit Commission'}
            </button>

          </div>

        </form>


        {/* Error */}
        {errorMessage && (
          <section className="notice-error mt-6">

            <p className="kicker text-mark">
              Booking failed
            </p>

            <p className="mt-2 text-sm leading-6">
              {errorMessage}
            </p>

          </section>
        )}


        {/* Success */}
        {bookingResult && (
         <section
  ref={resultRef}
  className="panel mt-10 scroll-mt-24 overflow-hidden"
>

            <div className="p-5 sm:p-7">

              <p className="kicker">
                Commission Received
              </p>

              <h2 className="section-title mt-3 text-[1.65rem]">
                Your request is on its way.
              </h2>

              <p className="lede mt-4">
                Keep this booking ID safe. You can use it to track
                your commission.
              </p>

              <div className="mt-6 border border-line bg-ink-soft px-5 py-4">

                <p className="kicker">
                  Booking ID
                </p>

                <p className="mt-2 font-mono text-lg tracking-wide text-paper">
                  {bookingResult.bookingId}
                </p>

              </div>

            </div>

          </section>
        )}


        {/* Booking details */}
        {bookingDetails && (
          <section className="panel mt-6 overflow-hidden">

            <div className="p-5 sm:p-7">

              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

                <div>

                  <p className="kicker">
                    Booking
                  </p>

                  <h2 className="section-title mt-2 text-[1.65rem]">
                    {bookingDetails.bookingId}
                  </h2>

                </div>

                <span className="chip self-start sm:self-auto">
                  {bookingDetails.status
                    ?.replaceAll('_', ' ')
                    .replace(/\b\w/g, (letter) =>
                      letter.toUpperCase()
                    )}
                </span>

              </div>


              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">

                <div>
                  <p className="kicker">
                    Customer
                  </p>

                  <p className="mt-2 text-sm">
                    {bookingDetails.customerName}
                  </p>
                </div>


                <div>
                  <p className="kicker">
                    Artwork
                  </p>

                  <p className="mt-2 text-sm capitalize">
                    {bookingDetails.artworkType}
                  </p>
                </div>


                <div>
                  <p className="kicker">
                    Size
                  </p>

                  <p className="mt-2 text-sm">
                    {bookingDetails.size}
                  </p>
                </div>


                <div>
                  <p className="kicker">
                    People
                  </p>

                  <p className="mt-2 text-sm">
                    {bookingDetails.numberOfPeople}
                  </p>
                </div>


                <div>
                  <p className="kicker">
                    Total Price
                  </p>

                  <p className="mt-2 text-sm">
                    {bookingDetails.requiresPriceConsultation
                      ? 'To be confirmed'
                      : `₹${bookingDetails.totalPrice}`}
                  </p>
                </div>

              </div>

            </div>


            {/* A2 consultation */}
            {bookingDetails.requiresPriceConsultation && (
              <div className="border-t border-line bg-ink-soft px-5 sm:px-7 py-6">

                <p className="kicker">
                  Custom Pricing
                </p>

                <h3 className="font-display mt-2 text-lg">
                  A2 size needs a quick chat.
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-paper-mute">
                  A2 pricing depends on the complexity of the
                  reference image. Message us on WhatsApp with
                  your booking ID and we'll confirm your price.
                </p>

                <a
                  href={getWhatsAppLink(bookingDetails.bookingId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-solid mt-5"
                >
                  Discuss on WhatsApp
                </a>

              </div>
            )}

          </section>
        )}

      </div>

    </main>
  );
}

export default Commission;