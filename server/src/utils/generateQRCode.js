const QRCode = require('qrcode');

/**
 * Generate QR code as data URL
 * @param {string} text - Text to encode in QR code
 * @param {Object} options - QR code options
 * @returns {Promise<string>} Data URL of the QR code
 */
const generateQR = async (text, options = {}) => {
  try {
    if (!text || typeof text !== 'string') {
      throw new Error('Text parameter is required and must be a string');
    }

    const defaultOptions = {
      width: 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    };

    const qrOptions = { ...defaultOptions, ...options };
    
    const qrCodeDataURL = await QRCode.toDataURL(text, qrOptions);
    
    return {
      success: true,
      data: qrCodeDataURL,
      message: 'QR code generated successfully'
    };
  } catch (error) {
    console.error('Error generating QR code:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to generate QR code'
    };
  }
};

/**
 * Generate QR code as SVG string
 * @param {string} text - Text to encode in QR code
 * @param {Object} options - QR code options
 * @returns {Promise<Object>} SVG string of the QR code
 */
const generateQRSVG = async (text, options = {}) => {
  try {
    if (!text || typeof text !== 'string') {
      throw new Error('Text parameter is required and must be a string');
    }

    const qrSVG = await QRCode.toString(text, { 
      type: 'svg',
      ...options 
    });
    
    return {
      success: true,
      data: qrSVG,
      message: 'QR code SVG generated successfully'
    };
  } catch (error) {
    console.error('Error generating QR code SVG:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to generate QR code SVG'
    };
  }
};

module.exports = {
  generateQR,
  generateQRSVG
};