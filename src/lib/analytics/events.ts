export const analyticsEvents = {
  guestbookMessageSubmit: 'Guestbook Message Submit',
  guestbookFormAbandoned: 'Guestbook Form Abandoned',
  countdownView: 'Countdown View',
  timelineSectionView: 'Timeline Section View',
  familyMessagesView: 'Family Messages View',
  footerView: 'Footer View',
  footerLinkClick: 'Footer Link Click',
  apiError: 'API Error',
  queryError: 'Query Error',
  mutationError: 'Mutation Error',
} as const

export type AnalyticsEvent = (typeof analyticsEvents)[keyof typeof analyticsEvents]

export type GuestbookSubmitProps = {
  name: string
  hasEmail: boolean
}

export type SectionViewProps = {
  section: string
}

export type FooterLinkClickProps = {
  destination: string
  link_type: string
  link_text: string
}

export type ErrorTrackingProps = {
  error_message: string
  error_type: string
  context: string
  stack_trace?: string
  url?: string
}
