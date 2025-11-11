"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Lock, User } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Проверяем, авторизован ли пользователь
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/check")
      const data = await res.json()
      if (data.authenticated) {
        router.push("/admin")
      }
    } catch (error) {
      console.error("Error checking auth:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (data.success) {
        router.push("/admin")
        router.refresh()
      } else {
        setError(data.error || "Неверный логин или пароль")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Ошибка при входе. Попробуйте еще раз.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 w-full max-w-full overflow-x-hidden">
      <motion.div
        className="max-w-md w-full space-y-6 sm:space-y-8 p-6 sm:p-8 md:p-10 rounded-lg bg-card border border-border shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-1 sm:mb-2">Админ-панель</h2>
          <p className="text-center text-xs sm:text-sm text-muted-foreground">Войдите для доступа к управлению</p>
        </div>

        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
              <p className="text-sm text-red-500 text-center">{error}</p>
            </div>
          )}

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                Логин
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-9 sm:pl-10 pr-3 py-2 text-sm sm:text-base border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Введите логин"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                Пароль
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 sm:pl-10 pr-3 py-2 text-sm sm:text-base border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Введите пароль"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 sm:py-3 px-4 text-sm sm:text-base border border-transparent rounded-lg bg-accent text-accent-foreground font-medium hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

