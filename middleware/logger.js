import fs from 'fs'

const logger = (req, res, next) => {
    const log = `Route: ${req.url} - ${new Date().toISOString()}\n`;
    fs.appendFile('access.log', log, (err) => {
        if (err) {
            console.error('Failed to write log:', err);
        }
    });
    next();
};

export default logger;