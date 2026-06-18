const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill in all required fields (name, email, message).' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      replyTo: email,
      subject: `[Portfolio] ${subject || 'New message'} from ${name}`,
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 580px; margin: 0 auto; padding: 32px; background: #fafaf9; border-radius: 12px;">
          <h2 style="color: #b45309; margin-bottom: 24px; font-weight: 600;">New message from your portfolio</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 14px; background: #fff; border-radius: 8px 8px 0 0; font-weight: 600; color: #1c1917; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">Name</td>
              <td style="padding: 10px 14px; background: #fff; border-radius: 8px 8px 0 0; color: #444;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; background: #fff; font-weight: 600; color: #1c1917; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">Email</td>
              <td style="padding: 10px 14px; background: #fff; color: #444;"><a href="mailto:${email}" style="color: #b45309;">${email}</a></td>
            </tr>
            ${subject ? `<tr>
              <td style="padding: 10px 14px; background: #fff; font-weight: 600; color: #1c1917; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">Subject</td>
              <td style="padding: 10px 14px; background: #fff; color: #444;">${subject}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 10px 14px; background: #fff; border-radius: 0 0 8px 8px; font-weight: 600; color: #1c1917; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;" colspan="2">Message</td>
            </tr>
            <tr>
              <td style="padding: 14px; background: #fff; border-radius: 8px; color: #444; line-height: 1.8;" colspan="2">${message}</td>
            </tr>
          </table>
          <p style="color: #a8a29e; font-size: 0.8rem; margin-top: 24px; text-align: center;">Sent from mohamedessaidi.ma</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      error: 'Failed to send message. Please try again or email me directly.',
    });
  }
};
