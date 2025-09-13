const getCookieOptions = require('../utils/cookies');

module.exports = (req, res) => {
  try {
    const baseOptions = getCookieOptions({ ttlMs: 8 * 60 * 60 * 1000 });
    // Clear cookie using same options to ensure deletion on all browsers
    res.clearCookie('token', { ...baseOptions, expires: new Date(0), maxAge: 0 });
    res.status(200).json({
      message: 'Logged out successfully',
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: true,
    });
  }
};
