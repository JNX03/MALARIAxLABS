"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertToast } from "@/components/ui/alert-toast"
import { Loader2, Upload, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("upload")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSelectedFile(file)

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0] || null
    setSelectedFile(file)

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleCameraCapture = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
      } catch (err) {
        console.error("Error accessing the camera:", err)
      }
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" })
            setSelectedFile(file)
            setPreviewUrl(canvasRef.current?.toDataURL() || null)
          }
        }, "image/jpeg")
      }
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    setAlertMessage("Analysis submitted to queue")

    // Simulate analysis process with delays
    await new Promise((resolve) => setTimeout(resolve, 5000))
    setAlertMessage("Analysis in progress")

    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsAnalyzing(false)
    setShowResultDialog(true)
    setAlertMessage(null)
  }

  const viewResults = () => {
    setShowResultDialog(false)
    router.push("/results")
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Error signing out: ", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-black/50 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-2xl font-bold text-primary">
                  MALARIA RURAL LABS
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Button onClick={handleLogout} variant="ghost">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Malaria Cell Analysis Dashboard</h1>

        {alertMessage && (
          <AlertToast className="mb-4" onClose={() => setAlertMessage(null)}>
            {alertMessage}
          </AlertToast>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Cell Image Analysis</CardTitle>
                <CardDescription>Upload a blood cell image or capture one with your device camera</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload Image</TabsTrigger>
                    <TabsTrigger value="camera">Use Camera</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload" className="mt-4">
                    <div
                      className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={triggerFileInput}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      {previewUrl ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={previewUrl || "/placeholder.svg"}
                            alt="Preview"
                            className="max-h-[300px] max-w-full mb-4 rounded-md"
                          />
                          <p className="text-sm text-muted-foreground">
                            {selectedFile?.name} ({Math.round((selectedFile?.size || 0) / 1024)} KB)
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground mb-1">Drag and drop your cell image here</p>
                          <p className="text-xs text-muted-foreground">or click to browse files</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="camera" className="mt-4">
                    <div className="flex flex-col items-center justify-center p-10 border rounded-lg">
                      {previewUrl && activeTab === "camera" ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={previewUrl || "/placeholder.svg"}
                            alt="Camera capture"
                            className="max-h-[300px] max-w-full mb-4 rounded-md"
                          />
                          <p className="text-sm text-muted-foreground mb-4">Camera capture</p>
                          <Button onClick={handleCameraCapture}>Capture Again</Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <video ref={videoRef} className="mb-4 rounded-md" style={{ display: "none" }}></video>
                          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
                          {videoRef.current?.srcObject ? (
                            <Button onClick={captureImage}>Capture Image</Button>
                          ) : (
                            <Button onClick={handleCameraCapture}>Start Camera</Button>
                          )}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <Button onClick={handleAnalyze} disabled={!selectedFile || isAnalyzing} className="w-full">
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Cell Image"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Analysis Guidelines</CardTitle>
                <CardDescription>Tips for optimal cell image analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Image Quality</AlertTitle>
                  <AlertDescription>Ensure the blood smear image is clear, well-lit, and in focus.</AlertDescription>
                </Alert>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Staining</AlertTitle>
                  <AlertDescription>
                    Giemsa-stained blood smears provide the best results for malaria detection.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Magnification</AlertTitle>
                  <AlertDescription>Images taken at 100x oil immersion magnification are recommended.</AlertDescription>
                </Alert>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Processing Time</AlertTitle>
                  <AlertDescription>
                    Analysis typically takes 5-10 seconds depending on image complexity.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Analysis Complete
              </DialogTitle>
              <DialogDescription>Your cell image has been successfully analyzed.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p>
                The analysis of your blood cell image is now complete. View the detailed results to see the diagnosis,
                parasite type, and recommended actions.
              </p>
            </div>
            <DialogFooter>
              <Button onClick={viewResults}>View Results</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

