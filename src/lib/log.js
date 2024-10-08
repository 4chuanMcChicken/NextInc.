const log4js = require('log4js');

const config = {
    appenders: {
        dateDebugFile: {
            type: 'dateFile',
            filename: 'log/debug.log',
            numBackups: 30,
            // maxLogSize: 500 * 1024 * 1024, // = 500Mb
            // numBackups: 5, // keep five backup files
            compress: true, // compress the backups
            encoding: 'utf-8',
            // flags: 'w+',
            level: 'debug',
        },
        dateInfoFile: {
            type: 'dateFile',
            filename: 'log/info.log',
            numBackups: 30,
            encoding: 'utf-8',
            level: 'info',
        },
        dateErrorFile: {
            type: 'dateFile',
            filename: 'log/error.log',
            numBackups: 30,
            encoding: 'utf-8',
            level: 'info',
        },
        infoLogs: {
            type: 'logLevelFilter',
            appender: 'dateInfoFile',
            level: 'info',
        },
        errorLogs: {
            type: 'logLevelFilter',
            appender: 'dateErrorFile',
            level: 'error',
        },
        debugLogs: {
            type: 'logLevelFilter',
            appender: 'dateDebugFile',
            level: 'debug',
        },
    },
    categories: {
        default: { appenders: ['debugLogs', 'infoLogs', 'errorLogs'], level: 'trace' },
    },
};

log4js.configure(config);
const getLogger = (name) => log4js.getLogger(name);

module.exports = getLogger;