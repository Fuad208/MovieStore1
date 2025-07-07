// server/src/routes/invitations.js
const express = require('express');
const auth = require('../middlewares/auth');
const mail = require('../utils/mail');

const router = new express.Router();

const createMailOptions = (data) => {
  const { to, host, movie, date, time, cinema, image, seat } = data;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;"><strong>Movie Invitation</strong></h1>
      <p>Hi there! You have been invited by <strong>${host}</strong> to watch a movie.</p>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Movie:</strong> ${movie}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Cinema:</strong> ${cinema}</p>
        <p><strong>Seat:</strong> ${seat}</p>
      </div>
      ${image ? `<img src="${image}" alt="Movie Poster" style="max-width: 100%; height: auto; border-radius: 8px;"/>` : ''}
      <p style="margin-top: 20px;">We look forward to seeing you there!</p>
    </div>
  `;

  return {
    from: 'geosimos91@gmail.com',
    to,
    subject: 'Movie Invitation - Cinema+',
    html: htmlContent,
  };
};

// Send Invitation Emails
router.post('/invitations', auth.simple, async (req, res) => {
  try {
    const invitations = req.body;
    
    if (!Array.isArray(invitations) || invitations.length === 0) {
      return res.status(400).send({ error: 'Invalid invitation data' });
    }

    const promises = invitations.map(async (invitation) => {
      try {
        const mailOptions = createMailOptions(invitation);
        await mail.sendEMail(mailOptions);
        return {
          success: true,
          message: `Invitation sent successfully to ${mailOptions.to}`,
          recipient: mailOptions.to
        };
      } catch (exception) {
        return {
          success: false,
          message: `Failed to send invitation to ${invitation.to}: ${exception.message}`,
          recipient: invitation.to
        };
      }
    });

    const results = await Promise.all(promises);
    res.status(201).json(results);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

module.exports = router;