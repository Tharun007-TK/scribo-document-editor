"use client"

import { useState, useRef, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PdfToolbar } from "@/components/pdf-toolbar"
import { PdfSidebar } from "@/components/pdf-sidebar"
import { PdfCanvas } from "@/components/pdf-canvas"
import { PdfStatusBar } from "@/components/pdf-status-bar"
import { PdfPropertiesPanel } from "@/components/pdf-properties-panel"
import { PdfImportModal } from "@/components/pdf-import-modal"
import { PdfExportModal } from "@/components/pdf-export-modal"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PdfTemplateModal, type Template } from "@/components/pdf-templates"

export type PdfPage = {
  id: string
  pageNumber: number
  thumbnail: string
}

export type PdfDocument = {
  id: string
  name: string
  pages: PdfPage[]
  currentPage: number
}

export type Tool =
  | "select"
  | "text"
  | "image"
  | "draw"
  | "highlight"
  | "underline"
  | "strikethrough"
  | "shape"
  | "signature"
  | "form"
  | "comment"

export function PdfEditor() {
  const [document, setDocument] = useState<PdfDocument | null>(null)
  const [activeTool, setActiveTool] = useState<Tool>("select")
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showProperties, setShowProperties] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [isEditing, setIsEditing] = useState(false)
  const dropzoneRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const [showTemplateModal, setShowTemplateModal] = useState(false)

  // Handle file drop
  useEffect(() => {
    const dropzone = dropzoneRef.current

    if (!dropzone) return

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dropzone.classList.add("border-primary")
    }

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dropzone.classList.remove("border-primary")
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dropzone.classList.remove("border-primary")

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0]
        if (file.type === "application/pdf") {
          handleFileImport(file)
        } else {
          toast({
            title: "Invalid file type",
            description: "Please upload a PDF file",
            variant: "destructive",
          })
        }
      }
    }

    dropzone.addEventListener("dragover", handleDragOver)
    dropzone.addEventListener("dragleave", handleDragLeave)
    dropzone.addEventListener("drop", handleDrop)

    return () => {
      dropzone.removeEventListener("dragover", handleDragOver)
      dropzone.removeEventListener("dragleave", handleDragLeave)
      dropzone.removeEventListener("drop", handleDrop)
    }
  }, [toast])

  // Handle template button click from import modal
  useEffect(() => {
    const handleOpenTemplates = () => {
      setShowTemplateModal(true)
    }

    window.addEventListener("openTemplates", handleOpenTemplates)

    return () => {
      window.removeEventListener("openTemplates", handleOpenTemplates)
    }
  }, [])

  const handleFileImport = (file: File) => {
    // In a real implementation, we would use PDF.js to parse the PDF
    // For this demo, we'll create a mock document
    const mockPages: PdfPage[] = Array.from({ length: 5 }, (_, i) => ({
      id: `page-${i + 1}`,
      pageNumber: i + 1,
      thumbnail: `/placeholder.svg?height=200&width=150`,
    }))

    setDocument({
      id: "doc-1",
      name: file.name,
      pages: mockPages,
      currentPage: 1,
    })

    toast({
      title: "PDF imported",
      description: `${file.name} has been imported successfully.`,
    })
  }

  const handleExport = (format: string) => {
    toast({
      title: "PDF exported",
      description: `Document has been exported as ${format.toUpperCase()}.`,
    })
    setShowExportModal(false)
  }

  const handleToolChange = (tool: Tool) => {
    setActiveTool(tool)
    setIsEditing(tool !== "select")
  }

  const handlePageChange = (pageNumber: number) => {
    if (document) {
      setDocument({
        ...document,
        currentPage: pageNumber,
      })
    }
  }

  const handlePageReorder = (sourceIndex: number, destinationIndex: number) => {
    if (document) {
      const newPages = [...document.pages]
      const [removed] = newPages.splice(sourceIndex, 1)
      newPages.splice(destinationIndex, 0, removed)

      // Update page numbers
      const updatedPages = newPages.map((page, index) => ({
        ...page,
        pageNumber: index + 1,
      }))

      setDocument({
        ...document,
        pages: updatedPages,
        currentPage: destinationIndex + 1,
      })

      toast({
        title: "Pages reordered",
        description: "Document pages have been reordered.",
      })
    }
  }

  const handleAddPage = () => {
    if (document) {
      const newPageNumber = document.pages.length + 1
      const newPage: PdfPage = {
        id: `page-${newPageNumber}`,
        pageNumber: newPageNumber,
        thumbnail: `/placeholder.svg?height=200&width=150`,
      }

      setDocument({
        ...document,
        pages: [...document.pages, newPage],
        currentPage: newPageNumber,
      })

      toast({
        title: "Page added",
        description: "A new page has been added to the document.",
      })
    }
  }

  const handleDeletePage = (pageNumber: number) => {
    if (document && document.pages.length > 1) {
      const newPages = document.pages.filter((page) => page.pageNumber !== pageNumber)

      // Update page numbers
      const updatedPages = newPages.map((page, index) => ({
        ...page,
        pageNumber: index + 1,
      }))

      const newCurrentPage =
        document.currentPage > pageNumber
          ? document.currentPage - 1
          : document.currentPage === pageNumber
            ? Math.min(document.currentPage, updatedPages.length)
            : document.currentPage

      setDocument({
        ...document,
        pages: updatedPages,
        currentPage: newCurrentPage,
      })

      toast({
        title: "Page deleted",
        description: "The page has been removed from the document.",
      })
    } else {
      toast({
        title: "Cannot delete page",
        description: "A document must have at least one page.",
        variant: "destructive",
      })
    }
  }

  const handleTemplateSelect = (template: Template) => {
    // In a real implementation, we would load the template content
    // For this demo, we'll create a mock document based on the template
    const mockPages: PdfPage[] = Array.from({ length: template.pages }, (_, i) => ({
      id: `page-${i + 1}`,
      pageNumber: i + 1,
      thumbnail: template.thumbnail,
    }))

    setDocument({
      id: `template-${template.id}`,
      name: template.name,
      pages: mockPages,
      currentPage: 1,
    })

    setShowTemplateModal(false)
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b bg-white p-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">PDF Editor</h1>
          <Tabs defaultValue="home" className="w-auto">
            <TabsList>
              <TabsTrigger value="home">Home</TabsTrigger>
              <TabsTrigger value="insert">Insert</TabsTrigger>
              <TabsTrigger value="annotations">Annotations</TabsTrigger>
              <TabsTrigger value="forms">Forms</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowImportModal(true)}>
            Import
          </Button>
          <Button variant="outline" onClick={() => setShowExportModal(true)} disabled={!document}>
            Export
          </Button>
          <Button
            variant="default"
            onClick={() => {
              toast({
                title: "Document saved",
                description: "Your document has been saved successfully.",
              })
            }}
            disabled={!document}
          >
            Save
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {document ? (
          <>
            {/* Sidebar */}
            <PdfSidebar
              document={document}
              onPageChange={handlePageChange}
              onPageReorder={handlePageReorder}
              onAddPage={handleAddPage}
              onDeletePage={handleDeletePage}
            />

            {/* Main Editor */}
            <div className="flex flex-col flex-1 overflow-hidden">
              <PdfToolbar
                activeTool={activeTool}
                onToolChange={handleToolChange}
                zoom={zoom}
                onZoomChange={setZoom}
                onToggleProperties={() => setShowProperties(!showProperties)}
              />
              <div className="flex-1 overflow-auto bg-gray-100 p-8 flex justify-center">
                <PdfCanvas document={document} activeTool={activeTool} zoom={zoom} isEditing={isEditing} />
              </div>
              <PdfStatusBar currentPage={document.currentPage} totalPages={document.pages.length} zoom={zoom} />
            </div>

            {/* Properties Panel */}
            {showProperties && <PdfPropertiesPanel activeTool={activeTool} onClose={() => setShowProperties(false)} />}
          </>
        ) : (
          // Empty State / Drop Zone
          <div
            ref={dropzoneRef}
            className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 m-4 rounded-lg transition-colors"
          >
            <Upload className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Start with a PDF</h2>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              Drag and drop a PDF file, or choose one of the options below
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => setShowImportModal(true)}>Import PDF</Button>
              <Button variant="outline" onClick={() => setShowTemplateModal(true)}>
                Use Template
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showImportModal && <PdfImportModal onClose={() => setShowImportModal(false)} onImport={handleFileImport} />}
      {showExportModal && <PdfExportModal onClose={() => setShowExportModal(false)} onExport={handleExport} />}
      {showTemplateModal && (
        <PdfTemplateModal
          open={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          onSelectTemplate={handleTemplateSelect}
        />
      )}
    </div>
  )
}
