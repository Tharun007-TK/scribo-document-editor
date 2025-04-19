"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PdfImportModalProps {
  onClose: () => void
  onImport: (file: File) => void
}

export function PdfImportModal({ onClose, onImport }: PdfImportModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile)
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file",
          variant: "destructive",
        })
      }
    }
  }

  const handleImport = () => {
    if (file) {
      onImport(file)
      onClose()
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import PDF</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">{file ? file.name : "Drop your file here"}</h3>
            <p className="text-sm text-gray-500 mb-4">
              {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "or click to browse (PDF files only)"}
            </p>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button variant="outline" size="sm">
              Select File
            </Button>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="url">Or import from URL</Label>
            <div className="flex gap-2">
              <Input id="url" placeholder="https://example.com/document.pdf" />
              <Button variant="outline">Fetch</Button>
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between w-full">
          <Button
            variant="outline"
            onClick={() => {
              onClose()
              // This would typically be handled by the parent component
              // but we're adding this for convenience
              const event = new CustomEvent("openTemplates")
              window.dispatchEvent(event)
            }}
          >
            Use Template
          </Button>
          <div>
            <Button variant="outline" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!file}>
              Import
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
