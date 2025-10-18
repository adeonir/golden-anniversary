'use client'

import { Images, MessageSquare } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { useAdminTabs } from '~/hooks/use-admin-tabs'
import { config } from '~/lib/config'
import { LogoutButton } from './logout-button'
import { MemoriesTab } from './memories-tab'
import { MessagesTab } from './messages-tab'

export function Dashboard() {
  const { activeTab, setActiveTab } = useAdminTabs()

  return (
    <div className="admin-theme flex h-screen flex-col gap-8 overflow-hidden bg-zinc-100 p-8">
      <header className="flex-shrink-0 rounded-lg bg-white px-8 py-6 shadow-lg shadow-zinc-700/10">
        <div className="flex items-center justify-between">
          <Tabs onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="flex-shrink-0">
              <TabsTrigger value={config.admin.tabs.messages}>
                <MessageSquare className="mr-2 size-4" />
                Mensagens
              </TabsTrigger>
              <TabsTrigger value={config.admin.tabs.memories}>
                <Images className="mr-2 size-4" />
                Memórias
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <LogoutButton className="w-fit" />
        </div>
      </header>

      <main className="flex min-h-0 flex-1 rounded-lg bg-white p-8 shadow-lg shadow-zinc-700/15">
        <Tabs className="flex min-h-0 flex-1 flex-col" onValueChange={setActiveTab} value={activeTab}>
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
