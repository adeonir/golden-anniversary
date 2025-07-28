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
} as const
