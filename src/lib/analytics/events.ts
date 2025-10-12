export const analyticsEvents = {
  guestbookMessageSubmit: 'Guestbook Message Submit',
  galleryNavigateNext: 'Gallery Navigate Next',
  galleryNavigatePrev: 'Gallery Navigate Previous',
  galleryThumbnailClick: 'Gallery Thumbnail Click',
  countdownView: 'Countdown View',
  countdownMilestone: 'Countdown Milestone',
  timelineSectionView: 'Timeline Section View',
  familyMessagesView: 'Family Messages View',
  footerLinkClick: 'Footer Link Click',
} as const

export type AnalyticsEvent = (typeof analyticsEvents)[keyof typeof analyticsEvents]

export type GuestbookSubmitProps = {
  name: string
  hasEmail: boolean
}

export type GalleryNavigateProps = {
  currentIndex: number
  totalPhotos: number
  direction?: 'next' | 'prev'
}

export type GalleryThumbnailClickProps = {
  photoIndex: number
  photoId: string
}

export type CountdownMilestoneProps = {
  milestone: string
  daysRemaining: number
}

export type SectionViewProps = {
  section: string
}

export type FooterLinkClickProps = {
  destination: string
  link_type: string
  link_text: string
}
