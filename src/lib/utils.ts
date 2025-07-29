import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function validateFile(file: File): string | null {
  if (!file.type.includes('jpeg')) {
    return 'Apenas arquivos JPEG são permitidos'
  }
  if (file.size > 1024 * 1024) {
    return 'Arquivo deve ter no máximo 1MB'
  }
  return null
}

export function generateBlurDataURL(): string {
  // Base64 encoded tiny SVG with blur effect
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjNmNGY2Ii8+Cjwvc3ZnPgo='
}

export function getOptimizedAnimation(prefersReducedMotion: boolean) {
  if (prefersReducedMotion) {
    return {
      duration: 0.1,
      ease: 'easeOut',
    }
  }

  return {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1], // easeOutQuart
  }
}
