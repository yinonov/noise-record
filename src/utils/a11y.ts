export function trapFocus(container: HTMLElement, firstFocusable?: HTMLElement) {
  const focusable = Array.from(
    container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => !el.hasAttribute('disabled'))

  const first = firstFocusable ?? focusable[0]
  const last = focusable[focusable.length - 1]

  function handleKeydown(event: KeyboardEvent) {
    if (event.key !== 'Tab') return
    if (focusable.length === 0) return
    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      }
    } else if (document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
  }

  container.addEventListener('keydown', handleKeydown)
  return () => container.removeEventListener('keydown', handleKeydown)
}

export function ariaLabel(id: string, context: string) {
  return `${context}-${id}`
}

export function isActivation(event: KeyboardEvent) {
  return event.key === 'Enter' || event.key === ' '
}
