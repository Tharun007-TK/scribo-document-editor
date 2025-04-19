"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { PdfTemplates } from "@/components/pdf-templates"
import type { Template } from "@/components/pdf-templates"

interface PdfTemplateModalProps {
  open: boolean
  onClose: () => void
  onSelectTemplate: (template: Template) => void
}

export function PdfTemplateModal({ open, onClose, onSelectTemplate }: PdfTemplateModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <PdfTemplates onSelectTemplate={onSelectTemplate} onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
}
