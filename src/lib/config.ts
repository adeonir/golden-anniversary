export const config = {
  admin: {
    tabs: {
      messages: 'messages',
      memories: 'memories',
    } as const,
  },
  pagination: {
    frontendPageSize: 5,
    adminPageSize: 100,
    defaultPage: 1,
  },
  event: {
    targetDate: '2025-11-08T18:30:00',
    celebrationYear: 2025,
  },
  images: {
    maxFileSize: 1_048_576, // 1MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxDimension: 2048, // pixels
    quality: 80, // default quality
    folder: 'memories', // default upload folder
  },
  animation: {
    easing: {
      natural: [0.4, 0, 0.2, 1],
      smooth: [0.25, 0.46, 0.45, 0.94],
      bounce: [0.68, -0.55, 0.265, 1.55],
    },
    duration: {
      fast: 0.1,
      normal: 0.3,
      slow: 0.8,
    },
  },
} as const

export type AdminTabValue = (typeof config.admin.tabs)[keyof typeof config.admin.tabs]
