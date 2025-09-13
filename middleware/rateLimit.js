// Simple in-memory rate limiter (per IP and endpoint key)
// NOTE: For production, consider a distributed store like Redis.

const store = new Map(); // key -> { count, start }

function rateLimit({ windowMs = 15 * 60 * 1000, max = 100, key = 'global' } = {}) {
  return function (req, res, next) {
    try {
      const ip = req.ip || req.connection?.remoteAddress || 'unknown';
      const k = `${key}:${ip}`;
      const now = Date.now();

      let entry = store.get(k);
      if (!entry) {
        entry = { count: 0, start: now };
      }

      // Reset window
      if (now - entry.start >= windowMs) {
        entry = { count: 0, start: now };
      }

      entry.count += 1;
      store.set(k, entry);

      if (entry.count > max) {
        return res.status(429).json({
          message: 'Too many requests. Please try again later.',
          error: true,
          success: false,
        });
      }

      return next();
    } catch (e) {
      return res.status(429).json({
        message: 'Too many requests. Please try again later.',
        error: true,
        success: false,
      });
    }
  };
}

module.exports = rateLimit;
