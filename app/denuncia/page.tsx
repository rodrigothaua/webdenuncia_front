"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Shield, AlertTriangle, Camera, Mic, X, ImageIcon, FileAudio } from "lucide-react"
import { CrimeHappeningModal } from "@/components/modals/crime-happening-modal"
import { TrustedDeviceModal } from "@/components/modals/trusted-device-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface FileWithPreview {
  id: string
  file: File
  preview: string
  type: "image" | "audio"
}

export default function Denuncia() {
  const router = useRouter()
  const [showCrimeModal, setShowCrimeModal] = useState(false)
  const [showDeviceModal, setShowDeviceModal] = useState(false)
  const [cep, setCep] = useState("")
  const [endereco, setEndereco] = useState({
    logradouro: "",
    bairro: "",
    cidade: "",
    uf: "",
  })
  const [formData, setFormData] = useState({
    // Ocorrência
    local: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    detalhes: "",

    // Denunciado
    nomeDenunciado: "",
    apelidoDenunciado: "",
    idadeDenunciado: "",
    caracteristicasDenunciado: "",

    // Vítima
    nomeVitima: "",
    idadeVitima: "",
    relacionamentoVitima: "",
  })

  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [maxRecordingTime] = useState(60) // 60 segundos máximo

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Mostrar o primeiro modal quando a página carrega
    setShowCrimeModal(true)

    // Carregar dados do formulário do localStorage, se existirem
    const savedFormData = localStorage.getItem("denunciaFormData")
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData)
      setFormData(parsedData)

      // Atualizar o CEP também se existir
      if (parsedData.cep) {
        setCep(parsedData.cep)
      }
    }

    // Carregar arquivos do localStorage
    const savedFiles = localStorage.getItem("denunciaFiles")
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles)
        // Converter os dados base64 de volta para arquivos
        const loadedFiles = parsedFiles.map((fileData: any) => {
          // Criar um blob a partir dos dados base64
          const byteString = atob(fileData.data.split(",")[1])
          const ab = new ArrayBuffer(byteString.length)
          const ia = new Uint8Array(ab)
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
          }
          const blob = new Blob([ab], { type: fileData.mimeType })
          const file = new File([blob], fileData.name, { type: fileData.mimeType })

          return {
            id: fileData.id,
            file,
            preview: fileData.data,
            type: fileData.type,
          }
        })
        setFiles(loadedFiles)
      } catch (error) {
        console.error("Erro ao carregar arquivos:", error)
      }
    }

    // Limpar quando o componente for desmontado
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  // Salvar arquivos no localStorage quando mudam
  useEffect(() => {
    if (files.length > 0) {
      // Converter arquivos para formato que pode ser salvo no localStorage
      const filesToSave = files.map(async (fileItem) => {
        return {
          id: fileItem.id,
          name: fileItem.file.name,
          mimeType: fileItem.file.type,
          data: fileItem.preview,
          type: fileItem.type,
        }
      })

      Promise.all(filesToSave).then((savedFiles) => {
        localStorage.setItem("denunciaFiles", JSON.stringify(savedFiles))
      })
    } else {
      localStorage.removeItem("denunciaFiles")
    }
  }, [files])

  const handleCrimeModalClose = (isHappening: boolean) => {
    setShowCrimeModal(false)
    if (isHappening) {
      // Redirecionar para o telefone 190
      window.location.href = "tel:190"
    } else {
      // Mostrar o próximo modal
      setShowDeviceModal(true)
    }
  }

  const handleDeviceModalClose = (isTrusted: boolean) => {
    setShowDeviceModal(false)
    if (!isTrusted) {
      // Mostrar aviso, mas continuar mesmo assim
      alert("Recomendamos utilizar um dispositivo seguro para fazer sua denúncia.")
    }
  }

  const handleCepBlur = async () => {
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const data = await response.json()

        if (!data.erro) {
          setEndereco({
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            uf: data.uf,
          })

          const updatedFormData = {
            ...formData,
            cep,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            uf: data.uf,
          }

          setFormData(updatedFormData)

          // Salvar no localStorage após atualização do CEP
          localStorage.setItem("denunciaFormData", JSON.stringify(updatedFormData))
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const updatedFormData = {
      ...formData,
      [name]: value,
    }

    setFormData(updatedFormData)

    // Salvar no localStorage a cada alteração
    localStorage.setItem("denunciaFormData", JSON.stringify(updatedFormData))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você enviaria os dados para o backend
    // Como é apenas um exemplo, vamos simular o envio e redirecionar para a página de resumo

    // Armazenar os dados no localStorage para usar na página de resumo
    localStorage.setItem("denunciaData", JSON.stringify(formData))

    // Redirecionar para a página de resumo
    router.push("/resumo")
  }

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setCep(value)

    const updatedFormData = {
      ...formData,
      cep: value,
    }

    setFormData(updatedFormData)
    localStorage.setItem("denunciaFormData", JSON.stringify(updatedFormData))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: FileWithPreview[] = []

      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i]

        if (file.type.startsWith("image/")) {
          const reader = new FileReader()

          reader.onloadend = () => {
            const newFile: FileWithPreview = {
              id: `img-${Date.now()}-${i}`,
              file,
              preview: reader.result as string,
              type: "image",
            }

            setFiles((prevFiles) => [...prevFiles, newFile])
          }

          reader.readAsDataURL(file)
        }
      }

      // Limpar o input para permitir selecionar o mesmo arquivo novamente
      e.target.value = ""
    }
  }

  const handleAudioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      if (file.type.startsWith("audio/")) {
        const reader = new FileReader()

        reader.onloadend = () => {
          const newFile: FileWithPreview = {
            id: `audio-${Date.now()}`,
            file,
            preview: reader.result as string,
            type: "audio",
          }

          setFiles((prevFiles) => [...prevFiles, newFile])
        }

        reader.readAsDataURL(file)
      }

      // Limpar o input para permitir selecionar o mesmo arquivo novamente
      e.target.value = ""
    }
  }

  const handleRemoveFile = (id: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id))
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        const audioFile = new File([audioBlob], `gravacao-${Date.now()}.webm`, { type: "audio/webm" })

        const reader = new FileReader()
        reader.onloadend = () => {
          const newFile: FileWithPreview = {
            id: `audio-${Date.now()}`,
            file: audioFile,
            preview: reader.result as string,
            type: "audio",
          }

          setFiles((prevFiles) => [...prevFiles, newFile])
        }

        reader.readAsDataURL(audioBlob)

        // Parar todas as faixas do stream para liberar o microfone
        stream.getTracks().forEach((track) => track.stop())

        setIsRecording(false)
        setRecordingTime(0)
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current)
          recordingTimerRef.current = null
        }
      }

      mediaRecorder.start()
      setIsRecording(true)

      // Iniciar o timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= maxRecordingTime) {
            if (mediaRecorderRef.current) {
              mediaRecorderRef.current.stop()
            }
            return 0
          }
          return prev + 1
        })
      }, 1000)
    } catch (error) {
      console.error("Erro ao acessar o microfone:", error)
      alert("Não foi possível acessar o microfone. Verifique as permissões do navegador.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const triggerAudioInput = () => {
    if (audioInputRef.current) {
      audioInputRef.current.click()
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

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Formulário de Denúncia</h1>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="font-bold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              ATENÇÃO
            </p>
            <p>Não se identifique! Caso se identifique, sua denúncia será descartada.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="ocorrencia" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ocorrencia">Ocorrência</TabsTrigger>
                <TabsTrigger value="denunciado">Denunciado</TabsTrigger>
                <TabsTrigger value="vitima">Vítima</TabsTrigger>
              </TabsList>

              <TabsContent value="ocorrencia">
                <Card>
                  <CardHeader>
                    <CardTitle>Dados da Ocorrência</CardTitle>
                    <CardDescription>Informe os detalhes sobre o local e a natureza da ocorrência</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="local">Local da Ocorrência</Label>
                        <Input
                          id="local"
                          name="local"
                          placeholder="Ex: Residência, Via Pública, Estabelecimento Comercial"
                          value={formData.local}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cep">CEP (opcional)</Label>
                        <Input
                          id="cep"
                          name="cep"
                          placeholder="Apenas números"
                          value={cep}
                          onChange={handleCepChange}
                          onBlur={handleCepBlur}
                          maxLength={8}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="logradouro">Logradouro</Label>
                        <Input
                          id="logradouro"
                          name="logradouro"
                          placeholder="Rua, Avenida, etc."
                          value={formData.logradouro || endereco.logradouro}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="numero">Número</Label>
                        <Input
                          id="numero"
                          name="numero"
                          placeholder="Nº"
                          value={formData.numero}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="complemento">Complemento</Label>
                        <Input
                          id="complemento"
                          name="complemento"
                          placeholder="Apto, Bloco, etc."
                          value={formData.complemento}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bairro">Bairro</Label>
                        <Input
                          id="bairro"
                          name="bairro"
                          placeholder="Bairro"
                          value={formData.bairro || endereco.bairro}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2 md:col-span-3">
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input
                          id="cidade"
                          name="cidade"
                          placeholder="Cidade"
                          value={formData.cidade || endereco.cidade}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="uf">UF</Label>
                        <Input
                          id="uf"
                          name="uf"
                          placeholder="UF"
                          value={formData.uf || endereco.uf}
                          onChange={handleInputChange}
                          maxLength={2}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="detalhes">Detalhes da Ocorrência</Label>
                      <Textarea
                        id="detalhes"
                        name="detalhes"
                        placeholder="Descreva com detalhes o que aconteceu, quando aconteceu e qualquer informação relevante para a investigação."
                        rows={6}
                        value={formData.detalhes}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Seção de upload de arquivos */}
                    <div className="space-y-4 pt-4 border-t">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Evidências</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Adicione fotos ou gravações de áudio relacionadas à ocorrência (opcional)
                        </p>

                        <div className="flex flex-wrap gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={triggerFileInput}
                            className="flex items-center gap-2"
                          >
                            <Camera className="h-4 w-4" />
                            <span>Adicionar Foto</span>
                          </Button>

                          <Input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                            capture="environment"
                          />

                          <Button
                            type="button"
                            variant="outline"
                            onClick={triggerAudioInput}
                            className="flex items-center gap-2"
                          >
                            <FileAudio className="h-4 w-4" />
                            <span>Selecionar Áudio</span>
                          </Button>

                          <Input
                            ref={audioInputRef}
                            type="file"
                            accept="audio/*"
                            className="hidden"
                            onChange={handleAudioChange}
                          />

                          {!isRecording ? (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={startRecording}
                              className="flex items-center gap-2"
                            >
                              <Mic className="h-4 w-4" />
                              <span>Gravar Áudio</span>
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={stopRecording}
                              className="flex items-center gap-2"
                            >
                              <span>Parar Gravação ({maxRecordingTime - recordingTime}s)</span>
                            </Button>
                          )}
                        </div>

                        {isRecording && (
                          <div className="mt-4">
                            <Progress value={(recordingTime / maxRecordingTime) * 100} className="h-2" />
                          </div>
                        )}
                      </div>

                      {/* Visualização dos arquivos */}
                      {files.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                          {files.map((file) => (
                            <div key={file.id} className="relative group">
                              {file.type === "image" ? (
                                <div className="aspect-square rounded-md overflow-hidden bg-gray-100 border">
                                  <ImageIcon
                                    src={file.preview || "/placeholder.svg"}
                                    alt="Evidência"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="aspect-square rounded-md overflow-hidden bg-gray-100 border flex items-center justify-center">
                                  <div className="text-center p-2">
                                    <FileAudio className="h-8 w-8 mx-auto text-gray-500" />
                                    <p className="text-xs text-gray-500 mt-2 truncate max-w-full">{file.file.name}</p>
                                    <audio controls src={file.preview} className="mt-2 w-full max-w-[120px]" />
                                  </div>
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(file.id)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remover arquivo"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="denunciado">
                <Card>
                  <CardHeader>
                    <CardTitle>Dados do Denunciado</CardTitle>
                    <CardDescription>Informe os dados da pessoa que está sendo denunciada</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nomeDenunciado">Nome do Denunciado (se souber)</Label>
                        <Input
                          id="nomeDenunciado"
                          name="nomeDenunciado"
                          placeholder="Nome completo"
                          value={formData.nomeDenunciado}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="apelidoDenunciado">Apelido (se souber)</Label>
                        <Input
                          id="apelidoDenunciado"
                          name="apelidoDenunciado"
                          placeholder="Apelido ou nome conhecido"
                          value={formData.apelidoDenunciado}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="idadeDenunciado">Idade Aproximada</Label>
                      <Input
                        id="idadeDenunciado"
                        name="idadeDenunciado"
                        placeholder="Ex: 25-30 anos"
                        value={formData.idadeDenunciado}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="caracteristicasDenunciado">
                        Características Físicas e Informações Adicionais
                      </Label>
                      <Textarea
                        id="caracteristicasDenunciado"
                        name="caracteristicasDenunciado"
                        placeholder="Descreva características físicas, vestimentas, comportamentos, locais frequentados, veículos utilizados, etc."
                        rows={6}
                        value={formData.caracteristicasDenunciado}
                        onChange={handleInputChange}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vitima">
                <Card>
                  <CardHeader>
                    <CardTitle>Dados da Vítima</CardTitle>
                    <CardDescription>Informe os dados da vítima (se houver)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nomeVitima">Nome da Vítima (se souber)</Label>
                        <Input
                          id="nomeVitima"
                          name="nomeVitima"
                          placeholder="Nome completo"
                          value={formData.nomeVitima}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="idadeVitima">Idade Aproximada</Label>
                        <Input
                          id="idadeVitima"
                          name="idadeVitima"
                          placeholder="Ex: 25-30 anos"
                          value={formData.idadeVitima}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="relacionamentoVitima">Relacionamento com o Denunciado</Label>
                      <Input
                        id="relacionamentoVitima"
                        name="relacionamentoVitima"
                        placeholder="Ex: Familiar, Vizinho, Desconhecido"
                        value={formData.relacionamentoVitima}
                        onChange={handleInputChange}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-8 flex justify-end">
              <Button type="submit" className="bg-green-700 hover:bg-green-800">
                Prosseguir para Resumo
              </Button>
            </div>
          </form>
        </div>
      </main>

      <footer className="bg-gray-100 p-4 text-center text-sm text-gray-600">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} - Governo de Rondônia</p>
        </div>
      </footer>

      {showCrimeModal && <CrimeHappeningModal onClose={handleCrimeModalClose} />}
      {showDeviceModal && <TrustedDeviceModal onClose={handleDeviceModalClose} />}
    </div>
  )
}
