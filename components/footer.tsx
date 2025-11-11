"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { handleAnchorClick } from "@/lib/scroll"

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border w-full max-w-full overflow-x-hidden">
      <div className="container py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-10 sm:mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-accent mb-4">HOOKAH EVENTS</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Кальянный кейтеринг на мероприятия в Москве и области. Предоставим кальяны и персонал под ваш формат события.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-foreground mb-4 uppercase text-sm tracking-wider">Навигация</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a 
                  href="#about" 
                  onClick={(e) => handleAnchorClick(e, "#about")}
                  className="hover:text-accent transition-colors cursor-pointer"
                >
                  О нас
                </a>
              </li>
              <li>
                <a 
                  href="#advantages" 
                  onClick={(e) => handleAnchorClick(e, "#advantages")}
                  className="hover:text-accent transition-colors cursor-pointer"
                >
                  Кальяны
                </a>
              </li>
              <li>
                <a 
                  href="#gallery" 
                  onClick={(e) => handleAnchorClick(e, "#gallery")}
                  className="hover:text-accent transition-colors cursor-pointer"
                >
                  Портфолио
                </a>
              </li>
              <li>
                <a 
                  href="#menu" 
                  onClick={(e) => handleAnchorClick(e, "#menu")}
                  className="hover:text-accent transition-colors cursor-pointer"
                >
                  Меню
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-foreground mb-4 uppercase text-sm tracking-wider">Услуги</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a 
                  href="#gallery" 
                  onClick={(e) => handleAnchorClick(e, "#gallery")}
                  className="hover:text-accent transition-colors cursor-pointer"
                >
                  Корпоративы
                </a>
              </li>
              <li>
                <a 
                  href="#gallery" 
                  onClick={(e) => handleAnchorClick(e, "#gallery")}
                  className="hover:text-accent transition-colors cursor-pointer"
                >
                  Свадьбы
                </a>
              </li>
              <li>
                <a 
                  href="#gallery" 
                  onClick={(e) => handleAnchorClick(e, "#gallery")}
                  className="hover:text-accent transition-colors cursor-pointer"
                >
                  День рождения
                </a>
              </li>
              <li>
                <a 
                  href="#gallery" 
                  onClick={(e) => handleAnchorClick(e, "#gallery")}
                  className="hover:text-accent transition-colors cursor-pointer"
                >
                  Съёмки
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-foreground mb-4 uppercase text-sm tracking-wider">Контакты</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="tel:+79035299542" className="text-accent hover:text-accent/80 transition-colors">
                  +7 (903) 529-95-42
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/79035299542"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/hookahevents"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  Telegram
                </a>
              </li>
              <li>
                <a 
                  href="https://instagram.com/hookahevents" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>&copy; 2025 Hookah Events. Все права защищены.</p>
          <div className="flex flex-wrap gap-4 sm:gap-6 mt-4 md:mt-0 justify-center md:justify-end">
            <Link href="/privacy" className="hover:text-accent transition-colors">
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className="hover:text-accent transition-colors">
              Условия использования
            </Link>
            <a 
              href="/contract.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              Договор
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
