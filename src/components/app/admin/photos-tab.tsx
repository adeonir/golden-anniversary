'use client'

import { Upload } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { ScrollArea } from '~/components/ui/scroll-area'
import { UploadsModal } from './uploads-modal'

export function PhotosTab() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  // TODO: Implement data fetching
  const isLoading = false
  const error: string | null = null
  const photos: never[] = []

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header */}
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
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Carregando fotos...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-8">
            <p className="text-destructive">Erro ao carregar fotos. Tente novamente.</p>
          </div>
        )}

        {!(isLoading || error) && photos.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Nenhuma foto encontrada.</p>
          </div>
        )}

        {/* TODO: Implement photos grid when photos.length > 0 */}
      </ScrollArea>

      {/* Upload Modal */}
      <UploadsModal onOpenChange={setUploadModalOpen} open={uploadModalOpen} />
    </div>
  )
}
