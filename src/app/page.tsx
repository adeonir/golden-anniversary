import { Countdown } from '~/components/app/countdown'
import { FamilyMessages } from '~/components/app/family-messages'
import { Footer } from '~/components/app/footer'
import { Gallery } from '~/components/app/gallery'
import { Guestbook } from '~/components/app/guestbook'
import { Hero } from '~/components/app/hero'
import { Timeline } from '~/components/app/timeline'

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Countdown />
        <Gallery />
        <FamilyMessages />
        <Timeline />
        <Guestbook />
      </main>
      <Footer />
    </>
  )
}
