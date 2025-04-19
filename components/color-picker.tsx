"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const COLORS = [
  "#000000",
  "#5c5c5c",
  "#929292",
  "#c7c7c7",
  "#ffffff",
  "#ff0000",
  "#ff7b00",
  "#ffcb00",
  "#00ff00",
  "#00ffff",
  "#0000ff",
  "#7b00ff",
  "#cb00ff",
  "#ff00cb",
  "#ff007b",
]

export function ColorPicker() {
  const [color, setColor] = useState("#000000")

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <div className="w-4 h-4 rounded-sm mr-2 border" style={{ backgroundColor: color }} />
          {color}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid grid-cols-5 gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              className="w-8 h-8 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        <div className="flex items-center mt-4">
          <div className="flex-1">
            <label className="text-xs text-gray-500">Custom</label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full p-1 text-xs border rounded"
            />
          </div>
          <div className="ml-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded overflow-hidden"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
