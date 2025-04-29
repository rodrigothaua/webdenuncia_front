import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Shield, FileText } from "lucide-react"

export default function Aviso() {
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
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="h-8 w-8 text-green-700" />
            <h1 className="text-3xl font-bold">Web Denúncia</h1>
          </div>

          <div className="space-y-6 text-gray-700">
            <p>
              A partir de agora você entrou num ambiente seguro, com certificação digital, para que possa fazer suas
              denúncias com total tranquilidade.
            </p>

            <p>
              O Web Denúncia é um serviço via internet à disposição da população de todo o Estado de Rondônia, em
              complementação ao Disque Denúncia 181. Não é necessário identificar-se para fazer a denúncia e o sigilo
              das informações será preservado.
            </p>

            <p>As providências tomadas pela polícia poderão ser acompanhadas através de uma senha.</p>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
              <p className="font-bold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                ATENÇÃO!!!
              </p>
              <p>Não se identifique! Caso se identifique, sua denúncia será descartada.</p>
            </div>

            <p className="font-medium">Escolha uma opção abaixo:</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/denuncia">
                <Button size="lg" className="bg-green-700 hover:bg-green-800 w-full sm:w-auto">
                  <FileText className="mr-2 h-5 w-5" />
                  Denunciar
                </Button>
              </Link>
              <Link href="/acompanhar">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Acompanhar Denúncia
                </Button>
              </Link>
            </div>
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
