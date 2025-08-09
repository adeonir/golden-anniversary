import { Footer } from '~/components/app/layout/footer'
import { Hero } from '~/components/app/layout/hero'
import { Countdown } from '~/components/app/sections/countdown'
import { FamilyMessages } from '~/components/app/sections/family-messages'
import { Guestbook } from '~/components/app/sections/guestbook'
import { Memories } from '~/components/app/sections/memories'
import { Timeline } from '~/components/app/sections/timeline'

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Countdown />
        <Memories />
        <FamilyMessages />
        <Timeline />
        <Guestbook />
      </main>
      <Footer />
    </>
  )
}
