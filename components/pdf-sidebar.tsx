"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, Trash2 } from "lucide-react"
import type { PdfDocument } from "@/components/pdf-editor"
import { cn } from "@/lib/utils"

interface PdfSidebarProps {
  document: PdfDocument
  onPageChange: (pageNumber: number) => void
  onPageReorder: (sourceIndex: number, destinationIndex: number) => void
  onAddPage: () => void
  onDeletePage: (pageNumber: number) => void
}

export function PdfSidebar({ document, onPageChange, onPageReorder, onAddPage, onDeletePage }: PdfSidebarProps) {
  const [draggingPage, setDraggingPage] = useState<number | null>(null)

  const handleDragStart = (pageNumber: number) => {
    setDraggingPage(pageNumber)
  }

  const handleDragOver = (e: React.DragEvent, pageNumber: number) => {
    e.preventDefault()
    e.currentTarget.classList.add("border-primary")
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("border-primary")
  }

  const handleDrop = (e: React.DragEvent, targetPageNumber: number) => {
    e.preventDefault()
    e.currentTarget.classList.remove("border-primary")

    if (draggingPage !== null && draggingPage !== targetPageNumber) {
      onPageReorder(draggingPage - 1, targetPageNumber - 1)
    }

    setDraggingPage(null)
  }

  return (
    <div className="w-64 border-r bg-white flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold">Pages</h2>
        <Button variant="ghost" size="sm" onClick={onAddPage}>
          <PlusCircle className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 grid gap-4">
          {document.pages.map((page) => (
            <div
              key={page.id}
              className={cn(
                "border rounded-md overflow-hidden cursor-pointer transition-all",
                document.currentPage === page.pageNumber && "ring-2 ring-primary",
              )}
              onClick={() => onPageChange(page.pageNumber)}
              draggable
              onDragStart={() => handleDragStart(page.pageNumber)}
              onDragOver={(e) => handleDragOver(e, page.pageNumber)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, page.pageNumber)}
            >
              <div className="relative">
                <img
                  src={page.thumbnail || "/placeholder.svg"}
                  alt={`Page ${page.pageNumber}`}
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 flex justify-between items-center">
                  <span>Page {page.pageNumber}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-white hover:text-white hover:bg-red-500/50"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeletePage(page.pageNumber)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
