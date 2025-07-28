'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { Camera, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Section } from '~/components/ui/section'
import { SectionHeader } from '~/components/ui/section-header'
import { usePhotos } from '~/hooks/use-photos'
import { cn } from '~/lib/utils'

const content = {
  title: 'Galeria de Memórias',
  subtitle: '50 anos de momentos inesquecíveis.',
}

export function Gallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const { data: photos = [] } = usePhotos()

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

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

  return (
    <Section className="bg-white">
      <div className="mx-auto px-4">
        <div className="section-container">
          <SectionHeader icon={Camera} subtitle={content.subtitle} title={content.title} />

          <div className="relative mb-12">
            <div aria-live="polite" className="overflow-hidden rounded-3xl" ref={emblaRef}>
              <div className="flex">
                {photos.map((photo, index) => (
                  <div className="relative min-w-0 flex-[0_0_100%]" key={photo.id}>
                    <div className="relative aspect-[4/3] w-full">
                      <Image
                        alt={photo.title || `Foto ${index + 1}`}
                        className="object-cover"
                        fill
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                        src={photo.url}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              className="-translate-y-1/2 sm:-translate-y-1/2 absolute top-1/2 left-4 z-10 size-12 rounded-full border-white/80 bg-white/90 text-gold-600 shadow-lg backdrop-blur-sm hover:bg-white hover:text-gold-700 disabled:opacity-50 max-sm:top-auto max-sm:bottom-4 max-sm:left-4 max-sm:translate-y-0 sm:top-1/2 sm:left-4"
              disabled={!canScrollPrev}
              onClick={scrollPrev}
              size="icon"
              variant="outline"
            >
              <ChevronLeft className="size-6" />
              <span className="sr-only">Foto anterior</span>
            </Button>

            <Button
              className="-translate-y-1/2 sm:-translate-y-1/2 absolute top-1/2 right-4 z-10 size-12 rounded-full border-white/80 bg-white/90 text-gold-600 shadow-lg backdrop-blur-sm hover:bg-white hover:text-gold-700 disabled:opacity-50 max-sm:top-auto max-sm:right-4 max-sm:bottom-4 max-sm:translate-y-0 sm:top-1/2 sm:right-4"
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
            aria-label="Miniaturas das fotos da galeria"
            className="scrollbar-thin flex gap-2 overflow-x-auto px-2 py-4 sm:gap-4"
            role="tablist"
          >
            {photos.map((photo, index) => (
              <button
                aria-label={`Ver foto ${index + 1}: ${photo.title || `Foto ${index + 1}`}`}
                aria-selected={index === selectedIndex}
                className={cn(
                  'relative aspect-square min-w-0 flex-shrink-0 cursor-pointer rounded-xl transition-all duration-200',
                  index === selectedIndex
                    ? 'scale-105 ring-2 ring-gold-500 ring-offset-2'
                    : 'opacity-70 hover:opacity-100',
                )}
                key={photo.id}
                onClick={() => scrollTo(index)}
                role="tab"
                style={{ width: '80px', height: '80px' }}
                type="button"
              >
                <Image
                  alt={photo.title || `Foto ${index + 1}`}
                  className="rounded-xl object-cover"
                  fill
                  sizes="80px"
                  src={photo.url}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
