"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, CheckCircle, Copy } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function Confirmacao() {
  const router = useRouter()
  const [protocolo, setProtocolo] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Recuperar o protocolo do localStorage
    const storedProtocolo = localStorage.getItem("protocoloDenuncia")
    if (storedProtocolo) {
      setProtocolo(storedProtocolo)

      // Aqui poderíamos enviar os dados para o banco de dados novamente
      // caso não tenha sido feito na página de resumo
      // const formData = localStorage.getItem("denunciaFormData")
      // const files = localStorage.getItem("denunciaFiles")
      // if (formData) {
      //   const dadosParaEnviar = {
      //     ...JSON.parse(formData),
      //     arquivos: files ? JSON.parse(files) : [],
      //     protocolo: storedProtocolo,
      //     dataEnvio: new Date().toISOString()
      //   }
      //   enviarParaBancoDeDados(dadosParaEnviar)
      // }

      // Limpar os dados do formulário após confirmação bem-sucedida
      // mas manter o protocolo para consultas futuras
      localStorage.removeItem("denunciaFormData")
      localStorage.removeItem("denunciaFiles")
    } else {
      // Se não houver protocolo, redirecionar para a página inicial
      router.push("/")
    }
  }, [router])

  const handleCopyProtocolo = () => {
    if (protocolo) {
      navigator.clipboard.writeText(protocolo)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!protocolo) {
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

      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold">Denúncia Registrada com Sucesso!</h1>
            <p className="text-gray-600 mt-2">
              Sua denúncia foi registrada e será analisada pelas autoridades competentes.
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Seu número de protocolo é:</p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <p className="text-2xl font-bold">{protocolo}</p>
                  <button
                    onClick={handleCopyProtocolo}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Copiar protocolo"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
                {copied && <p className="text-green-600 text-sm">Protocolo copiado!</p>}
                <p className="text-sm text-gray-600 mt-4">
                  Guarde este número para acompanhar o andamento da sua denúncia.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            <Link href="/acompanhar">
              <Button variant="outline" className="w-full">
                Acompanhar Denúncia
              </Button>
            </Link>
            <Link href="/">
              <Button className="w-full bg-green-700 hover:bg-green-800">Voltar para a Página Inicial</Button>
            </Link>
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
