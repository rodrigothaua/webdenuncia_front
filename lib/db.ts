import mysql from "serverless-mysql"

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: Number.parseInt(process.env.MYSQL_PORT || "3306"),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    // Adicionar configurações para melhorar a estabilidade da conexão
    connectTimeout: 10000, // 10 segundos
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  },
})

export async function query(q: string, values: any[] = []) {
  try {
    console.log(`Executando query: ${q}`)
    const results = await db.query(q, values)
    await db.end()
    return results
  } catch (error) {
    console.error("Erro na consulta ao banco de dados:", error)

    // Tentar reconectar em caso de erro de conexão
    if (
      (error as any).code === "PROTOCOL_CONNECTION_LOST" ||
      (error as any).code === "ECONNREFUSED" ||
      (error as any).code === "ER_ACCESS_DENIED_ERROR"
    ) {
      console.log("Tentando reconectar ao banco de dados...")
      try {
        await db.connect()
        const results = await db.query(q, values)
        await db.end()
        return results
      } catch (reconnectError) {
        console.error("Falha na reconexão:", reconnectError)
        throw new Error(`Falha na reconexão com o banco de dados: ${(reconnectError as Error).message}`)
      }
    }

    throw new Error(`Erro ao executar consulta no banco de dados: ${(error as Error).message}`)
  }
}

export default db
