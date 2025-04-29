"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface TrustedDeviceModalProps {
  onClose: (isTrusted: boolean) => void
}

export function TrustedDeviceModal({ onClose }: TrustedDeviceModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-8 w-8 text-yellow-500" />
          <h2 className="text-xl font-bold">Está acessando este site de um lugar e equipamento confiáveis?</h2>
        </div>

        <div className="mb-6 text-gray-700 space-y-3">
          <p>
            Não recomendamos a utilização de equipamentos instalados em locais públicos e de propriedade de terceiros,
            tais como lanhouses e telecentros. É desejável que você utilize um equipamento num ambiente que possa ter
            privacidade.
          </p>
          <p>
            A utilização de equipamentos instalados em empresas poderá eventualmente impossibilitar o acesso ao Web
            Denúncia, devido a barreiras tecnológicas colocadas pela empresa, tais como firewall e outros mecanismos de
            proteção.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button variant="outline" onClick={() => onClose(false)}>
            Não
          </Button>
          <Button className="bg-green-700 hover:bg-green-800" onClick={() => onClose(true)}>
            Sim
          </Button>
        </div>
      </div>
    </div>
  )
}
