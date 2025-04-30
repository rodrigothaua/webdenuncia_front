import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    // Tenta executar uma consulta simples para verificar a conexão
    const result = await query("SELECT 1 as test")

    return NextResponse.json({
      success: true,
      message: "Conexão com o banco de dados estabelecida com sucesso!",
      result,
    })
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao conectar ao banco de dados",
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}s