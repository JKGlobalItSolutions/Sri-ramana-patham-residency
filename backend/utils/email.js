const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email templates
const emailTemplates = {
  welcome: (data) => ({
    subject: data.subject || 'Welcome to Sri Ramana Padam Residency!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Sri Ramana Padam Residency</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8B0000 0%, #228B22 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #8B0000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Welcome to Sri Ramana Padam Residency</h1>
          <p>A Peaceful Retreat Near the Holy Arunachala Hill</p>
        </div>
        <div class="content">
          <h2>Hello ${data.firstName},</h2>
          <p>Welcome to Sri Ramana Padam Residency! We are delighted to have you join our community of peaceful travelers and spiritual seekers.</p>
          <p>Your account has been created successfully. To complete your registration and start booking your peaceful stay with us, please verify your email address by clicking the button below:</p>
          <div style="text-align: center;">
            <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
          </div>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; font-size: 12px; background: #fff; padding: 10px; border-radius: 5px;">${data.verificationUrl}</p>
          <p>Thank you for choosing Sri Ramana Padam Residency for your spiritual journey. We look forward to providing you with a peaceful and memorable experience.</p>
          <p>With blessings,<br><strong>Sri Ramana Padam Residency Team</strong></p>
        </div>
        <div class="footer">
          <p>Sri Ramana Padam Residency<br>
          Mathalangula St., Mathalangulam<br>
          Tiruvannamalai, Tamil Nadu 606601<br>
          Phone: +91-9943177729<br>
          Email: info@sriramanapadam.com</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to Sri Ramana Padam Residency!
      
      Hello ${data.firstName},
      
      Welcome to Sri Ramana Padam Residency! We are delighted to have you join our community.
      
      Please verify your email address by visiting: ${data.verificationUrl}
      
      Thank you for choosing us for your spiritual journey.
      
      Sri Ramana Padam Residency Team
      Mathalangula St., Mathalangulam
      Tiruvannamalai, Tamil Nadu 606601
      Phone: +91-9943177729
      Email: info@sriramanapadam.com
    `
  }),

  passwordReset: (data) => ({
    subject: data.subject || 'Password Reset - Sri Ramana Padam Residency',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Sri Ramana Padam Residency</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8B0000 0%, #228B22 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #8B0000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Password Reset Request</h1>
          <p>Sri Ramana Padam Residency</p>
        </div>
        <div class="content">
          <h2>Hello ${data.firstName},</h2>
          <p>We received a request to reset your password for your Sri Ramana Padam Residency account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center;">
            <a href="${data.resetUrl}" class="button">Reset Password</a>
          </div>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; font-size: 12px; background: #fff; padding: 10px; border-radius: 5px;">${data.resetUrl}</p>
          <div class="warning">
            <strong>⚠️ Security Notice:</strong>
            <ul>
              <li>This link will expire in 10 minutes for security reasons.</li>
              <li>If you didn't request this password reset, please ignore this email.</li>
              <li>Your password will remain unchanged until you create a new one.</li>
            </ul>
          </div>
          <p>If you're having trouble with the button, just copy and paste the URL above into a web browser.</p>
          <p>With regards,<br><strong>Sri Ramana Padam Residency Team</strong></p>
        </div>
        <div class="footer">
          <p>Sri Ramana Padam Residency<br>
          Mathalangula St., Mathalangulam<br>
          Tiruvannamalai, Tamil Nadu 606601<br>
          Phone: +91-9943177729<br>
          Email: info@sriramanapadam.com</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Password Reset Request - Sri Ramana Padam Residency
      
      Hello ${data.firstName},
      
      We received a request to reset your password.
      
      Please visit this link to reset your password: ${data.resetUrl}
      
      This link will expire in 10 minutes for security reasons.
      
      If you didn't request this password reset, please ignore this email.
      
      Sri Ramana Padam Residency Team
      Mathalangula St., Mathalangulam
      Tiruvannamalai, Tamil Nadu 606601
      Phone: +91-9943177729
      Email: info@sriramanapadam.com
    `
  }),

  bookingConfirmation: (data) => ({
    subject: data.subject || `Booking Confirmation - ${data.bookingReference}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation - ${data.bookingReference}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8B0000 0%, #228B22 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .booking-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #8B0000; }
          .button { display: inline-block; background: #8B0000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          table { width: 100%; border-collapse: collapse; }
          td { padding: 8px; text-align: left; }
          .label { font-weight: bold; color: #8B0000; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Booking Confirmed</h1>
          <p>Sri Ramana Padam Residency</p>
        </div>
        <div class="content">
          <h2>Dear ${data.guestName},</h2>
          <p>Thank you for choosing Sri Ramana Padam Residency! Your booking has been confirmed.</p>
          
          <div class="booking-details">
            <h3>Booking Details</h3>
            <table>
              <tr>
                <td class="label">Booking Reference:</td>
                <td><strong>${data.bookingReference}</strong></td>
              </tr>
              <tr>
                <td class="label">Check-in:</td>
                <td>${data.checkInDate} at 2:00 PM</td>
              </tr>
              <tr>
                <td class="label">Check-out:</td>
                <td>${data.checkOutDate} at 11:00 AM</td>
              </tr>
              <tr>
                <td class="label">Nights:</td>
                <td>${data.nights}</td>
              </tr>
              <tr>
                <td class="label">Room:</td>
                <td>${data.roomType}</td>
              </tr>
              <tr>
                <td class="label">Guests:</td>
                <td>${data.totalGuests}</td>
              </tr>
              <tr>
                <td class="label">Total Amount:</td>
                <td><strong>₹${data.totalAmount}</strong></td>
              </tr>
            </table>
          </div>
          
          <h3>Check-in Instructions</h3>
          <ul>
            <li><strong>Time:</strong> 2:00 PM onwards</li>
            <li><strong>Location:</strong> Front Desk, Sri Ramana Padam Residency</li>
            <li><strong>Documents Required:</strong> Valid photo ID for all guests</li>
            <li><strong>Payment:</strong> Payment method for incidentals (if any)</li>
          </ul>
          
          <p>Please present this booking confirmation along with valid photo ID during check-in.</p>
          
          <div style="text-align: center;">
            <a href="${data.manageBookingUrl}" class="button">Manage Your Booking</a>
          </div>
          
          <p>We look forward to welcoming you to our peaceful sanctuary near the holy Arunachala Hill.</p>
          
          <p>With warm regards,<br><strong>Sri Ramana Padam Residency Team</strong></p>
        </div>
        <div class="footer">
          <p>Sri Ramana Padam Residency<br>
          Mathalangula St., Mathalangulam<br>
          Tiruvannamalai, Tamil Nadu 606601<br>
          Phone: +91-9943177729<br>
          Email: info@sriramanapadam.com</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Booking Confirmation - ${data.bookingReference}
      
      Dear ${data.guestName},
      
      Thank you for choosing Sri Ramana Padam Residency! Your booking has been confirmed.
      
      BOOKING DETAILS:
      Booking Reference: ${data.bookingReference}
      Check-in: ${data.checkInDate} at 2:00 PM
      Check-out: ${data.checkOutDate} at 11:00 AM
      Nights: ${data.nights}
      Room: ${data.roomType}
      Guests: ${data.totalGuests}
      Total Amount: ₹${data.totalAmount}
      
      CHECK-IN INSTRUCTIONS:
      - Time: 2:00 PM onwards
      - Location: Front Desk, Sri Ramana Padam Residency
      - Documents: Valid photo ID for all guests
      - Payment: Payment method for incidentals (if any)
      
      Please present this booking confirmation along with valid photo ID during check-in.
      
      We look forward to welcoming you to our peaceful sanctuary.
      
      Sri Ramana Padam Residency Team
      Mathalangula St., Mathalangulam
      Tiruvannamalai, Tamil Nadu 606601
      Phone: +91-9943177729
      Email: info@sriramanapadam.com
    `
  }),

  bookingReminder: (data) => ({
    subject: data.subject || `Upcoming Stay Reminder - ${data.bookingReference}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Stay Reminder - ${data.bookingReference}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8B0000 0%, #228B22 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .reminder { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Stay Reminder</h1>
          <p>Sri Ramana Padam Residency</p>
        </div>
        <div class="content">
          <div class="reminder">
            <h3>Your peaceful retreat awaits!</h3>
            <p>Your stay at Sri Ramana Padam Residency begins in ${data.daysUntilCheckIn} day(s).</p>
          </div>
          
          <h2>Dear ${data.guestName},</h2>
          <p>This is a gentle reminder about your upcoming stay with us.</p>
          
          <p><strong>Check-in Date:</strong> ${data.checkInDate}<br>
          <strong>Check-out Date:</strong> ${data.checkOutDate}<br>
          <strong>Room:</strong> ${data.roomType}</p>
          
          <p>We're excited to welcome you to our peaceful sanctuary near the holy Arunachala Hill. Our team is preparing to ensure you have a comfortable and spiritually enriching experience.</p>
          
          <p>If you have any special requests or questions before your arrival, please don't hesitate to contact us at +91-9943177729.</p>
          
          <p>Safe travels, and we look forward to seeing you soon!</p>
          
          <p>With blessings,<br><strong>Sri Ramana Padam Residency Team</strong></p>
        </div>
        <div class="footer">
          <p>Sri Ramana Padam Residency<br>
          Mathalangula St., Mathalangulam<br>
          Tiruvannamalai, Tamil Nadu 606601<br>
          Phone: +91-9943177729<br>
          Email: info@sriramanapadam.com</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Stay Reminder - ${data.bookingReference}
      
      Dear ${data.guestName},
      
      This is a reminder about your upcoming stay with us.
      
      Your stay at Sri Ramana Padam Residency begins in ${data.daysUntilCheckIn} day(s).
      
      Check-in Date: ${data.checkInDate}
      Check-out Date: ${data.checkOutDate}
      Room: ${data.roomType}
      
      We're excited to welcome you to our peaceful sanctuary near the holy Arunachala Hill.
      
      If you have any special requests or questions, please contact us at +91-9943177729.
      
      Safe travels, and we look forward to seeing you soon!
      
      Sri Ramana Padam Residency Team
      Mathalangula St., Mathalangulam
      Tiruvannamalai, Tamil Nadu 606601
      Phone: +91-9943177729
      Email: info@sriramanapadam.com
    `
  }),

  bookingCancellation: (data) => ({
    subject: data.subject || `Booking Cancelled - ${data.bookingReference}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Cancellation - ${data.bookingReference}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8B0000 0%, #228B22 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .cancelled { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .refund { background: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Booking Cancelled</h1>
          <p>Sri Ramana Padam Residency</p>
        </div>
        <div class="content">
          <div class="cancelled">
            <h3>Your booking has been cancelled</h3>
            <p>Booking Reference: <strong>${data.bookingReference}</strong></p>
          </div>
          
          <h2>Dear ${data.guestName},</h2>
          <p>We confirm that your booking has been cancelled as requested.</p>
          
          <p><strong>Cancelled Details:</strong><br>
          Check-in Date: ${data.checkInDate}<br>
          Room: ${data.roomType}<br>
          Cancellation Reason: ${data.cancellationReason}</p>
          
          ${data.refundAmount > 0 ? `
          <div class="refund">
            <h3>Refund Information</h3>
            <p><strong>Refund Amount:</strong> ₹${data.refundAmount}</p>
            <p><strong>Processing Time:</strong> 5-7 business days</p>
            <p>Your refund will be processed to the original payment method.</p>
          </div>
          ` : `
          <div class="refund">
            <h3>No Refund</h3>
            <p>As per our cancellation policy, no refund is applicable for this cancellation.</p>
          </div>
          `}
          
          <p>We understand that plans change, and we appreciate your understanding of our policies. We hope to welcome you to Sri Ramana Padam Residency in the future.</p>
          
          <p>If you have any questions about this cancellation or would like to make a new booking, please don't hesitate to contact us at +91-9943177729.</p>
          
          <p>Thank you for considering Sri Ramana Padam Residency for your spiritual journey.</p>
          
          <p>With regards,<br><strong>Sri Ramana Padam Residency Team</strong></p>
        </div>
        <div class="footer">
          <p>Sri Ramana Padam Residency<br>
          Mathalangula St., Mathalangulam<br>
          Tiruvannamalai, Tamil Nadu 606601<br>
          Phone: +91-9943177729<br>
          Email: info@sriramanapadam.com</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Booking Cancelled - ${data.bookingReference}
      
      Dear ${data.guestName},
      
      We confirm that your booking has been cancelled.
      
      Cancelled Details:
      Booking Reference: ${data.bookingReference}
      Check-in Date: ${data.checkInDate}
      Room: ${data.roomType}
      Cancellation Reason: ${data.cancellationReason}
      
      ${data.refundAmount > 0 ? `
      Refund Information:
      Refund Amount: ₹${data.refundAmount}
      Processing Time: 5-7 business days
      Your refund will be processed to the original payment method.
      ` : `
      No Refund:
      As per our cancellation policy, no refund is applicable for this cancellation.
      `}
      
      We hope to welcome you to Sri Ramana Padam Residency in the future.
      
      Sri Ramana Padam Residency Team
      Mathalangula St., Mathalangulam
      Tiruvannamalai, Tamil Nadu 606601
      Phone: +91-9943177729
      Email: info@sriramanapadam.com
    `
  })
};

// Send email function
const sendEmail = async (options) => {
  try {
    const { email, subject, template, data = {} } = options;

    // Get email template
    const emailTemplate = emailTemplates[template];
    if (!emailTemplate) {
      throw new Error(`Email template '${template}' not found`);
    }

    const templateData = emailTemplate(data);
    
    // Mail options
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Sri Ramana Padam Residency" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: templateData.subject,
      html: templateData.html,
      text: templateData.text
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

// Verify SMTP connection
const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log('SMTP connection verified successfully');
    return true;
  } catch (error) {
    console.error('SMTP connection failed:', error);
    return false;
  }
};

// Test email sending
const sendTestEmail = async (testEmail) => {
  try {
    const result = await sendEmail({
      email: testEmail,
      subject: 'Test Email - Sri Ramana Padam Residency',
      template: 'welcome',
      data: {
        firstName: 'Test User',
        verificationUrl: 'https://example.com/verify/test-token'
      }
    });
    
    console.log('Test email sent:', result);
    return result;
  } catch (error) {
    console.error('Test email failed:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  verifyConnection,
  sendTestEmail,
  emailTemplates
};
