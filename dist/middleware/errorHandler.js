"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const pino_1 = require("pino");
const logger = (0, pino_1.pino)();
const errorHandler = (err, req, res, next) => {
    logger.error(err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message || 'Something went wrong',
    });
};
exports.errorHandler = errorHandler;
