export const analyticsEvents = {
  guestbookMessageSubmit: 'Guestbook Message Submit',
  countdownView: 'Countdown View',
  timelineSectionView: 'Timeline Section View',
  familyMessagesView: 'Family Messages View',
  footerView: 'Footer View',
  footerLinkClick: 'Footer Link Click',
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
