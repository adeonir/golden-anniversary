'use client'

import { Upload } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { ScrollArea } from '~/components/ui/scroll-area'
import { useDataState } from '~/hooks/use-data-state'
import { usePhotos } from '~/hooks/use-photos'
import { UploadsModal } from './uploads-modal'

export function PhotosTab() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const { data: photos = [], isLoading, error } = usePhotos()

  const dataStateAlert = useDataState({
    data: photos,
    isLoading,
    error,
    loadingText: 'Carregando fotos...',
    errorText: 'Erro ao carregar fotos. Tente novamente.',
    emptyText: 'Nenhuma foto encontrada.',
  })

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-2xl text-foreground">Galeria</h2>
          <p className="text-muted-foreground">Gerencie as fotos da galeria de aniversário</p>
        </div>
        <Button className="flex items-center gap-2" intent="admin" onClick={() => setUploadModalOpen(true)}>
          <Upload className="size-4" />
          Fazer Upload
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {dataStateAlert && <div className="flex items-center justify-center py-8">{dataStateAlert}</div>}

        {!dataStateAlert && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => (
              <div className="group relative aspect-square overflow-hidden rounded-lg border bg-muted" key={photo.id}>
                <Image
                  alt={photo.originalName}
                  className="size-full object-cover transition-transform group-hover:scale-105"
                  fill
                  src={photo.url}
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <UploadsModal onOpenChange={setUploadModalOpen} open={uploadModalOpen} />
    </div>
  )
}
