"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Search, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Acompanhar() {
  const [protocolo, setProtocolo] = useState("")
  const [resultado, setResultado] = useState<null | "encontrado" | "nao-encontrado">(null)
  const [status, setStatus] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Verificar se o protocolo existe no localStorage (simulação)
    const storedProtocolo = localStorage.getItem("protocoloDenuncia")

    if (storedProtocolo && storedProtocolo === protocolo) {
      setResultado("encontrado")
      // Simular um status aleatório
      const statusOptions = [
        "Em análise inicial",
        "Encaminhada para investigação",
        "Em investigação",
        "Aguardando informações adicionais",
        "Concluída",
      ]
      const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)]
      setStatus(randomStatus)
    } else {
      setResultado("nao-encontrado")
      setStatus("")
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
                <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                  <Search className="mr-2 h-4 w-4" />
                  Consultar
                </Button>
              </form>
            </CardContent>
          </Card>

          {resultado === "encontrado" && (
            <Card>
              <CardHeader>
                <CardTitle>Resultado da Consulta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Protocolo</p>
                    <p className="font-bold">{protocolo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="font-medium">{status}</p>
                  </div>
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

          {resultado === "nao-encontrado" && (
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
