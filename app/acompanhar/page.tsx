"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Search, AlertCircle, FileAudio, ImageIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buscarDenuncia, buscarArquivo } from "../actions/denuncia-actions"

interface Arquivo {
  id: number
  nome_arquivo: string
  tipo: "image" | "audio"
  mime_type: string
  data?: string
}

interface Denuncia {
  id: number
  protocolo: string
  status: string
  data_criacao: string
  arquivos: Arquivo[]
}

export default function Acompanhar() {
  const [protocolo, setProtocolo] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [denuncia, setDenuncia] = useState<Denuncia | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [arquivosCarregados, setArquivosCarregados] = useState<{ [key: number]: boolean }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErro(null)
    setDenuncia(null)

    try {
      const resultado = await buscarDenuncia(protocolo)

      if (resultado.success) {
        setDenuncia(resultado.denuncia)
      } else {
        setErro(resultado.error || "Protocolo não encontrado")
      }
    } catch (error) {
      console.error("Erro ao buscar denúncia:", error)
      setErro("Erro ao buscar denúncia. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const carregarArquivo = async (arquivoId: number) => {
    if (arquivosCarregados[arquivoId]) return

    try {
      const resultado = await buscarArquivo(arquivoId)

      if (resultado.success) {
        setDenuncia((prev) => {
          if (!prev) return prev

          const arquivosAtualizados = prev.arquivos.map((arquivo) =>
            arquivo.id === arquivoId ? { ...arquivo, data: resultado.arquivo.data } : arquivo,
          )

          return { ...prev, arquivos: arquivosAtualizados }
        })

        setArquivosCarregados((prev) => ({ ...prev, [arquivoId]: true }))
      }
    } catch (error) {
      console.error("Erro ao carregar arquivo:", error)
    }
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

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">Acompanhar Denúncia</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Consultar Protocolo</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="protocolo">Número do Protocolo</Label>
                  <Input
                    id="protocolo"
                    placeholder="Digite o número do protocolo"
                    value={protocolo}
                    onChange={(e) => setProtocolo(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-green-700 hover:bg-green-800" disabled={isLoading}>
                  <Search className="mr-2 h-4 w-4" />
                  {isLoading ? "Consultando..." : "Consultar"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {denuncia && (
            <Card>
              <CardHeader>
                <CardTitle>Resultado da Consulta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Protocolo</p>
                    <p className="font-bold">{denuncia.protocolo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="font-medium">{denuncia.status}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Data de Registro</p>
                    <p>{new Date(denuncia.data_criacao).toLocaleDateString("pt-BR")}</p>
                  </div>

                  {denuncia.arquivos && denuncia.arquivos.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Evidências</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {denuncia.arquivos.map((arquivo) => (
                          <div
                            key={arquivo.id}
                            className="relative cursor-pointer"
                            onClick={() => carregarArquivo(arquivo.id)}
                          >
                            {arquivo.tipo === "image" ? (
                              <div className="aspect-square rounded-md overflow-hidden bg-gray-100 border">
                                {arquivo.data ? (
                                  <img
                                    src={arquivo.data || "/placeholder.svg"}
                                    alt="Evidência"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full">
                                    <ImageIcon className="h-8 w-8 text-gray-400" />
                                    <span className="ml-2 text-sm text-gray-500">Clique para carregar</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="aspect-square rounded-md overflow-hidden bg-gray-100 border flex items-center justify-center">
                                {arquivo.data ? (
                                  <div className="text-center p-2">
                                    <FileAudio className="h-8 w-8 mx-auto text-gray-500" />
                                    <audio controls src={arquivo.data} className="mt-2 w-full max-w-[120px]" />
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center justify-center">
                                    <FileAudio className="h-8 w-8 text-gray-400" />
                                    <span className="mt-2 text-sm text-gray-500">Clique para carregar</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <p className="text-sm text-gray-600">
                      Sua denúncia está sendo analisada pelas autoridades competentes. Consulte periodicamente para
                      acompanhar o andamento.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {erro && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Protocolo não encontrado</p>
                  <p className="text-sm text-gray-600">
                    Verifique se o número foi digitado corretamente e tente novamente.
                  </p>
                </div>
              </div>
            </div>
          )}
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
