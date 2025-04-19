"use client"

import { useRef, useEffect, useState } from "react"
import type { PdfDocument, Tool } from "@/components/pdf-editor"
import { cn } from "@/lib/utils"

interface PdfCanvasProps {
  document: PdfDocument
  activeTool: Tool
  zoom: number
  isEditing: boolean
}

export function PdfCanvas({ document, activeTool, zoom, isEditing }: PdfCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [cursorStyle, setCursorStyle] = useState<string>("default")

  // Set cursor style based on active tool
  useEffect(() => {
    switch (activeTool) {
      case "select":
        setCursorStyle("default")
        break
      case "text":
        setCursorStyle("text")
        break
      case "image":
        setCursorStyle("copy")
        break
      case "draw":
        setCursorStyle("crosshair")
        break
      case "highlight":
      case "underline":
      case "strikethrough":
        setCursorStyle("text")
        break
      case "shape":
        setCursorStyle("crosshair")
        break
      case "signature":
        setCursorStyle("pointer")
        break
      case "form":
        setCursorStyle("cell")
        break
      case "comment":
        setCursorStyle("help")
        break
      default:
        setCursorStyle("default")
    }
  }, [activeTool])

  // Render the PDF page
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions based on zoom
    const pageWidth = 612 // Standard US Letter width in points (8.5 x 72)
    const pageHeight = 792 // Standard US Letter height in points (11 x 72)

    canvas.width = pageWidth * (zoom / 100)
    canvas.height = pageHeight * (zoom / 100)

    // Clear canvas
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw page content (in a real app, this would render the actual PDF)
    ctx.fillStyle = "#f8f9fa"
    ctx.fillRect(50 * (zoom / 100), 50 * (zoom / 100), 512 * (zoom / 100), 692 * (zoom / 100))

    // Check if this is a template document
    const isTemplate = document.id.startsWith("template-")
    const templateId = isTemplate ? document.id.replace("template-", "") : null

    // Draw template-specific content
    if (isTemplate) {
      if (templateId?.includes("invoice")) {
        drawInvoiceTemplate(ctx, canvas.width, canvas.height, zoom)
      } else if (templateId?.includes("letterhead")) {
        drawLetterheadTemplate(ctx, canvas.width, canvas.height, zoom)
      } else if (templateId?.includes("resume")) {
        drawResumeTemplate(ctx, canvas.width, canvas.height, zoom)
      } else if (templateId?.includes("flyer")) {
        drawFlyerTemplate(ctx, canvas.width, canvas.height, zoom)
      } else {
        // Generic template content
        drawGenericTemplate(ctx, canvas.width, canvas.height, zoom, document.name)
      }
    } else {
      // Draw default content for non-template documents
      if (document.currentPage === 1) {
        ctx.font = `bold ${24 * (zoom / 100)}px sans-serif`
        ctx.fillStyle = "black"
        ctx.textAlign = "center"
        ctx.fillText("Sample PDF Document", canvas.width / 2, 100 * (zoom / 100))

        ctx.font = `${14 * (zoom / 100)}px sans-serif`
        ctx.fillText("This is a sample document for the PDF Editor", canvas.width / 2, 150 * (zoom / 100))
      } else {
        ctx.font = `bold ${18 * (zoom / 100)}px sans-serif`
        ctx.fillStyle = "black"
        ctx.textAlign = "center"
        ctx.fillText(`Content for Page ${document.currentPage}`, canvas.width / 2, 100 * (zoom / 100))
      }
    }

    // Draw page number
    ctx.fillStyle = "black"
    ctx.font = `${12 * (zoom / 100)}px sans-serif`
    ctx.textAlign = "center"
    ctx.fillText(
      `Page ${document.currentPage} of ${document.pages.length}`,
      canvas.width / 2,
      canvas.height - 20 * (zoom / 100),
    )

    // Draw editing indicators if in editing mode
    if (isEditing) {
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2 * (zoom / 100)
      ctx.setLineDash([5 * (zoom / 100), 5 * (zoom / 100)])
      ctx.strokeRect(
        40 * (zoom / 100),
        40 * (zoom / 100),
        canvas.width - 80 * (zoom / 100),
        canvas.height - 80 * (zoom / 100),
      )
      ctx.setLineDash([])
    }
  }, [document.currentPage, document.pages.length, document.id, document.name, zoom, isEditing])

  const drawInvoiceTemplate = (ctx: CanvasRenderingContext2D, width: number, height: number, zoom: number) => {
    const scale = zoom / 100

    // Header
    ctx.fillStyle = "#4f46e5"
    ctx.fillRect(50 * scale, 50 * scale, width - 100 * scale, 80 * scale)

    ctx.fillStyle = "white"
    ctx.font = `bold ${24 * scale}px sans-serif`
    ctx.textAlign = "left"
    ctx.fillText("INVOICE", 70 * scale, 100 * scale)

    // Company info
    ctx.fillStyle = "black"
    ctx.font = `bold ${14 * scale}px sans-serif`
    ctx.fillText("Your Company Name", 70 * scale, 160 * scale)

    ctx.font = `${12 * scale}px sans-serif`
    ctx.fillText("123 Business Street", 70 * scale, 180 * scale)
    ctx.fillText("City, State 12345", 70 * scale, 200 * scale)
    ctx.fillText("Phone: (123) 456-7890", 70 * scale, 220 * scale)

    // Client info
    ctx.font = `bold ${14 * scale}px sans-serif`
    ctx.fillText("Bill To:", 400 * scale, 160 * scale)

    ctx.font = `${12 * scale}px sans-serif`
    ctx.fillText("Client Name", 400 * scale, 180 * scale)
    ctx.fillText("Client Address", 400 * scale, 200 * scale)
    ctx.fillText("City, State 12345", 400 * scale, 220 * scale)

    // Invoice details
    ctx.font = `bold ${12 * scale}px sans-serif`
    ctx.fillText("Invoice Number:", 400 * scale, 260 * scale)
    ctx.fillText("Date:", 400 * scale, 280 * scale)
    ctx.fillText("Due Date:", 400 * scale, 300 * scale)

    ctx.font = `${12 * scale}px sans-serif`
    ctx.fillText("INV-12345", 500 * scale, 260 * scale)
    ctx.fillText("01/01/2023", 500 * scale, 280 * scale)
    ctx.fillText("01/31/2023", 500 * scale, 300 * scale)

    // Table header
    ctx.fillStyle = "#f3f4f6"
    ctx.fillRect(70 * scale, 340 * scale, width - 140 * scale, 30 * scale)

    ctx.fillStyle = "black"
    ctx.font = `bold ${12 * scale}px sans-serif`
    ctx.fillText("Item", 90 * scale, 360 * scale)
    ctx.fillText("Description", 200 * scale, 360 * scale)
    ctx.fillText("Quantity", 350 * scale, 360 * scale)
    ctx.fillText("Price", 430 * scale, 360 * scale)
    ctx.fillText("Amount", 510 * scale, 360 * scale)

    // Table rows
    ctx.font = `${12 * scale}px sans-serif`
    ctx.fillText("Item 1", 90 * scale, 390 * scale)
    ctx.fillText("Product description", 200 * scale, 390 * scale)
    ctx.fillText("2", 350 * scale, 390 * scale)
    ctx.fillText("$100.00", 430 * scale, 390 * scale)
    ctx.fillText("$200.00", 510 * scale, 390 * scale)

    ctx.fillText("Item 2", 90 * scale, 420 * scale)
    ctx.fillText("Service description", 200 * scale, 420 * scale)
    ctx.fillText("5", 350 * scale, 420 * scale)
    ctx.fillText("$75.00", 430 * scale, 420 * scale)
    ctx.fillText("$375.00", 510 * scale, 420 * scale)

    // Total
    ctx.fillStyle = "#f3f4f6"
    ctx.fillRect(350 * scale, 460 * scale, width - 420 * scale, 90 * scale)

    ctx.fillStyle = "black"
    ctx.font = `bold ${12 * scale}px sans-serif`
    ctx.fillText("Subtotal:", 430 * scale, 480 * scale)
    ctx.fillText("Tax (10%):", 430 * scale, 510 * scale)
    ctx.fillText("Total:", 430 * scale, 540 * scale)

    ctx.textAlign = "right"
    ctx.font = `${12 * scale}px sans-serif`
    ctx.fillText("$575.00", 530 * scale, 480 * scale)
    ctx.fillText("$57.50", 530 * scale, 510 * scale)
    ctx.fillText("$632.50", 530 * scale, 540 * scale)

    // Footer
    ctx.textAlign = "center"
    ctx.font = `${10 * scale}px sans-serif`
    ctx.fillText("Thank you for your business!", width / 2, 600 * scale)
  }

  const drawLetterheadTemplate = (ctx: CanvasRenderingContext2D, width: number, height: number, zoom: number) => {
    const scale = zoom / 100

    // Header
    ctx.fillStyle = "#4f46e5"
    ctx.fillRect(50 * scale, 50 * scale, width - 100 * scale, 60 * scale)

    ctx.fillStyle = "white"
    ctx.font = `bold ${20 * scale}px sans-serif`
    ctx.textAlign = "left"
    ctx.fillText("COMPANY NAME", 70 * scale, 90 * scale)

    // Contact info
    ctx.fillStyle = "black"
    ctx.font = `${10 * scale}px sans-serif`
    ctx.fillText(
      "123 Business Street, City, State 12345 | Phone: (123) 456-7890 | Email: info@company.com",
      70 * scale,
      130 * scale,
    )

    // Horizontal line
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1 * scale
    ctx.beginPath()
    ctx.moveTo(50 * scale, 150 * scale)
    ctx.lineTo(width - 50 * scale, 150 * scale)
    ctx.stroke()

    // Date
    ctx.fillStyle = "black"
    ctx.font = `${12 * scale}px sans-serif`
    ctx.fillText("January 1, 2023", 70 * scale, 190 * scale)

    // Recipient
    ctx.font = `${12 * scale}px sans-serif`
    ctx.fillText("Recipient Name", 70 * scale, 230 * scale)
    ctx.fillText("Recipient Company", 70 * scale, 250 * scale)
    ctx.fillText("123 Recipient Street", 70 * scale, 270 * scale)
    ctx.fillText("City, State 12345", 70 * scale, 290 * scale)

    // Salutation
    ctx.fillText("Dear Recipient,", 70 * scale, 330 * scale)

    // Body placeholder
    ctx.fillText(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et",
      70 * scale,
      370 * scale,
    )
    ctx.fillText(
      "dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip",
      70 * scale,
      390 * scale,
    )
    ctx.fillText(
      "ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu",
      70 * scale,
      410 * scale,
    )
    ctx.fillText(
      "fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt",
      70 * scale,
      430 * scale,
    )
    ctx.fillText("mollit anim id est laborum.", 70 * scale, 450 * scale)

    // Closing
    ctx.fillText("Sincerely,", 70 * scale, 510 * scale)
    ctx.fillText("Your Name", 70 * scale, 550 * scale)
    ctx.fillText("Your Title", 70 * scale, 570 * scale)

    // Footer
    ctx.fillStyle = "#4f46e5"
    ctx.fillRect(50 * scale, height - 80 * scale, width - 100 * scale, 30 * scale)

    ctx.fillStyle = "white"
    ctx.font = `${10 * scale}px sans-serif`
    ctx.textAlign = "center"
    ctx.fillText("www.company.com", width / 2, height - 60 * scale)
  }

  const drawResumeTemplate = (ctx: CanvasRenderingContext2D, width: number, height: number, zoom: number) => {
    const scale = zoom / 100

    // Header
    ctx.fillStyle = "#4f46e5"
    ctx.fillRect(50 * scale, 50 * scale, width - 100 * scale, 100 * scale)

    ctx.fillStyle = "white"
    ctx.font = `bold ${28 * scale}px sans-serif`
    ctx.textAlign = "center"
    ctx.fillText("YOUR NAME", width / 2, 100 * scale)

    ctx.font = `${14 * scale}px sans-serif`
    ctx.fillText("Professional Title", width / 2, 130 * scale)

    // Contact info
    ctx.fillStyle = "black"
    ctx.font = `${10 * scale}px sans-serif`
    ctx.textAlign = "center"
    ctx.fillText(
      "123 Your Street, City, State 12345 | Phone: (123) 456-7890 | Email: your.email@example.com",
      width / 2,
      170 * scale,
    )

    // Summary
    ctx.textAlign = "left"
    ctx.font = `bold ${16 * scale}px sans-serif`
    ctx.fillText("PROFESSIONAL SUMMARY", 70 * scale, 210 * scale)

    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1 * scale
    ctx.beginPath()
    ctx.moveTo(70 * scale, 220 * scale)
    ctx.lineTo(width - 70 * scale, 220 * scale)
    ctx.stroke()

    ctx.font = `${12 * scale}px sans-serif`
    ctx.fillText(
      "Experienced professional with a proven track record of success in [industry]. Skilled in [skill 1], [skill 2],",
      70 * scale,
      240 * scale,
    )
    ctx.fillText("and [skill 3] with a focus on delivering exceptional results.", 70 * scale, 260 * scale)

    // Experience
    ctx.font = `bold ${16 * scale}px sans-serif`
    ctx.fillText("EXPERIENCE", 70 * scale, 300 * scale)

    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1 * scale
    ctx.beginPath()
    ctx.moveTo(70 * scale, 310 * scale)
    ctx.lineTo(width - 70 * scale, 310 * scale)
    ctx.stroke()

    ctx.font = `bold ${14 * scale}px sans-serif`
    ctx.fillText("JOB TITLE", 70 * scale, 330 * scale)

    ctx.font = `italic ${12 * scale}px sans-serif`
    ctx.fillText("Company Name | City, State | MM/YYYY - Present", 70 * scale, 350 * scale)

    ctx.font = `${12 * scale}px sans-serif`
    ctx.fillText("• Accomplishment 1 that demonstrates your skills and impact", 90 * scale, 370 * scale)
    ctx.fillText("• Accomplishment 2 with quantifiable results", 90 * scale, 390 * scale)
    ctx.fillText("• Accomplishment 3 showing leadership or initiative", 90 * scale, 410 * scale)

    // Education
    ctx.font = `bold ${16 * scale}px sans-serif`
    ctx.fillText("EDUCATION", 70 * scale, 450 * scale)

    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1 * scale
    ctx.beginPath()
    ctx.moveTo(70 * scale, 460 * scale)
    ctx.lineTo(width - 70 * scale, 460 * scale)
    ctx.stroke()

    ctx.font = `bold ${14 * scale}px sans-serif`
    ctx.fillText("DEGREE NAME", 70 * scale, 480 * scale)

    ctx.font = `italic ${12 * scale}px sans-serif`
    ctx.fillText("University Name | City, State | Graduation Year", 70 * scale, 500 * scale)

    // Skills
    ctx.font = `bold ${16 * scale}px sans-serif`
    ctx.fillText("SKILLS", 70 * scale, 540 * scale)

    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1 * scale
    ctx.beginPath()
    ctx.moveTo(70 * scale, 550 * scale)
    ctx.lineTo(width - 70 * scale, 550 * scale)
    ctx.stroke()

    ctx.font = `${12 * scale}px sans-serif`
    ctx.fillText("• Skill 1", 90 * scale, 570 * scale)
    ctx.fillText("• Skill 2", 90 * scale, 590 * scale)
    ctx.fillText("• Skill 3", 90 * scale, 610 * scale)
    ctx.fillText("• Skill 4", 90 * scale, 590 * scale)
    ctx.fillText("• Skill 3", 90 * scale, 610 * scale)
    ctx.fillText("• Skill 4", 90 * scale, 630 * scale)
    ctx.fillText("• Skill 5", 90 * scale, 650 * scale)
  }

  const drawFlyerTemplate = (ctx: CanvasRenderingContext2D, width: number, height: number, zoom: number) => {
    const scale = zoom / 100

    // Background
    ctx.fillStyle = "#4f46e5"
    ctx.fillRect(50 * scale, 50 * scale, width - 100 * scale, height - 100 * scale)

    // Header
    ctx.fillStyle = "white"
    ctx.font = `bold ${36 * scale}px sans-serif`
    ctx.textAlign = "center"
    ctx.fillText("EVENT TITLE", width / 2, 150 * scale)

    // Subtitle
    ctx.font = `${18 * scale}px sans-serif`
    ctx.fillText("Subtitle or Tagline Goes Here", width / 2, 190 * scale)

    // Image placeholder
    ctx.fillStyle = "#8b5cf6"
    ctx.fillRect(width / 2 - 150 * scale, 220 * scale, 300 * scale, 200 * scale)

    ctx.strokeStyle = "white"
    ctx.lineWidth = 2 * scale
    ctx.strokeRect(width / 2 - 150 * scale, 220 * scale, 300 * scale, 200 * scale)

    ctx.fillStyle = "white"
    ctx.font = `${14 * scale}px sans-serif`
    ctx.fillText("IMAGE", width / 2, 320 * scale)

    // Details
    ctx.font = `bold ${18 * scale}px sans-serif`
    ctx.fillText("DATE & TIME", width / 2, 460 * scale)

    ctx.font = `${14 * scale}px sans-serif`
    ctx.fillText("Month Day, Year | 00:00 AM - 00:00 PM", width / 2, 490 * scale)

    ctx.font = `bold ${18 * scale}px sans-serif`
    ctx.fillText("LOCATION", width / 2, 530 * scale)

    ctx.font = `${14 * scale}px sans-serif`
    ctx.fillText("Venue Name", width / 2, 560 * scale)
    ctx.fillText("123 Street Address, City, State 12345", width / 2, 580 * scale)

    // Contact
    ctx.font = `${12 * scale}px sans-serif`
    ctx.fillText("For more information: (123) 456-7890 | email@example.com | website.com", width / 2, 640 * scale)
  }

  const drawGenericTemplate = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    zoom: number,
    templateName: string,
  ) => {
    const scale = zoom / 100

    // Header
    ctx.fillStyle = "#4f46e5"
    ctx.fillRect(50 * scale, 50 * scale, width - 100 * scale, 80 * scale)

    ctx.fillStyle = "white"
    ctx.font = `bold ${24 * scale}px sans-serif`
    ctx.textAlign = "center"
    ctx.fillText(templateName, width / 2, 100 * scale)

    // Content placeholder
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1 * scale
    ctx.strokeRect(70 * scale, 170 * scale, width - 140 * scale, height - 250 * scale)

    ctx.fillStyle = "#9ca3af"
    ctx.font = `${14 * scale}px sans-serif`
    ctx.fillText("Content Area", width / 2, height / 2)

    // Footer
    ctx.fillStyle = "#f3f4f6"
    ctx.fillRect(50 * scale, height - 100 * scale, width - 100 * scale, 50 * scale)

    ctx.fillStyle = "#4b5563"
    ctx.font = `${10 * scale}px sans-serif`
    ctx.fillText("Template Footer", width / 2, height - 75 * scale)
  }

  return (
    <div ref={containerRef} className="relative shadow-lg bg-white" style={{ cursor: cursorStyle }}>
      <canvas
        ref={canvasRef}
        className={cn("transition-shadow", isEditing && "shadow-[0_0_0_1px_rgba(59,130,246,0.5)]")}
      />
    </div>
  )
}
