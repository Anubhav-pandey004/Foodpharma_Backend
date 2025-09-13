// Compute secure cookie options based on environment
// - In production: SameSite=None and Secure=true (required for cross-site cookies over HTTPS)
// - In development: SameSite=Lax and Secure=false

function getCookieOptions({ ttlMs = 8 * 60 * 60 * 1000 } = {}) {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: ttlMs,
    path: '/',
  };
}

module.exports = getCookieOptions;
