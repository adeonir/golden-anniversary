'use client'

import { Images, MessageSquare } from 'lucide-react'
import type { SVGProps } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { useAdminTabs } from '~/hooks/use-admin-tabs'
import { config } from '~/lib/config'
import { LogoutButton } from './logout-button'
import { MemoriesTab } from './memories-tab'
import { MessagesTab } from './messages-tab'

export function Dashboard() {
  const { activeTab, setActiveTab } = useAdminTabs()

  return (
    <div className="admin-theme flex min-h-screen flex-col gap-8 bg-zinc-100 p-8">
      <header className="rounded-lg bg-white px-8 py-6 shadow-lg shadow-zinc-700/10">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 font-bold text-lg text-zinc-900">
            <BrandLogo className="h-auto w-8" /> Painel Administrativo
          </h1>
          <LogoutButton className="w-fit" />
        </div>
      </header>

      <main className="flex flex-1 rounded-lg bg-white p-8 shadow-lg shadow-zinc-700/15">
        <Tabs className="flex flex-1 flex-col gap-8" onValueChange={setActiveTab} value={activeTab}>
          <TabsList>
            <TabsTrigger value={config.admin.tabs.messages}>
              <MessageSquare className="mr-2 size-4" />
              Mensagens
            </TabsTrigger>
            <TabsTrigger value={config.admin.tabs.memories}>
              <Images className="mr-2 size-4" />
              Memórias
            </TabsTrigger>
          </TabsList>

          <TabsContent value={config.admin.tabs.messages}>
            <MessagesTab />
          </TabsContent>

          <TabsContent value={config.admin.tabs.memories}>
            <MemoriesTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function BrandLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 70 40" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>Logo</title>
      <path
        d="M37.2551 1.61586C38.1803 0.653384 39.4368 0.112671 40.7452 0.112671C46.6318 0.112671 52.1793 0.112674 57.6424 0.112685C68.6302 0.112708 74.1324 13.9329 66.3629 22.0156L49.4389 39.6217C48.662 40.43 47.3335 39.8575 47.3335 38.7144V23.2076L49.2893 21.1729C50.8432 19.5564 49.7427 16.7923 47.5451 16.7923H22.6667L37.2551 1.61586Z"
        fill="currentColor"
      />
      <path
        d="M32.7449 38.3842C31.8198 39.3467 30.5633 39.8874 29.2549 39.8874C23.3683 39.8874 17.8208 39.8874 12.3577 39.8874C1.36983 39.8873 -4.13236 26.0672 3.63721 17.9844L20.5612 0.378369C21.3381 -0.429908 22.6666 0.142547 22.6666 1.28562L22.6667 16.7923L20.7108 18.8271C19.1569 20.4437 20.2574 23.2077 22.455 23.2077L47.3335 23.2076L32.7449 38.3842Z"
        fill="currentColor"
      />
    </svg>
  )
}
