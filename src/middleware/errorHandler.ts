import { Request, Response, NextFunction } from 'express';
import { pino } from 'pino';

const logger = pino();

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message || 'Something went wrong',
    });
};
