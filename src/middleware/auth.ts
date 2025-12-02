import { Request, Response, NextFunction } from 'express';

const VALID_API_KEYS = new Set([
    'sk_live_your_angular_app_key_123',
    'sk_test_local_dev_key',
    // Add more keys as needed
]);

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
    const key = req.header('X-API-Key');
    if (!key || (typeof key === 'string' && !VALID_API_KEYS.has(key))) {
        return res.status(401).json({ error: 'Invalid or missing API key' });
    }
    next();
};
