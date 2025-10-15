export default function auth(req, res, next) {
  const configuredKey = process.env.API_KEY;

  // If no API_KEY is configured, allow requests in development (so the app
  // isn't blocked during local dev) but fail fast in production.
  if (!configuredKey) {
    if (process.env.NODE_ENV === 'production') {
      console.error('API_KEY is not set in the environment (production)');
      return res.status(500).json({ error: 'Server misconfiguration' });
    }
    // Development: warn and skip auth to avoid blocking local testing.
    // Remove this behavior in production by setting API_KEY.
    console.warn('API_KEY not set — skipping authentication (development only)');
    return next();
  }

  // Support x-api-key header or Authorization: Bearer <token>
  const headerKey = (req.headers['x-api-key'] || req.headers['X-API-KEY'] || req.headers['authorization'] || req.headers['Authorization'])
    ? (() => {
        const raw = req.headers['x-api-key'] || req.headers['X-API-KEY'] || req.headers['authorization'] || req.headers['Authorization'];
        if (typeof raw === 'string' && raw.toLowerCase().startsWith('bearer ')) {
          return raw.slice(7).trim();
        }
        return raw;
      })()
    : undefined;

  if (!headerKey || headerKey !== configuredKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}
