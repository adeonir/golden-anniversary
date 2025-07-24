import { Countdown } from '~/components/app/countdown'
import { FamilyMessages } from '~/components/app/family-messages'
import { Gallery } from '~/components/app/gallery'
import { Hero } from '~/components/app/hero'

export default function Home() {
  return (
    <main>
      <Hero />
      <Countdown />
      <Gallery />
      <FamilyMessages />
    </main>
  )
}
