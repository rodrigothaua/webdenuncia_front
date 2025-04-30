import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET() {
  try {
    // Verificar se o banco de dados existe
    console.log("Verificando banco de dados webdenuncia_db")

    try {
      await db.query(`USE webdenuncia_db`)
      console.log("Banco de dados webdenuncia_db selecionado com sucesso")
    } catch (dbError) {
      console.error("Erro ao selecionar banco de dados:", dbError)
      return NextResponse.json(
        {
          success: false,
          message: "Erro ao selecionar banco de dados webdenuncia_db",
          error: (dbError as Error).message,
        },
        { status: 500 },
      )
    }

    // Criar tabela de denúncias
    console.log("Criando tabela denuncias")
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS denuncias (
          id INT AUTO_INCREMENT PRIMARY KEY,
          protocolo VARCHAR(10) NOT NULL UNIQUE,
          local VARCHAR(255),
          cep VARCHAR(8),
          logradouro VARCHAR(255),
          numero VARCHAR(20),
          complemento VARCHAR(255),
          bairro VARCHAR(255),
          cidade VARCHAR(255),
          uf VARCHAR(2),
          detalhes TEXT,
          nome_denunciado VARCHAR(255),
          apelido_denunciado VARCHAR(255),
          idade_denunciado VARCHAR(50),
          caracteristicas_denunciado TEXT,
          nome_vitima VARCHAR(255),
          idade_vitima VARCHAR(50),
          relacionamento_vitima VARCHAR(255),
          status ENUM('Em análise inicial', 'Encaminhada para investigação', 'Em investigação', 'Aguardando informações adicionais', 'Concluída') DEFAULT 'Em análise inicial',
          data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `)
      console.log("Tabela denuncias criada com sucesso")
    } catch (tableError) {
      console.error("Erro ao criar tabela denuncias:", tableError)
      return NextResponse.json(
        {
          success: false,
          message: "Erro ao criar tabela denuncias",
          error: (tableError as Error).message,
        },
        { status: 500 },
      )
    }

    // Criar tabela de arquivos
    console.log("Criando tabela arquivos")
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS arquivos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          denuncia_id INT NOT NULL,
          nome_arquivo VARCHAR(255) NOT NULL,
          tipo ENUM('image', 'audio') NOT NULL,
          mime_type VARCHAR(100) NOT NULL,
          conteudo LONGBLOB NOT NULL,
          data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (denuncia_id) REFERENCES denuncias(id) ON DELETE CASCADE
        )
      `)
      console.log("Tabela arquivos criada com sucesso")
    } catch (tableError) {
      console.error("Erro ao criar tabela arquivos:", tableError)
      return NextResponse.json(
        {
          success: false,
          message: "Erro ao criar tabela arquivos",
          error: (tableError as Error).message,
        },
        { status: 500 },
      )
    }

    // Criar índices
    console.log("Criando índices")
    try {
      await db.query(`CREATE INDEX IF NOT EXISTS idx_denuncias_protocolo ON denuncias(protocolo)`)
      await db.query(`CREATE INDEX IF NOT EXISTS idx_arquivos_denuncia ON arquivos(denuncia_id)`)
      console.log("Índices criados com sucesso")
    } catch (indexError) {
      console.error("Erro ao criar índices:", indexError)
      // Não retornar erro aqui, pois os índices não são críticos
    }

    await db.end()

    return NextResponse.json({
      success: true,
      message: "Tabelas criadas com sucesso no banco de dados webdenuncia_db!",
    })
  } catch (error) {
    console.error("Erro ao criar tabelas:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao criar tabelas",
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
