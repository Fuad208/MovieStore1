const nodemailer = require('nodemailer');

/**
 * Email configuration and transporter setup
 */
class EmailService {
  constructor() {
    this.transporter = this.createTransporter();
  }

  createTransporter() {
    const config = {
      service: 'gmail',
      secure: true, // Use SSL
      port: 465,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    };

    // Validate required environment variables
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
      throw new Error('Gmail credentials are not configured in environment variables');
    }

    return nodemailer.createTransporter(config);
  }

  /**
   * Send email with proper error handling and validation
   * @param {Object} mailOptions - Email options
   * @param {string} mailOptions.to - Recipient email
   * @param {string} mailOptions.subject - Email subject
   * @param {string} mailOptions.text - Plain text content
   * @param {string} mailOptions.html - HTML content
   * @param {Array} mailOptions.attachments - Email attachments
   * @returns {Promise<Object>} Send result
   */
  async sendEmail(mailOptions) {
    try {
      // Validate required fields
      if (!mailOptions.to) {
        throw new Error('Recipient email is required');
      }
      
      if (!mailOptions.subject) {
        throw new Error('Email subject is required');
      }

      if (!mailOptions.text && !mailOptions.html) {
        throw new Error('Email content (text or html) is required');
      }

      // Set default from address if not provided
      const emailConfig = {
        from: process.env.GMAIL_USER,
        ...mailOptions
      };

      const info = await this.transporter.sendMail(emailConfig);
      
      return {
        success: true,
        messageId: info.messageId,
        message: 'Email sent successfully',
        info
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        message: error.message || 'Failed to send email',
        error: error.code || 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Send reservation confirmation email
   * @param {Object} reservationData - Reservation details
   * @returns {Promise<Object>} Send result
   */
  async sendReservationConfirmation(reservationData) {
    const { userEmail, userName, movieTitle, cinemaName, showTime, seats, reservationId } = reservationData;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Reservation Confirmation</h2>
        <p>Dear ${userName},</p>
        <p>Your movie reservation has been confirmed!</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #495057;">Reservation Details</h3>
          <p><strong>Movie:</strong> ${movieTitle}</p>
          <p><strong>Cinema:</strong> ${cinemaName}</p>
          <p><strong>Show Time:</strong> ${showTime}</p>
          <p><strong>Seats:</strong> ${seats.join(', ')}</p>
          <p><strong>Reservation ID:</strong> ${reservationId}</p>
        </div>
        
        <p>Please arrive at the cinema at least 15 minutes before the show time.</p>
        <p>Thank you for choosing our service!</p>
      </div>
    `;

    return await this.sendEmail({
      to: userEmail,
      subject: `Reservation Confirmation - ${movieTitle}`,
      html: htmlContent,
      text: `Reservation confirmed for ${movieTitle} at ${cinemaName}. Show time: ${showTime}. Seats: ${seats.join(', ')}. Reservation ID: ${reservationId}`
    });
  }

  /**
   * Verify email transporter connection
   * @returns {Promise<boolean>} Connection status
   */
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('Email transporter connection verified successfully');
      return true;
    } catch (error) {
      console.error('Email transporter connection failed:', error);
      return false;
    }
  }
}

// Create singleton instance
const emailService = new EmailService();

module.exports = emailService;