"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddNoteModal } from "@/components/generic/note-modal"

export function NotesApp() {
  // Sample notes data
  const notes = Array(6).fill({
    title: "Title",
    description: "Description Lorem Ipsum dolor sit amet",
  })

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Add New Note button */}
        <div className="flex justify-end mb-8">
          <AddNoteModal />
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note, index) => (
            <Card
              key={index}
              className="border-2 rounded-3xl shadow-none hover:shadow-sm transition-shadow duration-200"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl font-medium">{note.title}</CardTitle>
                  <Button variant="outline" size="sm" className="rounded-full px-4 py-1 h-auto text-sm font-normal">
                    edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm leading-relaxed">{note.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
