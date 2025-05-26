"use client";

import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddNoteModal } from "@/components/generic/note-modal";
import { useNote } from "@/hooks/useNote";

export function NotesApp() {

  const { notes } = useNote();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Add New Note button */}
        <div className="flex justify-end mb-8">
          <AddNoteModal />
        </div>

        {/* Conditional rendering based on notes availability */}
        {notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note, index) => (
              <Card
                key={index}
                className="border-2 rounded-3xl shadow-none hover:shadow-sm transition-shadow duration-200"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl font-medium">
                      {note.title}
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full px-4 py-1 h-auto text-sm font-normal"
                    >
                      edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {note.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="mb-6 rounded-full bg-gray-100 p-6">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Belum ada catatan
              </h2>

              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
                Anda belum membuat catatan. Mulai menangkap pikiran, ide, dan
                informasi penting Anda dengan membuat catatan pertama Anda.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
