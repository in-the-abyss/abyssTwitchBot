const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;

//create logg
module.exports = createLogger({
    level: 'info',
    format: combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.json()
    ),    
    transports: [
      new transports.Console({'timestamp':true})
    ],
  });