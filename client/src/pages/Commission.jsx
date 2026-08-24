import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Commission() {
  const { customer } = useAuth();

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    artworkType: 'pencil',
    size: 'A4',
    numberOfPeople: 1,
    preferredDeadline: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Automatically use the logged-in customer's name.
  useEffect(() => {
    if (customer?.name) {
      setFormData((prev) => ({
        ...prev,
        customerName: customer.name,
      }));
    }
  }, [customer]);

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
      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}`
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
    data.append('customerPhone', formData.customerPhone);
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
    <main className="min-h-screen bg-[#0B0B0B] text-[#F1EEE7] px-5 sm:px-8 lg:px-10 pt-32 pb-20">

      <div className="max-w-4xl mx-auto">

        {/* Page heading */}
        <header className="max-w-2xl">

          <p className="text-xs sm:text-sm tracking-[0.32em] uppercase text-[#8F9BA6]">
            Commission
          </p>

          <h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
            Create something  
            <br />
              meaningful.
          </h1>

          <p className="mt-6 text-sm sm:text-base leading-7 text-[#B8B3AA] max-w-xl">
            Tell us about the artwork you'd like to create.
            We'll review your request and get back to you with
            the next steps.
          </p>

        </header>


        {/* Logged-in customer notice */}
        {customer && (
          <div className="mt-8 rounded-xl border border-white/10 bg-[#111111] px-5 py-4">

            <p className="text-xs tracking-[0.22em] uppercase text-[#686868]">
              Signed in as
            </p>

            <p className="mt-1 text-sm sm:text-base text-[#F1EEE7]">
              {customer.name}
            </p>

          </div>
        )}


        {/* Commission form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-white/10 bg-[#111111] p-5 sm:p-7 lg:p-8"
        >

          <div className="mb-8">

            <p className="text-xs tracking-[0.25em] uppercase text-[#8F9BA6]">
              Your Commission
            </p>

            <h2 className="mt-2 text-2xl sm:text-3xl font-serif">
              Tell us what you have in mind.
            </h2>

          </div>


          <div className="space-y-7">

            {/* Name + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <div>
                <label
                  htmlFor="customerName"
                  className="block text-sm text-[#B8B3AA] mb-2"
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
                  className="w-full rounded-lg border border-white/10 bg-[#181818] px-4 py-3.5 text-sm sm:text-base text-[#F1EEE7] placeholder:text-[#686868] outline-none focus:border-[#6F8499] transition"
                />
              </div>


              <div>
                <label
                  htmlFor="customerPhone"
                  className="block text-sm text-[#B8B3AA] mb-2"
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
                  className="w-full rounded-lg border border-white/10 bg-[#181818] px-4 py-3.5 text-sm sm:text-base text-[#F1EEE7] placeholder:text-[#686868] outline-none focus:border-[#6F8499] transition"
                />
              </div>

            </div>


            {/* Artwork type */}
            <div>
              <label
                htmlFor="artworkType"
                className="block text-sm text-[#B8B3AA] mb-2"
              >
                Artwork Type
              </label>

              <select
                id="artworkType"
                name="artworkType"
                value={formData.artworkType}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-[#181818] px-4 py-3.5 text-sm sm:text-base text-[#F1EEE7] outline-none focus:border-[#6F8499] transition"
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
                  className="block text-sm text-[#B8B3AA] mb-2"
                >
                  Size
                </label>

                <select
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-[#181818] px-4 py-3.5 text-sm sm:text-base text-[#F1EEE7] outline-none focus:border-[#6F8499] transition"
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
                  className="block text-sm text-[#B8B3AA] mb-2"
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
                  className="w-full rounded-lg border border-white/10 bg-[#181818] px-4 py-3.5 text-sm sm:text-base text-[#F1EEE7] outline-none focus:border-[#6F8499] transition"
                />
              </div>

            </div>


            {/* Deadline */}
            <div>
              <label
                htmlFor="preferredDeadline"
                className="block text-sm text-[#B8B3AA] mb-2"
              >
                Preferred Deadline
              </label>

              <input
                id="preferredDeadline"
                type="date"
                name="preferredDeadline"
                value={formData.preferredDeadline}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-[#181818] px-4 py-3.5 text-sm sm:text-base text-[#F1EEE7] outline-none focus:border-[#6F8499] transition"
              />
            </div>


            {/* Reference image */}
            <div>

              <label
                htmlFor="image"
                className="block text-sm text-[#B8B3AA] mb-2"
              >
                Reference Photo
              </label>

              <div className="rounded-lg border border-dashed border-white/15 bg-[#151515] p-5">

                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  className="w-full text-sm text-[#B8B3AA] file:mr-4 file:rounded-md file:border-0 file:bg-[#F1EEE7] file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-[#0B0B0B] hover:file:bg-white"
                />

                <p className="mt-3 text-xs text-[#686868]">
                  Upload a clear reference image for the artwork.
                </p>

              </div>

            </div>


            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#F1EEE7] px-6 py-4 text-sm font-semibold text-[#0B0B0B] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? 'Submitting commission...'
                : 'Submit Commission'}
            </button>

          </div>

        </form>


        {/* Error */}
        {errorMessage && (
          <section className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4">

            <p className="text-xs tracking-[0.2em] uppercase text-red-300">
              Booking failed
            </p>

            <p className="mt-2 text-sm leading-6 text-red-200">
              {errorMessage}
            </p>

          </section>
        )}


        {/* Success */}
        {bookingResult && (
          <section className="mt-10 rounded-2xl border border-white/10 bg-[#111111] overflow-hidden">

            <div className="p-5 sm:p-7">

              <p className="text-xs tracking-[0.25em] uppercase text-[#8F9BA6]">
                Commission Received
              </p>

              <h2 className="mt-3 text-2xl sm:text-3xl font-serif">
                Your request is on its way.
              </h2>

              <p className="mt-4 text-sm leading-6 text-[#B8B3AA]">
                Keep this booking ID safe. You can use it to track
                your commission.
              </p>

              <div className="mt-6 rounded-xl border border-white/10 bg-[#181818] px-5 py-4">

                <p className="text-xs tracking-[0.2em] uppercase text-[#686868]">
                  Booking ID
                </p>

                <p className="mt-2 font-mono text-xl sm:text-2xl tracking-wide text-[#F1EEE7]">
                  {bookingResult.bookingId}
                </p>

              </div>

            </div>

          </section>
        )}


        {/* Booking details */}
        {bookingDetails && (
          <section className="mt-6 rounded-2xl border border-white/10 bg-[#111111] overflow-hidden">

            <div className="p-5 sm:p-7">

              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

                <div>

                  <p className="text-xs tracking-[0.25em] uppercase text-[#686868]">
                    Booking
                  </p>

                  <h2 className="mt-2 text-2xl sm:text-3xl font-serif">
                    {bookingDetails.bookingId}
                  </h2>

                </div>

                <span className="self-start sm:self-auto inline-flex rounded-full border border-[#6F8499]/30 bg-[#6F8499]/10 px-4 py-2 text-sm text-[#AFC0CF]">
                  {bookingDetails.status
                    ?.replaceAll('_', ' ')
                    .replace(/\b\w/g, (letter) =>
                      letter.toUpperCase()
                    )}
                </span>

              </div>


              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">

                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-[#686868]">
                    Customer
                  </p>

                  <p className="mt-2 text-sm sm:text-base">
                    {bookingDetails.customerName}
                  </p>
                </div>


                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-[#686868]">
                    Artwork
                  </p>

                  <p className="mt-2 text-sm sm:text-base capitalize">
                    {bookingDetails.artworkType}
                  </p>
                </div>


                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-[#686868]">
                    Size
                  </p>

                  <p className="mt-2 text-sm sm:text-base">
                    {bookingDetails.size}
                  </p>
                </div>


                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-[#686868]">
                    People
                  </p>

                  <p className="mt-2 text-sm sm:text-base">
                    {bookingDetails.numberOfPeople}
                  </p>
                </div>


                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-[#686868]">
                    Total Price
                  </p>

                  <p className="mt-2 text-sm sm:text-base">
                    {bookingDetails.requiresPriceConsultation
                      ? 'To be confirmed'
                      : `₹${bookingDetails.totalPrice}`}
                  </p>
                </div>

              </div>

            </div>


            {/* A2 consultation */}
            {bookingDetails.requiresPriceConsultation && (
              <div className="border-t border-white/10 bg-[#151515] px-5 sm:px-7 py-6">

                <p className="text-xs tracking-[0.22em] uppercase text-[#8F9BA6]">
                  Custom Pricing
                </p>

                <h3 className="mt-2 text-lg sm:text-xl font-medium">
                  A2 size needs a quick chat.
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#B8B3AA]">
                  A2 pricing depends on the complexity of the
                  reference image. Message us on WhatsApp with
                  your booking ID and we'll confirm your price.
                </p>

                <a
                  href={getWhatsAppLink(bookingDetails.bookingId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex mt-5 rounded-lg bg-[#F1EEE7] px-5 py-3 text-sm font-semibold text-[#0B0B0B] transition hover:bg-white"
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