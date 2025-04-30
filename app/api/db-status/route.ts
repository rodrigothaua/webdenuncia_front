import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    // Verificar se podemos conectar ao banco de dados
    const result = await query("SELECT 1 as test")

    // Verificar se as tabelas existem
    const tables = await query(
      `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ?
    `,
      [process.env.MYSQL_DATABASE],
    )

    const tableNames = (tables as any[]).map((t) => t.table_name)

    return NextResponse.json({
      success: true,
      message: "Conexão com o banco de dados estabelecida com sucesso!",
      tables: tableNames,
      env: {
        host: process.env.MYSQL_HOST ? "Configurado" : "Não configurado",
        database: process.env.MYSQL_DATABASE ? "Configurado" : "Não configurado",
        user: process.env.MYSQL_USER ? "Configurado" : "Não configurado",
        // Não exibimos a senha por segurança
      },
    })
  } catch (error) {
    console.error("Erro ao verificar status do banco de dados:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao conectar ao banco de dados",
        error: (error as Error).message,
        env: {
          host: process.env.MYSQL_HOST ? "Configurado" : "Não configurado",
          database: process.env.MYSQL_DATABASE ? "Configurado" : "Não configurado",
          user: process.env.MYSQL_USER ? "Configurado" : "Não configurado",
          // Não exibimos a senha por segurança
        },
      },
      { status: 500 },
    )
  }
}
