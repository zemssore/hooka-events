"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface CalculatorState {
  hookahs: number
  hours: number
  bowlType: string
}

interface Prices {
  prices: {
    [key: string]: {
      regular: { [key: string]: number }
      fifty: { [key: string]: number }
      fruit: { [key: string]: number }
    }
  }
}

export default function Calculator() {
  const [state, setState] = useState<CalculatorState>({
    hookahs: 5,
    hours: 4,
    bowlType: "regular",
  })
  const [prices, setPrices] = useState<Prices | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPrices()
  }, [])

  const loadPrices = async () => {
    try {
      const res = await fetch("/api/prices")
      const data = await res.json()
      setPrices(data)
    } catch (error) {
      console.error("Error loading prices:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPrice = (): number => {
    if (!prices) return 0

    const bowlTypeMap: { [key: string]: "regular" | "fifty" | "fruit" } = {
      regular: "regular",
      fifty: "fifty",
      fruit: "fruit"
    }

    const bowlType = bowlTypeMap[state.bowlType] || "regular"
    
    // Если значения в диапазоне прайса (2-30 кальянов, 3-10 часов) - используем точную цену
    if (state.hookahs >= 2 && state.hookahs <= 30 && state.hours >= 3 && state.hours <= 10) {
      const hookahsKey = state.hookahs.toString()
      const hoursKey = state.hours.toString()
      const priceData = prices.prices[hookahsKey]?.[bowlType]?.[hoursKey]
      if (priceData) {
        return priceData
      }
    }

    // Если кальянов меньше 2 - используем пропорциональный расчет
    if (state.hookahs < 2) {
      // Берем ближайшую цену из прайса (2 кальяна)
      const baseHookahs = 2
      let baseHours = state.hours
      if (baseHours < 3) baseHours = 3
      if (baseHours > 10) baseHours = 10
      
      const basePrice = prices.prices[baseHookahs.toString()]?.[bowlType]?.[baseHours.toString()] || 0
      if (basePrice === 0) return 0
      
      // Масштабируем по количеству кальянов
      const hookahsMultiplier = state.hookahs / baseHookahs
      let finalPrice = basePrice * hookahsMultiplier
      
      // Если часов больше 10, добавляем продление
      if (state.hours > 10) {
        const extensionPrice = prices.prices[baseHookahs.toString()]?.[bowlType]?.["extension"] || 0
        const extraHours = state.hours - 10
        finalPrice += (extensionPrice * hookahsMultiplier * extraHours)
      }
      
      // Если часов меньше 3, масштабируем пропорционально
      if (state.hours < 3) {
        finalPrice = finalPrice * (state.hours / 3)
      }
      
      return Math.round(finalPrice)
    }

    // Если часов меньше 3 - используем пропорциональный расчет
    if (state.hours < 3) {
      const baseHours = 3
      let baseHookahs = state.hookahs
      if (baseHookahs < 2) baseHookahs = 2
      if (baseHookahs > 30) baseHookahs = 30
      
      const basePrice = prices.prices[baseHookahs.toString()]?.[bowlType]?.[baseHours.toString()] || 0
      if (basePrice === 0) return 0
      
      // Масштабируем по количеству часов
      const hoursMultiplier = state.hours / baseHours
      return Math.round(basePrice * hoursMultiplier)
    }

    // Если кальянов больше 30 - используем цену за 30 и масштабируем
    if (state.hookahs > 30) {
      const baseHookahs = 30
      let baseHours = state.hours
      if (baseHours > 10) baseHours = 10
      
      const basePrice = prices.prices[baseHookahs.toString()]?.[bowlType]?.[baseHours.toString()] || 0
      if (basePrice === 0) return 0
      
      const hookahsMultiplier = state.hookahs / baseHookahs
      let finalPrice = basePrice * hookahsMultiplier
      
      // Если часов больше 10, добавляем продление
      if (state.hours > 10) {
        const extensionPrice = prices.prices[baseHookahs.toString()]?.[bowlType]?.["extension"] || 0
        const extraHours = state.hours - 10
        finalPrice += (extensionPrice * hookahsMultiplier * extraHours)
      }
      
      return Math.round(finalPrice)
    }

    // Если часов больше 10 - используем цену за 10 часов и добавляем продление
    if (state.hours > 10) {
      let baseHookahs = state.hookahs
      if (baseHookahs > 30) baseHookahs = 30
      
      const basePrice10 = prices.prices[baseHookahs.toString()]?.[bowlType]?.["10"] || 0
      const extensionPrice = prices.prices[baseHookahs.toString()]?.[bowlType]?.["extension"] || 0
      
      if (basePrice10 === 0) return 0
      
      const extraHours = state.hours - 10
      return basePrice10 + (extensionPrice * extraHours)
    }

    return 0
  }

  const calculatePrice = () => {
    return getPrice()
  }

  const formatOrderMessage = () => {
    const hookahsText = state.hookahs >= 50 ? "50+" : state.hookahs.toString()
    const hoursText = `${state.hours} ${state.hours === 1 ? 'час' : state.hours < 5 ? 'часа' : 'часов'}`
    
    let bowlText = ""
    if (state.bowlType === "fruit") {
      bowlText = "На фруктах"
    } else if (state.bowlType === "fifty") {
      bowlText = "50/50"
    } else {
      bowlText = "На чашах"
    }

    const message = `Здравствуйте! Хочу оформить заказ:\n\n` +
      `Количество кальянов: ${hookahsText}\n` +
      `Время: ${hoursText}\n` +
      `Тип чаши: ${bowlText}\n\n` +
      `Примерная стоимость: ${calculatePrice().toLocaleString()}₽`

    return encodeURIComponent(message)
  }

  const handleOrderClick = () => {
    const phoneNumber = "79035299542"
    const message = formatOrderMessage()
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
  }

  const price = calculatePrice()

  if (loading) {
    return (
      <section id="calculator" className="py-12 sm:py-16 md:py-24 lg:py-32 bg-card border-y border-border w-full max-w-full overflow-x-hidden">
        <div className="container">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Загрузка калькулятора...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="calculator" className="py-12 sm:py-16 md:py-24 lg:py-32 bg-card border-y border-border w-full max-w-full overflow-x-hidden">
      <div className="container">
        <motion.div
          className="mb-12 sm:mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <h2 className="section-title mb-6">Калькулятор стоимости</h2>
          <p className="section-subtitle">Рассчитайте примерную стоимость под ваш формат</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* Calculator Form */}
          <motion.div
            className="space-y-5 sm:space-y-6 md:space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
          >
            {/* Hookahs */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-foreground mb-3 sm:mb-4 uppercase tracking-wider">
                Количество кальянов: <span className="text-accent text-base sm:text-lg">{state.hookahs >= 50 ? "50+" : state.hookahs}</span>
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={state.hookahs}
                onChange={(e) => setState({ ...state, hookahs: Number.parseInt(e.target.value) })}
                className="w-full h-2 sm:h-2.5 bg-border rounded-lg cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>1</span>
                <span>50+</span>
              </div>
            </div>

            {/* Hours */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-foreground mb-3 sm:mb-4 uppercase tracking-wider">
                Количество часов: <span className="text-accent text-base sm:text-lg">{state.hours}</span>
              </label>
              <input
                type="range"
                min="1"
                max="12"
                value={state.hours}
                onChange={(e) => setState({ ...state, hours: Number.parseInt(e.target.value) })}
                className="w-full h-2 sm:h-2.5 bg-border rounded-lg cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>1ч</span>
                <span>12ч</span>
              </div>
            </div>

            {/* Bowl Type */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-foreground mb-3 sm:mb-4 uppercase tracking-wider">
                Тип чаши
              </label>
              <div className="space-y-2.5 sm:space-y-3">
                {[
                  { id: "regular", label: "На чашах" },
                  { id: "fifty", label: "50/50" },
                  { id: "fruit", label: "На фруктах" },
                ].map((option) => (
                  <label key={option.id} className="flex items-center gap-2.5 sm:gap-3 cursor-pointer p-2 sm:p-2.5 rounded-lg hover:bg-background/50 transition-colors">
                    <input
                      type="radio"
                      name="bowl"
                      value={option.id}
                      checked={state.bowlType === option.id}
                      onChange={(e) => setState({ ...state, bowlType: e.target.value })}
                      className="w-4 h-4 sm:w-5 sm:h-5 accent-accent cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm text-foreground">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Price Summary */}
          <motion.div
            className="lg:sticky lg:top-32 h-fit"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="p-5 sm:p-6 md:p-8 rounded-lg bg-background border border-accent/50 space-y-4 sm:space-y-5 md:space-y-6">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mb-2">Ваш расчёт</p>
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-accent break-words">{price.toLocaleString()}₽</h3>
              </div>

              <div className="space-y-3 sm:space-y-4 py-4 sm:py-6 border-y border-border">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Кальянов × часов</span>
                  <span className="text-foreground font-medium">
                    {state.hookahs >= 50 ? "50+" : state.hookahs} × {state.hours}ч
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Тип чаши</span>
                  <span className="text-foreground font-medium">
                    {state.bowlType === "fruit" ? "На фруктах" : state.bowlType === "fifty" ? "50/50" : "На чашах"}
                  </span>
                </div>
              </div>

              <a
                href="/price-list.pdf"
                download="Прайс конечный кейтеринг.pdf"
                className="block text-center text-xs sm:text-sm text-accent hover:text-accent/80 transition-colors underline"
              >
                Скачать цены в PDF
              </a>

              <div className="pt-2">
                <button
                  onClick={handleOrderClick}
                  className="w-full btn btn-filled text-sm sm:text-base"
                >
                  Оформить заказ
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
