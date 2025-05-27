"use client";
import React, { use } from "react";
import {
  Calendar,
  Clock,
  Edit3,
  Share2,
  Bookmark,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentNote } from "@/hooks/useCurrentNote";
import { getHumanReadableDate } from "@/utils/date_util";
import Link from "next/link";

const NoteDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  const { currentNote } = useCurrentNote(Number(id));

  if (!currentNote) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <Link href="/dashboard" className="flex items-center mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Link>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">
                {currentNote.title}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentNote.description}
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              <Button variant="outline" size="sm">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
          {/* Meta information */}
          <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                Dibuat -{" "}
                {getHumanReadableDate(
                  new Date(currentNote.created_at as string)
                )}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>
                Diupdate -{" "}
                {getHumanReadableDate(
                  new Date(currentNote.updated_at as string)
                )}
              </span>
            </div>
          </div>
        </div>
        {/* Content */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
              {currentNote?.content ? (
                currentNote?.content.split("\n").map((line, index) => {
                  // Handle headers
                  if (line.startsWith("# ")) {
                    return (
                      <h1
                        key={index}
                        className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4 first:mt-0"
                      >
                        {line.substring(2)}
                      </h1>
                    );
                  }
                  if (line.startsWith("## ")) {
                    return (
                      <h2
                        key={index}
                        className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-6 mb-3"
                      >
                        {line.substring(3)}
                      </h2>
                    );
                  }
                  if (line.startsWith("### ")) {
                    return (
                      <h3
                        key={index}
                        className="text-lg font-medium text-slate-800 dark:text-slate-200 mt-4 mb-2"
                      >
                        {line.substring(4)}
                      </h3>
                    );
                  }
                  // Handle bullet points
                  if (line.startsWith("- ")) {
                    const content = line.substring(2);
                    const boldMatch = content.match(/\*\*(.*?)\*\*(.*)/);
                    if (boldMatch) {
                      return (
                        <div
                          key={index}
                          className="flex items-start gap-2 mb-2"
                        >
                          <span className="text-blue-500 mt-2">•</span>
                          <span>
                            <strong className="font-semibold text-slate-900 dark:text-white">
                              {boldMatch[1]}
                            </strong>
                            <span className="text-slate-700 dark:text-slate-300">
                              {boldMatch[2]}
                            </span>
                          </span>
                        </div>
                      );
                    }
                    return (
                      <div key={index} className="flex items-start gap-2 mb-2">
                        <span className="text-blue-500 mt-2">•</span>
                        <span className="text-slate-700 dark:text-slate-300">
                          {content}
                        </span>
                      </div>
                    );
                  }
                  // Handle code blocks
                  if (line.startsWith("```")) {
                    return null; // Skip code block markers for this simple implementation
                  }
                  // Handle quotes
                  if (line.startsWith("> ")) {
                    return (
                      <blockquote
                        key={index}
                        className="border-l-4 border-blue-200 dark:border-blue-800 pl-4 py-2 my-4 italic text-slate-600 dark:text-slate-300 bg-blue-50 dark:bg-blue-900/30 rounded-r"
                      >
                        {line.substring(2)}
                      </blockquote>
                    );
                  }
                  // Handle inline code
                  const codeMatch = line.match(/`([^`]+)`/);
                  if (codeMatch) {
                    const parts = line.split(/`([^`]+)`/);
                    return (
                      <p
                        key={index}
                        className="mb-4 text-slate-700 dark:text-slate-300"
                      >
                        {parts.map((part, i) =>
                          i % 2 === 1 ? (
                            <code
                              key={i}
                              className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded text-sm font-mono text-slate-800 dark:text-slate-200"
                            >
                              {part}
                            </code>
                          ) : (
                            part
                          )
                        )}
                      </p>
                    );
                  }
                  // Regular paragraphs
                  if (line.trim()) {
                    return (
                      <p
                        key={index}
                        className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed"
                      >
                        {line}
                      </p>
                    );
                  }
                  // Empty lines
                  return <div key={index} className="h-2" />;
                })
              ) : (
                <>No content</>
              )}
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>Last saved automatically • {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;
