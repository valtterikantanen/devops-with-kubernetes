import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  transports: [new transports.Console()],
  format: format.printf(({ level, stack, message }) =>
    stack ? `${level}: ${stack}` : `${level}: ${message}`
  ),
});
