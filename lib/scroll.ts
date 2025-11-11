/**
 * Плавная прокрутка к элементу по ID
 */
export function scrollToSection(sectionId: string) {
  // Функция для выполнения прокрутки
  const performScroll = (element: Element) => {
    const header = document.querySelector("header")
    const headerOffset = header ? header.offsetHeight + 20 : 100
    
    // Используем scrollIntoView как основной метод
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })

    // Дополнительная корректировка для учета высоты хедера
    setTimeout(() => {
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementTop - headerOffset
      
      if (Math.abs(window.pageYOffset - offsetPosition) > 10) {
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: "smooth",
        })
      }
    }, 100)
  }

  // Ищем элемент
  let element = document.querySelector(sectionId)
  
  if (element) {
    performScroll(element)
    return
  }

  // Если элемент не найден сразу, пробуем найти его через небольшие задержки
  const maxAttempts = 5
  let attempt = 0

  const findAndScroll = setInterval(() => {
    attempt++
    element = document.querySelector(sectionId)
    
    if (element) {
      clearInterval(findAndScroll)
      performScroll(element)
    } else if (attempt >= maxAttempts) {
      clearInterval(findAndScroll)
      // Fallback: используем нативную прокрутку через hash
      const hash = sectionId.replace("#", "")
      if (hash) {
        window.location.href = `#${hash}`
      }
    }
  }, 100)
}

/**
 * Обработчик клика для ссылок с якорями
 */
export function handleAnchorClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (href.startsWith("#")) {
    e.preventDefault()
    scrollToSection(href)
  }
}

