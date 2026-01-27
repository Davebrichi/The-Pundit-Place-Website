const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const params = new URLSearchParams(event.body);
    const name = params.get('name') || '';
    const email = params.get('email') || '';
    const organisation = params.get('organisation') || 'N/A';
    const message = params.get('message') || '';
    const recaptchaToken = params.get('g-recaptcha-response');

    if (!email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid input: Email and Message are required." }),
      };
    }

    // SMTP Configuration from Environment Variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'mail.thepunditplace.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"The Pundit Place" <${process.env.CONTACT_EMAIL || 'consult@thepunditplace.com'}>`,
      to: process.env.CONTACT_EMAIL || 'consult@thepunditplace.com',
      replyTo: `${name} <${email}>`,
      subject: 'New Contact Form Submission',
      html: `
        <strong>Name:</strong> ${name}<br>
        <strong>Email:</strong> ${email}<br>
        <strong>Organisation:</strong> ${organisation}<br><br>
        <strong>Message:</strong><br>
        ${message.replace(/\n/g, '<br>')}
      `,
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: "OK",
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Email failed", error: error.message }),
    };
  }
};
