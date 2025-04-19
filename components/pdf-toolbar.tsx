"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  MousePointer,
  Type,
  ImageIcon,
  Pencil,
  Highlighter,
  Underline,
  StrikethroughIcon,
  Square,
  PenTool,
  FormInput,
  MessageSquare,
  ZoomIn,
  ZoomOut,
  Settings,
} from "lucide-react"
import type { Tool } from "@/components/pdf-editor"

interface PdfToolbarProps {
  activeTool: Tool
  onToolChange: (tool: Tool) => void
  zoom: number
  onZoomChange: (zoom: number) => void
  onToggleProperties: () => void
}

export function PdfToolbar({ activeTool, onToolChange, zoom, onZoomChange, onToggleProperties }: PdfToolbarProps) {
  return (
    <div className="bg-white border-b p-2 flex items-center gap-2 flex-wrap">
      <ToggleGroup type="single" value={activeTool} onValueChange={(value) => value && onToolChange(value as Tool)}>
        <ToggleGroupItem value="select" aria-label="Select tool">
          <MousePointer className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="text" aria-label="Text tool">
          <Type className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="image" aria-label="Image tool">
          <ImageIcon className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="draw" aria-label="Draw tool">
          <Pencil className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      <Separator orientation="vertical" className="h-8" />

      <ToggleGroup type="single" value={activeTool} onValueChange={(value) => value && onToolChange(value as Tool)}>
        <ToggleGroupItem value="highlight" aria-label="Highlight tool">
          <Highlighter className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline tool">
          <Underline className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="strikethrough" aria-label="Strikethrough tool">
          <StrikethroughIcon className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      <Separator orientation="vertical" className="h-8" />

      <ToggleGroup type="single" value={activeTool} onValueChange={(value) => value && onToolChange(value as Tool)}>
        <ToggleGroupItem value="shape" aria-label="Shape tool">
          <Square className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="signature" aria-label="Signature tool">
          <PenTool className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="form" aria-label="Form tool">
          <FormInput className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="comment" aria-label="Comment tool">
          <MessageSquare className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      <Separator orientation="vertical" className="h-8" />

      <div className="flex items-center gap-2 ml-auto">
        <Button variant="ghost" size="icon" onClick={() => onZoomChange(Math.max(25, zoom - 25))} disabled={zoom <= 25}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 w-48">
          <Slider
            value={[zoom]}
            min={25}
            max={400}
            step={25}
            onValueChange={(value) => onZoomChange(value[0])}
            className="w-32"
          />
          <span className="text-sm w-12">{zoom}%</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onZoomChange(Math.min(400, zoom + 25))}
          disabled={zoom >= 400}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-8" />
        <Button variant="ghost" size="icon" onClick={onToggleProperties}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
