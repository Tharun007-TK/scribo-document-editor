"\"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export interface Template {
  id: string
  name: string
  category: string
  thumbnail: string
  pages: number
  description: string
}

interface PdfTemplatesProps {
  onSelectTemplate: (template: Template) => void
  onClose: () => void
}

export function PdfTemplates({ onSelectTemplate, onClose }: PdfTemplatesProps) {
  const [category, setCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const { toast } = useToast()

  const templates: Template[] = [
    {
      id: "invoice-basic",
      name: "Basic Invoice",
      category: "business",
      thumbnail: "/placeholder.svg?height=200&width=150&text=Invoice",
      pages: 1,
      description: "A clean, professional invoice template with itemized billing.",
    },
    {
      id: "invoice-detailed",
      name: "Detailed Invoice",
      category: "business",
      thumbnail: "/placeholder.svg?height=200&width=150&text=Detailed+Invoice",
      pages: 2,
      description: "A comprehensive invoice with payment terms and conditions.",
    },
    {
      id: "letterhead-corporate",
      name: "Corporate Letterhead",
      category: "business",
      thumbnail: "/placeholder.svg?height=200&width=150&text=Letterhead",
      pages: 1,
      description: "Professional letterhead with company branding and contact information.",
    },
    {
      id: "report-business",
      name: "Business Report",
      category: "business",
      thumbnail: "/placeholder.svg?height=200&width=150&text=Business+Report",
      pages: 5,
      description: "Structured business report with executive summary and data sections.",
    },
    {
      id: "resume-modern",
      name: "Modern Resume",
      category: "personal",
      thumbnail: "/placeholder.svg?height=200&width=150&text=Resume",
      pages: 1,
      description: "Clean, modern resume layout highlighting skills and experience.",
    },
    {
      id: "cover-letter",
      name: "Cover Letter",
      category: "personal",
      thumbnail: "/placeholder.svg?height=200&width=150&text=Cover+Letter",
      pages: 1,
      description: "Professional cover letter template with matching resume style.",
    },
    {
      id: "essay-academic",
      name: "Academic Essay",
      category: "academic",
      thumbnail: "/placeholder.svg?height=200&width=150&text=Essay",
      pages: 3,
      description: "Properly formatted academic essay with citations and bibliography.",
    },
    {
      id: "research-paper",
      name: "Research Paper",
      category: "academic",
      thumbnail: "/placeholder.svg?height=200&width=150&text=Research+Paper",
      pages: 8,
      description: "Complete research paper template with abstract and references.",
    },
    {
      id: "flyer-event",
      name: "Event Flyer",
      category: "marketing",
      thumbnail: "/placeholder.svg?height=200&width=150&text=Event+Flyer",
      pages: 1,
      description: "Eye-catching event flyer with customizable graphics and text.",
    },
    {
      id: "brochure-trifold",
      name: "Tri-fold Brochure",
      category: "marketing",
      thumbnail: "/placeholder.svg?height=200&width=150&text=Brochure",
      pages: 2,
      description: "Professional tri-fold brochure template for product or service marketing.",
    },
    {
      id: "newsletter",
      name: "Newsletter",
      category: "marketing",
      thumbnail: "/placeholder.svg?height=200&width=150&text=Newsletter",
      pages: 4,
      description: "Multi-page newsletter template with article layouts and image placeholders.",
    },
    {
      id: "contract-simple",
      name: "Simple Contract",
      category: "legal",
      thumbnail: "/placeholder.svg?height=200&width=150&text=Contract",
      pages: 3,
      description: "Basic contract template with standard legal clauses and signature fields.",
    },
    {
      id: "nda-agreement",
      name: "NDA Agreement",
      category: "legal",
      thumbnail: "/placeholder.svg?height=200&width=150&text=NDA",
      pages: 2,
      description: "Non-disclosure agreement template with customizable terms.",
    },
    {
      id: "certificate",
      name: "Certificate",
      category: "other",
      thumbnail: "/placeholder.svg?height=200&width=150&text=Certificate",
      pages: 1,
      description: "Professional certificate of achievement or completion.",
    },
    {
      id: "calendar",
      name: "Calendar",
      category: "other",
      thumbnail: "/placeholder.svg?height=200&width=150&text=Calendar",
      pages: 12,
      description: "Monthly calendar template with customizable dates and events.",
    },
  ]

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = category === "all" || template.category === category
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleSelectTemplate = (template: Template) => {
    toast({
      title: "Template selected",
      description: `${template.name} template has been loaded.`,
    })
    onSelectTemplate(template)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search templates..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Tabs defaultValue="all" value={category} onValueChange={setCategory}>
          <TabsList className="w-full justify-start overflow-auto py-1">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="legal">Legal</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="border rounded-md overflow-hidden cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleSelectTemplate(template)}
            >
              <div className="relative aspect-[3/4] bg-gray-100">
                <Image
                  src={template.thumbnail || "/placeholder.svg"}
                  alt={template.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm">{template.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {template.pages} page{template.pages > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

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
