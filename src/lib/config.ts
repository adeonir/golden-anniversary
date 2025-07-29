export const config = {
  pagination: {
    frontendPageSize: 5,
    adminPageSize: 100,
    defaultPage: 1,
  },
  event: {
    targetDate: '2025-11-08T18:30:00',
    celebrationYear: 2025,
  },
  storage: {
    bucketName: 'photos',
    maxFileSize: 1_048_576, // 1MB
    allowedTypes: ['image/jpeg'],
    maxDimension: 1000, // pixels
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
