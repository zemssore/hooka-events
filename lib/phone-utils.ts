/**
 * Форматирует номер телефона в формат +7 (999) 123-45-67
 */
export function formatPhoneNumber(value: string): string {
  // Удаляем все символы кроме цифр и знака +
  let numbers = value.replace(/[^\d+]/g, "")
  
  // Убираем + и обрабатываем только цифры
  numbers = numbers.replace(/\+/g, "")

  // Если номер начинается с 8, заменяем на 7
  let formatted = numbers.startsWith("8") ? "7" + numbers.slice(1) : numbers

  // Если номер не начинается с 7 или 8, добавляем 7 только если поле не пустое
  if (formatted && !formatted.startsWith("7") && !formatted.startsWith("8")) {
    formatted = "7" + formatted
  }

  // Ограничиваем длину до 11 цифр (7 + 10)
  formatted = formatted.slice(0, 11)

  // Форматируем номер
  if (formatted.length === 0) {
    return ""
  } else if (formatted.length <= 1) {
    return `+${formatted}`
  } else if (formatted.length <= 4) {
    return `+${formatted.slice(0, 1)} (${formatted.slice(1)}`
  } else if (formatted.length <= 7) {
    return `+${formatted.slice(0, 1)} (${formatted.slice(1, 4)}) ${formatted.slice(4)}`
  } else if (formatted.length <= 9) {
    return `+${formatted.slice(0, 1)} (${formatted.slice(1, 4)}) ${formatted.slice(4, 7)}-${formatted.slice(7)}`
  } else {
    return `+${formatted.slice(0, 1)} (${formatted.slice(1, 4)}) ${formatted.slice(4, 7)}-${formatted.slice(7, 9)}-${formatted.slice(9)}`
  }
}

/**
 * Проверяет, является ли номер телефона валидным
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Удаляем все символы кроме цифр
  const numbers = phone.replace(/\D/g, "")

  // Номер должен содержать 11 цифр (7 + 10) и начинаться с 7
  return numbers.length === 11 && numbers.startsWith("7")
}

/**
 * Получает только цифры из номера телефона
 */
export function getPhoneNumbers(phone: string): string {
  return phone.replace(/\D/g, "")
}

