function timestamp() {
  return new Date().toISOString();
}

function format(level, message, context) {
  const base = `[${timestamp()}] [${level}] ${message}`;
  return context !== undefined ? `${base} ${JSON.stringify(context)}` : base;
}

const logger = {
  info(message, context) {
    console.log(format('INFO', message, context));
  },
  warn(message, context) {
    console.warn(format('WARN', message, context));
  },
  error(message, context) {
    console.error(format('ERROR', message, context));
  }
};

module.exports = logger;
