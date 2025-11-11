"use client"

import { motion } from "framer-motion"

export default function About() {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-24 lg:py-32 bg-card border-t border-border w-full max-w-full overflow-x-hidden">
      <div className="container">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title mb-6 sm:mb-8">О компании</h2>
          <div className="space-y-4 sm:space-y-6 text-muted-foreground text-left max-w-3xl mx-auto">
            <p className="leading-relaxed">
              <strong className="text-foreground">Hookah Events</strong> — профессиональный кальянный кейтеринг для
              мероприятий любого формата. Мы создаём атмосферу, беря на себя всё: оборудование, табак, персонал и
              обслуживание гостей.
            </p>
            <p className="leading-relaxed">
              Только премиальные материалы, опытные мастера и внимание к деталям — чтобы каждый гость почувствовал
              комфорт и стиль события.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
