"use server"

import { query } from "@/lib/db"

// Tipo para os dados do formulário
interface DenunciaFormData {
  local: string
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  uf: string
  detalhes: string
  nomeDenunciado: string
  apelidoDenunciado: string
  idadeDenunciado: string
  caracteristicasDenunciado: string
  nomeVitima: string
  idadeVitima: string
  relacionamentoVitima: string
}

// Tipo para os arquivos
interface FileData {
  id: string
  name: string
  mimeType: string
  data: string
  type: "image" | "audio"
}

// Função para gerar um protocolo único
function gerarProtocolo() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Função para salvar uma denúncia no banco de dados
export async function salvarDenuncia(formData: DenunciaFormData, files: FileData[]) {
  try {
    // Gerar protocolo único
    const protocolo = gerarProtocolo()

    // Inserir a denúncia no banco de dados
    const result = await query(
      `INSERT INTO denuncias 
      (protocolo, local, cep, logradouro, numero, complemento, bairro, cidade, uf, detalhes, 
       nome_denunciado, apelido_denunciado, idade_denunciado, caracteristicas_denunciado,
       nome_vitima, idade_vitima, relacionamento_vitima)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        protocolo,
        formData.local,
        formData.cep,
        formData.logradouro,
        formData.numero,
        formData.complemento,
        formData.bairro,
        formData.cidade,
        formData.uf,
        formData.detalhes,
        formData.nomeDenunciado,
        formData.apelidoDenunciado,
        formData.idadeDenunciado,
        formData.caracteristicasDenunciado,
        formData.nomeVitima,
        formData.idadeVitima,
        formData.relacionamentoVitima,
      ],
    )

    // Obter o ID da denúncia inserida
    const denunciaId = (result as any).insertId

    // Inserir os arquivos, se houver
    if (files && files.length > 0) {
      for (const file of files) {
        // Extrair o conteúdo binário da string base64
        const base64Data = file.data.split(",")[1]
        const buffer = Buffer.from(base64Data, "base64")

        await query(
          `INSERT INTO arquivos (denuncia_id, nome_arquivo, tipo, mime_type, conteudo)
          VALUES (?, ?, ?, ?, ?)`,
          [denunciaId, file.name, file.type, file.mimeType, buffer],
        )
      }
    }

    return { success: true, protocolo }
  } catch (error) {
    console.error("Erro ao salvar denúncia:", error)
    return { success: false, error: "Erro ao salvar denúncia" }
  }
}

// Função para buscar uma denúncia pelo protocolo
export async function buscarDenuncia(protocolo: string) {
  try {
    const denuncias = await query("SELECT * FROM denuncias WHERE protocolo = ?", [protocolo])

    if (!denuncias || (denuncias as any[]).length === 0) {
      return { success: false, error: "Denúncia não encontrada" }
    }

    const denuncia = (denuncias as any[])[0]

    // Buscar arquivos relacionados
    const arquivos = await query("SELECT id, nome_arquivo, tipo, mime_type FROM arquivos WHERE denuncia_id = ?", [
      denuncia.id,
    ])

    return {
      success: true,
      denuncia: {
        ...denuncia,
        arquivos: arquivos || [],
      },
    }
  } catch (error) {
    console.error("Erro ao buscar denúncia:", error)
    return { success: false, error: "Erro ao buscar denúncia" }
  }
}

// Função para buscar o conteúdo de um arquivo específico
export async function buscarArquivo(arquivoId: number) {
  try {
    const arquivos = await query("SELECT * FROM arquivos WHERE id = ?", [arquivoId])

    if (!arquivos || (arquivos as any[]).length === 0) {
      return { success: false, error: "Arquivo não encontrado" }
    }

    const arquivo = (arquivos as any[])[0]

    // Converter o buffer para base64
    const base64 = Buffer.from(arquivo.conteudo).toString("base64")
    const dataUrl = `data:${arquivo.mime_type};base64,${base64}`

    return {
      success: true,
      arquivo: {
        ...arquivo,
        data: dataUrl,
      },
    }
  } catch (error) {
    console.error("Erro ao buscar arquivo:", error)
    return { success: false, error: "Erro ao buscar arquivo" }
  }
}
