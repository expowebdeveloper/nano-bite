import nodemailer from 'nodemailer';
/**
 * Sends an email using the custom SMTP relay
 * @param {Object} emailData - The email details
 * @param {string} emailData.to - Recipient's email address
 * @param {string} emailData.subject - Email subject
 * @param {string} emailData.text - Plain text content
 * @param {string} emailData.html - HTML content (optional)
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // Create the nodemailer transport using custom SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.SMTP_FROM, // Sender's email address
      to,
      subject,
      text,
      html,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    
  } catch (error) {
    console.log("error", error)
    throw new Error('Failed to send email');
  }
};
