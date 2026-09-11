import { ConfirmDialog } from './components/ConfirmDialog'
import { ChatWindow } from './components/ChatWindow'
import { DisclaimerModal } from './components/DisclaimerModal'
import { SettingsModal } from './components/SettingsModal'
import { Sidebar } from './components/Sidebar'
import { TopBar, handleThemeToggle } from './components/TopBar'
import { useAppInit } from './hooks/useAppInit'
import { useChatActions } from './hooks/useChatActions'

export function App() {
  useAppInit()
  const { createConversation, removeConversation, sendMessage } = useChatActions()

  return (
    <div class="flex h-screen flex-col bg-[var(--bg)]">
      <TopBar onToggleTheme={handleThemeToggle} />
      <div class="flex flex-1 min-h-0">
        <Sidebar onNewConversation={() => createConversation()} />
        <ChatWindow onSend={sendMessage} />
      </div>
      <SettingsModal />
      <DisclaimerModal />
      <ConfirmDialog onConfirm={removeConversation} />
    </div>
  )
}
