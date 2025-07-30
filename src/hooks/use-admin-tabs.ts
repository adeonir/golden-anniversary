import { useQueryState } from 'nuqs'
import { useEffect } from 'react'
import { config, type AdminTabValue } from '~/lib/config'

export function useAdminTabs() {
  const [activeTab, setActiveTab] = useQueryState<AdminTabValue>('tab', {
    parse: (value): AdminTabValue => (value === config.admin.tabs.photos ? config.admin.tabs.photos : config.admin.tabs.messages),
    serialize: (value) => value,
  })

  // Garante que sempre tenha o parâmetro tab na URL
  useEffect(() => {
    if (activeTab === null) {
      setActiveTab(config.admin.tabs.messages)
    }
  }, [activeTab, setActiveTab])

  const handleTabChange = (value: string) => {
    const tabValue = value as AdminTabValue
    setActiveTab(tabValue)
  }

  return {
    activeTab: activeTab || config.admin.tabs.messages,
    setActiveTab: handleTabChange,
  }
}