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
