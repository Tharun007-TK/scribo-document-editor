"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import type { Tool } from "@/components/pdf-editor"
import { ColorPicker } from "@/components/color-picker"

interface PdfPropertiesPanelProps {
  activeTool: Tool
  onClose: () => void
}

export function PdfPropertiesPanel({ activeTool, onClose }: PdfPropertiesPanelProps) {
  const [fontSize, setFontSize] = useState(12)
  const [lineWidth, setLineWidth] = useState(2)
  const [opacity, setOpacity] = useState(100)

  return (
    <div className="w-72 border-l bg-white flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold">Properties</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 flex-1 overflow-auto">
        <Tabs defaultValue="style">
          <TabsList className="w-full">
            <TabsTrigger value="style" className="flex-1">
              Style
            </TabsTrigger>
            <TabsTrigger value="position" className="flex-1">
              Position
            </TabsTrigger>
          </TabsList>

          <TabsContent value="style" className="mt-4 space-y-4">
            {(activeTool === "text" ||
              activeTool === "highlight" ||
              activeTool === "underline" ||
              activeTool === "strikethrough") && (
              <>
                <div className="space-y-2">
                  <Label>Font</Label>
                  <Select defaultValue="arial">
                    <SelectTrigger>
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="arial">Arial</SelectItem>
                      <SelectItem value="times">Times New Roman</SelectItem>
                      <SelectItem value="courier">Courier New</SelectItem>
                      <SelectItem value="helvetica">Helvetica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Font Size: {fontSize}pt</Label>
                  <Slider
                    value={[fontSize]}
                    min={8}
                    max={72}
                    step={1}
                    onValueChange={(value) => setFontSize(value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Color</Label>
                  <ColorPicker />
                </div>
              </>
            )}

            {(activeTool === "draw" || activeTool === "shape") && (
              <>
                <div className="space-y-2">
                  <Label>Line Width: {lineWidth}px</Label>
                  <Slider
                    value={[lineWidth]}
                    min={1}
                    max={20}
                    step={1}
                    onValueChange={(value) => setLineWidth(value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Stroke Color</Label>
                  <ColorPicker />
                </div>

                <div className="space-y-2">
                  <Label>Fill Color</Label>
                  <ColorPicker />
                </div>

                <div className="space-y-2">
                  <Label>Opacity: {opacity}%</Label>
                  <Slider
                    value={[opacity]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setOpacity(value[0])}
                  />
                </div>
              </>
            )}

            {activeTool === "image" && (
              <>
                <div className="space-y-2">
                  <Label>Border Width: {lineWidth}px</Label>
                  <Slider
                    value={[lineWidth]}
                    min={0}
                    max={10}
                    step={1}
                    onValueChange={(value) => setLineWidth(value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Border Color</Label>
                  <ColorPicker />
                </div>

                <div className="space-y-2">
                  <Label>Opacity: {opacity}%</Label>
                  <Slider
                    value={[opacity]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setOpacity(value[0])}
                  />
                </div>
              </>
            )}

            {activeTool === "form" && (
              <>
                <div className="space-y-2">
                  <Label>Field Type</Label>
                  <Select defaultValue="text">
                    <SelectTrigger>
                      <SelectValue placeholder="Select field type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text Field</SelectItem>
                      <SelectItem value="checkbox">Checkbox</SelectItem>
                      <SelectItem value="radio">Radio Button</SelectItem>
                      <SelectItem value="dropdown">Dropdown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Field Name</Label>
                  <Input placeholder="Enter field name" />
                </div>

                <div className="space-y-2">
                  <Label>Default Value</Label>
                  <Input placeholder="Enter default value" />
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="position" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>X Position</Label>
                <Input type="number" placeholder="X" />
              </div>
              <div className="space-y-2">
                <Label>Y Position</Label>
                <Input type="number" placeholder="Y" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Width</Label>
                <Input type="number" placeholder="Width" />
              </div>
              <div className="space-y-2">
                <Label>Height</Label>
                <Input type="number" placeholder="Height" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Rotation: 0°</Label>
              <Slider value={[0]} min={0} max={360} step={1} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
