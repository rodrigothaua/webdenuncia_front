"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Shield, FileAudio, ImageIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { salvarDenuncia } from "../actions/denuncia-actions"

interface FormData {
  // Ocorrência
  local: string
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  uf: string
  detalhes: string

  // Denunciado
  nomeDenunciado: string
  apelidoDenunciado: string
  idadeDenunciado: string
  caracteristicasDenunciado: string

  // Vítima
  nomeVitima: string
  idadeVitima: string
  relacionamentoVitima: string
}

interface FileData {
  id: string
  name: string
  mimeType: string
  data: string
  type: "image" | "audio"
}

export default function Resumo() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData | null>(null)
  const [files, setFiles] = useState<FileData[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Recuperar os dados do formulário do localStorage
    const storedData = localStorage.getItem("denunciaFormData")
    if (storedData) {
      setFormData(JSON.parse(storedData))
    } else {
      // Se não houver dados, redirecionar para a página de denúncia
      router.push("/denuncia")
    }

    // Recuperar os arquivos do localStorage
    const storedFiles = localStorage.getItem("denunciaFiles")
    if (storedFiles) {
      setFiles(JSON.parse(storedFiles))
    }
  }, [router])

  const handleSubmit = async () => {
    if (!formData) return

    setIsSubmitting(true)

    try {
      // Enviar os dados para o servidor usando a Server Action
      const result = await salvarDenuncia(formData, files)

      if (result.success) {
        // Armazenar o protocolo no localStorage para consulta posterior
        localStorage.setItem("protocoloDenuncia", result.protocolo)

        // Limpar os dados do formulário
        localStorage.removeItem("denunciaFormData")
        localStorage.removeItem("denunciaFiles")

        // Redirecionar para a página de confirmação
        router.push("/confirmacao")
      } else {
        alert("Erro ao enviar denúncia. Por favor, tente novamente.")
      }
    } catch (error) {
      console.error("Erro ao enviar denúncia:", error)
      alert("Erro ao enviar denúncia. Por favor, tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!formData) {
    return <div>Carregando...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-green-700 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <h1 className="text-xl font-bold">Web Denúncia - Rondônia</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Resumo da Denúncia</h1>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dados da Ocorrência</CardTitle>
                <CardDescription>Verifique se as informações estão corretas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Local da Ocorrência</p>
                    <p>{formData.local || "Não informado"}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">CEP</p>
                    <p>{formData.cep || "Não informado"}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Endereço</p>
                  <p>
                    {formData.logradouro ? `${formData.logradouro}, ${formData.numero || "S/N"}` : "Não informado"}
                    {formData.complemento ? `, ${formData.complemento}` : ""}
                    {formData.bairro ? `, ${formData.bairro}` : ""}
                    {formData.cidade ? ` - ${formData.cidade}` : ""}
                    {formData.uf ? `/${formData.uf}` : ""}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Detalhes da Ocorrência</p>
                  <p className="whitespace-pre-line">{formData.detalhes || "Não informado"}</p>
                </div>

                {files.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Evidências</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {files.map((file) => (
                        <div key={file.id} className="relative">
                          {file.type === "image" ? (
                            <div className="aspect-square rounded-md overflow-hidden bg-gray-100 border">
                              <img
                                src={file.data || "/placeholder.svg"}
                                alt="Evidência"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 flex items-center">
                                <ImageIcon className="h-3 w-3 mr-1" />
                                <span className="truncate">Foto</span>
                              </div>
                            </div>
                          ) : (
                            <div className="aspect-square rounded-md overflow-hidden bg-gray-100 border flex items-center justify-center">
                              <div className="text-center p-2">
                                <FileAudio className="h-8 w-8 mx-auto text-gray-500" />
                                <p className="text-xs text-gray-500 mt-2 truncate max-w-full">Áudio</p>
                                <audio controls src={file.data} className="mt-2 w-full max-w-[120px]" />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dados do Denunciado</CardTitle>
                <CardDescription>Verifique se as informações estão corretas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nome</p>
                    <p>{formData.nomeDenunciado || "Não informado"}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Apelido</p>
                    <p>{formData.apelidoDenunciado || "Não informado"}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Idade Aproximada</p>
                  <p>{formData.idadeDenunciado || "Não informado"}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Características e Informações Adicionais</p>
                  <p className="whitespace-pre-line">{formData.caracteristicasDenunciado || "Não informado"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dados da Vítima</CardTitle>
                <CardDescription>Verifique se as informações estão corretas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nome</p>
                    <p>{formData.nomeVitima || "Não informado"}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Idade Aproximada</p>
                    <p>{formData.idadeVitima || "Não informado"}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Relacionamento com o Denunciado</p>
                  <p>{formData.relacionamentoVitima || "Não informado"}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 flex justify-end">
            <Button onClick={handleSubmit} className="bg-green-700 hover:bg-green-800" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Finalizar Denúncia"}
            </Button>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 p-4 text-center text-sm text-gray-600">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} - Governo de Rondônia</p>
        </div>
      </footer>
    </div>
  )
}
