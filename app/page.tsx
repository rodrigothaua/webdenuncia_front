import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-green-700 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <a href="/">
              <h1 className="text-xl font-bold">Web Denúncia - Rondônia</h1>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full text-center space-y-8">
          <h1 className="text-4xl font-bold">Sistema de Denúncia Anônima</h1>
          <p className="text-lg">
            Faça sua denúncia de forma segura e anônima. Todas as informações são protegidas e encaminhadas às
            autoridades competentes.
          </p>
          <div className="flex justify-center">
            <Link href="/aviso">
              <Button size="lg" className="bg-green-700 hover:bg-green-800">
                Fazer Denúncia
              </Button>
            </Link>
          </div>
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              Em caso de emergência, ligue para 190. O Web Denúncia é um serviço complementar ao Disque Denúncia 181.
            </p>
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
