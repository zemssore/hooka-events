"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface CaseItem {
  id: number
  title: string
  image: string
  category?: string
}

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState<CaseItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCases()
  }, [])

  const loadCases = async () => {
    try {
      const res = await fetch("/api/cases")
      const data = await res.json()
      setGalleryItems(data || [])
    } catch (error) {
      console.error("Error loading cases:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section id="gallery" className="py-12 sm:py-16 md:py-24 lg:py-32 bg-background w-full max-w-full overflow-x-hidden">
        <div className="container">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Загрузка кейсов...</p>
          </div>
        </div>
      </section>
    )
  }

  if (galleryItems.length === 0) {
    return null
  }

  return (
    <section id="gallery" className="py-12 sm:py-16 md:py-24 lg:py-32 bg-background w-full max-w-full overflow-x-hidden">
      <div className="container">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <h2 className="section-title mb-6">Кейсы</h2>
          <p className="section-subtitle">Примеры наших работ</p>
        </motion.div>

        {/* Gallery - Horizontal Slider on Mobile, Grid on Desktop */}
        <div className="md:hidden w-full max-w-full overflow-hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
            <AnimatePresence mode="wait">
              {galleryItems.map((item) => (
                <motion.div
                  key={item.id}
                  layoutId={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group relative flex-shrink-0 w-[calc(100vw-2rem)] sm:w-[280px] h-[200px] rounded-lg overflow-hidden bg-card border border-border hover:border-accent/50 cursor-pointer snap-start"
                  whileHover={{ y: -4 }}
                >
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-accent font-semibold text-sm">{item.title}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Gallery Grid - Desktop */}
        <motion.div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" layout>
          <AnimatePresence mode="wait">
            {galleryItems.map((item) => (
              <motion.div
                key={item.id}
                layoutId={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden rounded-lg h-56 md:h-64 bg-card border border-border hover:border-accent/50 cursor-pointer"
                whileHover={{ y: -8 }}
              >
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-accent font-semibold">{item.title}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
