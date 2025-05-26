"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface VerticalSlidingTextProps {
  items: string[]
  interval?: number
  className?: string
}

export const VerticalSlidingText: React.FC<VerticalSlidingTextProps> = ({ items, interval = 2000, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
    }, interval)

    return () => clearInterval(timer)
  }, [items.length, interval])

  return (
    <div className={`overflow-hidden h-20 ${className}`}>
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center h-full text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-slate-300 dark:to-slate-500">
            {items[currentIndex]}
          </h1>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

