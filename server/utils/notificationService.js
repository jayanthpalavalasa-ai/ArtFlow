const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Eswar Tallapudi's Art <onboarding@resend.dev>";

/**
 * Sends an email notification to a customer about their booking.
 *
 * @param {Object} options
 * @param {Object} options.booking - The booking document.
 * @param {string} options.subject - Email subject.
 * @param {string} options.html - Email HTML content.
 */
async function sendCustomerNotification({ booking, subject, html }) {
  if (!booking) {
    console.warn('Customer notification skipped: booking is missing.');
    return;
  }

  if (!booking.customerEmail) {
    console.warn(
      `Customer notification skipped: no email for booking ${booking.bookingId || 'unknown'}.`
    );
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: booking.customerEmail,
      subject,
      html,
    });

    console.log(
      `Customer notification sent for booking ${booking.bookingId || 'unknown'} → ${booking.customerEmail}`
    );
  } catch (err) {
    console.error(
      `Failed to send customer notification for booking ${booking.bookingId || 'unknown'}:`,
      err
    );
  }
}

module.exports = {
  sendCustomerNotification,
};