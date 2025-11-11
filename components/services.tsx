"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { scrollToSection } from "@/lib/scroll"

const packages = [
  {
    name: "Basic",
    price: "10 000",
    description: "Идеально для небольших событий",
    hookahs: "5-10",
    hours: "до 4 часов",
    features: ["Кальяны премиум-класса", "Табак Musthave и Darkside", "1 кальянщик", "Базовое обслуживание"],
  },
  {
    name: "Standard",
    price: "25 000",
    description: "Оптимальный выбор для большинства",
    hookahs: "10-20",
    hours: "6-8 часов",
    features: [
      "Премиальное оборудование",
      "Редкие табаки (Element, Black Burn)",
      "2 кальянщика",
      "Фрукты и аксессуары",
      "Дизайн зоны",
    ],
    featured: true,
  },
  {
    name: "Premium",
    price: "50 000",
    description: "Максимум качества и внимания",
    hookahs: "20+",
    hours: "10+ часов",
    features: [
      "Экслюзивные табаки (Sebero, Bonche)",
      "3+ опытных кальянщика",
      "Кальяны с чашами на фруктах",
      "VIP-обслуживание гостей",
      "Фирменное оформление",
      "Консультация по меню",
    ],
  },
]

export default function Services() {
  return (
    <section id="services" className="py-12 sm:py-16 md:py-24 lg:py-32 bg-background w-full max-w-full overflow-x-hidden">
      <div className="container">
        <motion.div
          className="mb-12 sm:mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <h2 className="section-title mb-6">Услуги и цены</h2>
          <p className="section-subtitle">Пакеты, адаптированные под ваш формат</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05, ease: "easeOut" }}
              viewport={{ once: true, margin: "-50px" }}
              className={`relative rounded-lg p-5 sm:p-6 md:p-8 border transition-all duration-300 ${
                pkg.featured
                  ? "bg-gradient-to-b from-accent/10 to-background border-accent sm:col-span-2 lg:col-span-1 lg:scale-105 shadow-xl"
                  : "bg-card border-border hover:border-accent/50"
              }`}
              whileHover={!pkg.featured ? { y: -8 } : {}}
            >
              {pkg.featured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-xs font-bold uppercase">
                    Популярный
                  </span>
                </div>
              )}

              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{pkg.name}</h3>
              <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6">{pkg.description}</p>

              <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-border space-y-2">
                <p className="text-xs sm:text-sm">
                  <span className="text-muted-foreground">Кальянов:</span>{" "}
                  <span className="text-foreground font-semibold">{pkg.hookahs}</span>
                </p>
                <p className="text-xs sm:text-sm">
                  <span className="text-muted-foreground">Длительность:</span>{" "}
                  <span className="text-foreground font-semibold">{pkg.hours}</span>
                </p>
              </div>

              <div className="mb-4 sm:mb-6">
                <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">от {pkg.price}₽</div>
              </div>

              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {pkg.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2.5 sm:gap-3">
                    <Check size={16} className="sm:w-[18px] sm:h-[18px] text-accent mt-0.5 sm:mt-1 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => scrollToSection("#calculator")}
                className={`w-full btn ${pkg.featured ? "btn-filled" : "btn-outline"}`}
              >
                Узнать подробности
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
