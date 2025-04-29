"use client"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface CrimeHappeningModalProps {
  onClose: (isHappening: boolean) => void
}

export function CrimeHappeningModal({ onClose }: CrimeHappeningModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="h-8 w-8 text-green-600" />
          <h2 className="text-xl font-bold">O crime está acontecendo agora?</h2>
        </div>

        <p className="mb-6 text-gray-700">Caso o crime esteja acontecendo agora, recomendamos ligar para o 190.</p>

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
