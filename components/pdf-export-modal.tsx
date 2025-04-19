"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface PdfExportModalProps {
  onClose: () => void
  onExport: (format: string) => void
}

export function PdfExportModal({ onClose, onExport }: PdfExportModalProps) {
  const [format, setFormat] = useState("pdf")
  const [filename, setFilename] = useState("document")

  const handleExport = () => {
    onExport(format)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Document</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="filename">Filename</Label>
            <Input id="filename" value={filename} onChange={(e) => setFilename(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label>Format</Label>
            <RadioGroup value={format} onValueChange={setFormat}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf">PDF</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="docx" id="docx" />
                <Label htmlFor="docx">Word Document (.docx)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pptx" id="pptx" />
                <Label htmlFor="pptx">PowerPoint (.pptx)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="txt" id="txt" />
                <Label htmlFor="txt">Text File (.txt)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="png" id="png" />
                <Label htmlFor="png">Image (.png)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="jpg" id="jpg" />
                <Label htmlFor="jpg">Image (.jpg)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label>Options</Label>
            <div className="flex items-center space-x-2">
              <Checkbox id="compress" />
              <Label htmlFor="compress">Compress output file</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="password" />
              <Label htmlFor="password">Password protect</Label>
            </div>
            {format === "pdf" && (
              <div className="flex items-center space-x-2">
                <Checkbox id="optimize" />
                <Label htmlFor="optimize">Optimize for web</Label>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport}>Export</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
