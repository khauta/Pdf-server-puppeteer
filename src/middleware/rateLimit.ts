import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // Limit each IP to 100 requests per `window` (here, per 1 minute)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (req) => req.header('X-API-Key') || req.ip || 'unknown', // Use API key for rate limiting if available
    message: { error: 'Too many requests, please try again later.' },
});
