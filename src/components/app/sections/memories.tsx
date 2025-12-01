'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { m as motion } from 'framer-motion'
import { Camera, ChevronLeft, ChevronRight } from 'lucide-react'
import NextImage from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Section } from '~/components/ui/section'
import { SectionHeader } from '~/components/ui/section-header'
import { useMemories } from '~/hooks/use-photos'
import { useReducedMotion } from '~/hooks/use-reduced-motion'
import { cn, generateBlurDataURL } from '~/lib/utils'

const content = {
  title: 'Memórias Especiais',
  subtitle: '50 anos de momentos inesquecíveis.',
}

export function Memories() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const { data: photos = [] } = useMemories()
  const prefersReducedMotion = useReducedMotion()

  const onSelect = useCallback(() => {
    if (!emblaApi) return

    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index)
    },
    [emblaApi],
  )

  return (
    <Section className="bg-white">
      <div className="mx-auto px-4">
        <div className="section-container">
          <SectionHeader icon={Camera} subtitle={content.subtitle} title={content.title} />

          <div className="relative mb-12">
            <div aria-live="polite" className="overflow-hidden rounded-3xl" ref={emblaRef}>
              <div className="flex">
                {photos.length > 0 ? (
                  photos.map((photo, index) => (
                    <div className="relative min-w-0 flex-[0_0_100%]" key={photo.id}>
                      <div className="relative aspect-[4/3] w-full bg-zinc-100">
                        <NextImage
                          alt={photo.title || `Foto ${index + 1}`}
                          blurDataURL={generateBlurDataURL()}
                          className="object-cover"
                          fill
                          placeholder="blur"
                          priority={index === 0}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                          src={photo.url}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="relative min-w-0 flex-[0_0_100%]">
                    <div className="relative aspect-[4/3] w-full bg-zinc-100" />
                  </div>
                )}
              </div>
            </div>

            <Button
              className="-translate-y-1/2 sm:-translate-y-1/2 absolute top-1/2 left-4 z-10 size-12 rounded-full bg-white text-gold-600 shadow-xl hover:bg-white hover:text-gold-700 disabled:opacity-50 max-sm:top-auto max-sm:bottom-4 max-sm:left-4 max-sm:translate-y-0 sm:top-1/2 sm:left-4"
              disabled={!canScrollPrev}
              onClick={scrollPrev}
              size="icon"
              variant="outline"
            >
              <ChevronLeft className="size-6" />
              <span className="sr-only">Foto anterior</span>
            </Button>

            <Button
              className="-translate-y-1/2 sm:-translate-y-1/2 absolute top-1/2 right-4 z-10 size-12 rounded-full bg-white text-gold-600 shadow-xl hover:bg-white hover:text-gold-700 disabled:opacity-50 max-sm:top-auto max-sm:right-4 max-sm:bottom-4 max-sm:translate-y-0 sm:top-1/2 sm:right-4"
              disabled={!canScrollNext}
              onClick={scrollNext}
              size="icon"
              variant="outline"
            >
              <ChevronRight className="size-6" />
              <span className="sr-only">Próxima foto</span>
            </Button>
          </div>

          <div
            aria-label="Miniaturas das fotos de memórias"
            className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gold-300 flex gap-2 overflow-x-auto px-2 py-4 sm:gap-4"
            role="tablist"
          >
            {photos.length > 0
              ? photos.map((photo, index) => (
                  <motion.button
                    aria-label={`Ver foto ${index + 1}: ${photo.title || `Foto ${index + 1}`}`}
                    aria-selected={index === selectedIndex}
                    className={cn(
                      'relative aspect-square h-20 w-20 min-w-0 flex-shrink-0 cursor-pointer rounded-xl bg-zinc-100 transition-all duration-200',
                      index === selectedIndex
                        ? 'scale-105 ring-2 ring-gold-500 ring-offset-2'
                        : 'opacity-70 hover:opacity-100',
                    )}
                    key={photo.id}
                    onClick={() => scrollTo(index)}
                    role="tab"
                    transition={{ duration: 0.1, ease: 'easeOut' }}
                    type="button"
                    whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                  >
                    <NextImage
                      alt={photo.title || `Foto ${index + 1}`}
                      blurDataURL={generateBlurDataURL()}
                      className="rounded-xl object-cover"
                      fill
                      placeholder="blur"
                      sizes="80px"
                      src={photo.url}
                    />
                  </motion.button>
                ))
              : Array.from({ length: 10 }, () => crypto.randomUUID()).map((id) => (
                  <div className="aspect-square h-20 w-20 rounded-xl bg-zinc-100" key={id} />
                ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
