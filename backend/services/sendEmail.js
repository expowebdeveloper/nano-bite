import nodemailer from 'nodemailer';
/**
 * Sends an email using the custom SMTP relay
 * @param {Object} emailData - The email details
 * @param {string} emailData.to - Recipient's email address
 * @param {string} emailData.subject - Email subject
 * @param {string} emailData.text - Plain text content
 * @param {string} emailData.html - HTML content (optional)
 */
const SIGNATURE_TEXT = `

--
Best regards,
NanoBite Dental
`;

const SIGNATURE_HTML = `
<br/>
<div style="margin-top:20px; padding-top:10px; border-top:1px solid #e0e0e0; font-family: Arial, sans-serif; color:#333;">
  <p style="margin:0;">Best regards,</p>
  <p style="margin:4px 0 0 0; font-weight:bold; color:#0b6b8a;">NanoBite Dental</p>
</div>
`;

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // Create the nodemailer transport using custom SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true",
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
      text: text ? `${text}${SIGNATURE_TEXT}` : text,
      html: html ? `${html}${SIGNATURE_HTML}` : html,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    
  } catch (error) {
    console.log("error", error)
    throw new Error('Failed to send email');
  }
};
