// src/lib/email.ts
import { Resend } from 'resend';

// Initialize the Resend client with API key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

// Define the sender email address
const fromEmail = process.env.RESEND_FROM_EMAIL || 'no-reply@birjob.com';

// Email template for contact form submissions
export async function sendContactNotification({
  name,
  email,
  message,
  submissionId
}: {
  name: string;
  email: string;
  message: string;
  submissionId: number;
}) {
  const subject = `New Contact Form Submission: ${name}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }
        .header {
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .logo {
          color: #4338ca;
          font-size: 20px;
          font-weight: bold;
        }
        h1 {
          color: #111;
          font-size: 18px;
          margin-top: 0;
        }
        .content {
          margin-bottom: 20px;
        }
        .field {
          margin-bottom: 15px;
        }
        .field-label {
          font-weight: bold;
          display: block;
          margin-bottom: 5px;
          color: #6b7280;
        }
        .field-value {
          padding: 10px;
          background-color: #f3f4f6;
          border-radius: 4px;
        }
        .message-value {
          white-space: pre-wrap;
          padding: 15px;
          background-color: #f3f4f6;
          border-radius: 4px;
          border-left: 3px solid #4338ca;
        }
        .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #e5e7eb;
          font-size: 12px;
          color: #6b7280;
        }
        .submission-id {
          font-family: monospace;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">BirJob</div>
        </div>
        
        <div class="content">
          <h1>New Contact Form Submission</h1>
          
          <div class="field">
            <div class="field-label">Name:</div>
            <div class="field-value">${name}</div>
          </div>
          
          <div class="field">
            <div class="field-label">Email:</div>
            <div class="field-value">${email}</div>
          </div>
          
          <div class="field">
            <div class="field-label">Message:</div>
            <div class="message-value">${message}</div>
          </div>
        </div>
        
        <div class="footer">
          <p>This is an automated notification from the BirJob contact form.</p>
          <p>Submission ID: <span class="submission-id">${submissionId}</span></p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  try {
    const { data, error } = await resend.emails.send({
      from: `BirJob Contact <${fromEmail}>`,
      to: [process.env.CONTACT_NOTIFICATION_EMAIL || email], // Send to admin/support email, fallback to sender
      subject: subject,
      html: htmlContent,
      reply_to: email
    });
    
    if (error) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Exception while sending email:', error);
    throw error;
  }
}