import mysql from "serverless-mysql"
import { logger } from "./logger"

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: Number.parseInt(process.env.MYSQL_PORT || "3306"),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  },
})

// Modificar a função query para usar o logger
export async function query(q: string, values: any[] = []) {
  try {
    logger.debug("Executando query", { query: q })
    const results = await db.query(q, values)
    await db.end()
    return results
  } catch (error) {
    logger.error("Database query error", { error, query: q })
    // Tentar reconectar em caso de erro de conexão
    if ((error as any).code === "PROTOCOL_CONNECTION_LOST") {
      logger.info("Tentando reconectar ao banco de dados...")
      await db.connect()
      return await db.query(q, values)
    }
    throw new Error(`Erro ao executar consulta no banco de dados: ${(error as Error).message}`)
  }
}

export default db