// server/src/routes/invitations.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const auth = require('../middlewares/auth');
const mail = require('../utils/mail');
const logger = require('../utils/logger');

const router = new express.Router();

// Rate limiting for invitation sending
const invitationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many invitation requests, please try again later.',
});

// Validation middleware
const validateInvitation = [
  body('*.to').isEmail().normalizeEmail(),
  body('*.host').isLength({ min: 1, max: 100 }).trim().escape(),
  body('*.movie').isLength({ min: 1, max: 200 }).trim().escape(),
  body('*.date').isISO8601().toDate(),
  body('*.time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('*.cinema').isLength({ min: 1, max: 100 }).trim().escape(),
  body('*.seat').isLength({ min: 1, max: 50 }).trim().escape(),
  body('*.image').optional().isURL(),
];

const createMailOptions = (data) => {
  const { to, host, movie, date, time, cinema, image, seat } = data;
  
  // Format date properly
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Movie Invitation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; border-bottom: 2px solid #e74c3c; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #e74c3c; margin: 0; font-size: 28px;">🎬 Movie Invitation</h1>
        </div>
        
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Hi there! You have been invited by <strong>${host}</strong> to watch a movie together.
        </p>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 10px; margin: 20px 0; color: white;">
          <h2 style="margin: 0 0 15px 0; font-size: 20px;">🎥 ${movie}</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
            <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${formattedDate}</p>
            <p style="margin: 5px 0;"><strong>🕐 Time:</strong> ${time}</p>
            <p style="margin: 5px 0;"><strong>🎭 Cinema:</strong> ${cinema}</p>
            <p style="margin: 5px 0;"><strong>💺 Seat:</strong> ${seat}</p>
          </div>
        </div>
        
        ${image ? `
          <div style="text-align: center; margin: 20px 0;">
            <img src="${image}" alt="Movie Poster" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);"/>
          </div>
        ` : ''}
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; font-size: 16px; color: #495057;">
            🍿 We can't wait to see you there! Don't forget to bring your excitement!
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="margin: 0; font-size: 12px; color: #6c757d;">
            This invitation was sent through Cinema+ platform
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return {
    from: process.env.MAIL_FROM || 'noreply@cinemaplus.com',
    to,
    subject: `🎬 Movie Invitation: ${movie} - Cinema+`,
    html: htmlContent,
  };
};

// Send Invitation Emails
router.post('/invitations', 
  invitationLimiter,
  auth.simple, 
  validateInvitation,
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const invitations = req.body;
      
      if (!Array.isArray(invitations) || invitations.length === 0) {
        return res.status(400).json({ 
          error: 'Invalid invitation data. Expected non-empty array.' 
        });
      }

      if (invitations.length > 20) {
        return res.status(400).json({ 
          error: 'Too many invitations. Maximum 20 per request.' 
        });
      }

      // Process invitations with better error handling
      const results = await Promise.allSettled(
        invitations.map(async (invitation) => {
          try {
            const mailOptions = createMailOptions(invitation);
            await mail.sendEMail(mailOptions);
            
            logger.info(`Invitation sent successfully to ${invitation.to}`, {
              host: invitation.host,
              movie: invitation.movie,
              userId: req.user.id
            });
            
            return {
              success: true,
              message: `Invitation sent successfully to ${invitation.to}`,
              recipient: invitation.to
            };
          } catch (error) {
            logger.error(`Failed to send invitation to ${invitation.to}`, {
              error: error.message,
              userId: req.user.id
            });
            
            return {
              success: false,
              message: `Failed to send invitation to ${invitation.to}: ${error.message}`,
              recipient: invitation.to
            };
          }
        })
      );

      // Transform Promise.allSettled results
      const finalResults = results.map(result => 
        result.status === 'fulfilled' ? result.value : {
          success: false,
          message: 'Unexpected error occurred',
          recipient: 'unknown'
        }
      );

      const successCount = finalResults.filter(r => r.success).length;
      const failCount = finalResults.filter(r => !r.success).length;

      res.status(201).json({
        results: finalResults,
        summary: {
          total: invitations.length,
          successful: successCount,
          failed: failCount
        }
      });
    } catch (error) {
      logger.error('Invitation sending failed', {
        error: error.message,
        userId: req.user?.id
      });
      res.status(500).json({ 
        error: 'Internal server error while sending invitations' 
      });
    }
  }
);

module.exports = router;