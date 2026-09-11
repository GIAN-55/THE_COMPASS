import { Plus, Trash2, X } from 'lucide-preact'
import { useTranslation } from '../i18n/context'
import {
  activeConversationId,
  conversations,
  deleteTargetId,
  sidebarOpen,
} from '../state/appState'

interface SidebarProps {
  onNewConversation: () => void
}

export function Sidebar({ onNewConversation }: SidebarProps) {
  const { t } = useTranslation()
  const open = sidebarOpen.value
  const list = conversations.value

  return (
    <>
      {open && (
        <div
          class="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => { sidebarOpen.value = false }}
        />
      )}
      <aside
        class={`fixed md:static inset-y-0 left-0 z-40 w-72 flex flex-col border-r border-[var(--border)] bg-[var(--surface)] transform transition-transform md:transform-none ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div class="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <button type="button" class="btn-primary flex-1 flex items-center justify-center gap-2" onClick={onNewConversation}>
            <Plus size={18} />
            {t('newConversation')}
          </button>
          <button
            type="button"
            class="icon-btn ml-2 md:hidden"
            onClick={() => { sidebarOpen.value = false }}
            aria-label={t('cancel')}
          >
            <X size={18} />
          </button>
        </div>
        <nav class="flex-1 overflow-y-auto p-2 space-y-1">
          {list.map((conv) => {
            const active = conv.id === activeConversationId.value
            return (
              <div
                key={conv.id}
                class={`group flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer ${
                  active ? 'bg-[var(--accent-muted)] text-[var(--accent)]' : 'hover:bg-[var(--surface-elevated)]'
                }`}
              >
                <button
                  type="button"
                  class="flex-1 text-left text-sm truncate"
                  onClick={() => {
                    activeConversationId.value = conv.id
                    sidebarOpen.value = false
                  }}
                >
                  {conv.title}
                </button>
                <button
                  type="button"
                  class="icon-btn opacity-0 group-hover:opacity-100"
                  aria-label={t('deleteConversation')}
                  onClick={() => { deleteTargetId.value = conv.id }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
