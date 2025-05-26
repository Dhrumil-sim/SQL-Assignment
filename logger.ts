// logger.ts
import { createLogger, transports, format } from 'winston';

// Define the format: timestamp + log level + message
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
  }),
);

// Create a Winston logger instance
const logger = createLogger({
  level: 'debug', // Minimum level to log (can be changed to 'info' or 'error' in prod)
  format: logFormat,
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: 'logs/app.log' }), // Log to file
  ],
});

export default logger;
