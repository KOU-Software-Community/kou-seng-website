import 'dotenv/config';

const logLevel = process.env.LOG_LEVEL || 'info';

const formatLogMessage = (level, message) => {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const timestamp = `${day}.${month}.${year} ${hours}:${minutes}`;
  return `[${level}] [${timestamp}] - ${message}`;
};

const logger = {
  debug: (message) => {
    if (logLevel === 'debug') {
      console.log(formatLogMessage('DEBUG', message));
    }
  },
  
  info: (message) => {
    console.log(formatLogMessage('INFO', message));
  },

  error: (message) => {
    // TODO: Telegram ile loglama yapılacak
    console.log(formatLogMessage('ERROR', message));
  }
};

export default logger;