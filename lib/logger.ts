type LogLevel = "info" | "warn" | "error" | "debug"

export const logger = {
  info: (message: string, data?: any) => log("info", message, data),
  warn: (message: string, data?: any) => log("warn", message, data),
  error: (message: string, data?: any) => log("error", message, data),
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV !== "production") {
      log("debug", message, data)
    }
  },
}

function log(level: LogLevel, message: string, data?: any) {
  const timestamp = new Date().toISOString()
  const logData = data ? JSON.stringify(data) : ""

  const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message} ${logData}`

  switch (level) {
    case "error":
      console.error(formattedMessage)
      break
    case "warn":
      console.warn(formattedMessage)
      break
    case "debug":
      console.debug(formattedMessage)
      break
    default:
      console.log(formattedMessage)
  }

  // Aqui você poderia adicionar integração com serviços de monitoramento
  // como Sentry, LogRocket, etc.
}