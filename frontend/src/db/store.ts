import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import {
  DEFAULT_PREFERENCES,
  DEFAULT_PROVIDER_CONFIG,
  type Conversation,
  type Preferences,
  type ProviderConfig,
} from './types'

type StoredPreferences = Preferences & { key: string }
type StoredProviderConfig = ProviderConfig & { key: string }

interface CompassDB extends DBSchema {
  conversations: { key: string; value: Conversation }
  preferences: { key: string; value: StoredPreferences }
  providerConfig: { key: string; value: StoredProviderConfig }
}

const DB_NAME = 'compass'
const DB_VERSION = 1
const MAIN_KEY = 'main'

let dbPromise: Promise<IDBPDatabase<CompassDB>> | null = null

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<CompassDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore('conversations', { keyPath: 'id' })
        db.createObjectStore('preferences', { keyPath: 'key' })
        db.createObjectStore('providerConfig', { keyPath: 'key' })
      },
    })
  }
  return dbPromise
}

export async function loadConversations(): Promise<Conversation[]> {
  const db = await getDb()
  const all = await db.getAll('conversations')
  return all.sort((a, b) => b.updatedAt - a.updatedAt)
}

export async function saveConversation(conversation: Conversation): Promise<void> {
  const db = await getDb()
  await db.put('conversations', conversation)
}

export async function deleteConversation(id: string): Promise<void> {
  const db = await getDb()
  await db.delete('conversations', id)
}

export async function loadPreferences(): Promise<Preferences> {
  const db = await getDb()
  const stored = await db.get('preferences', MAIN_KEY)
  if (!stored) return { ...DEFAULT_PREFERENCES }
  const { theme, disclaimerAccepted } = stored
  return { theme, disclaimerAccepted }
}

export async function savePreferences(prefs: Preferences): Promise<void> {
  const db = await getDb()
  await db.put('preferences', { ...prefs, key: MAIN_KEY })
}

export async function loadProviderConfig(): Promise<ProviderConfig> {
  const db = await getDb()
  const stored = await db.get('providerConfig', MAIN_KEY)
  if (!stored) return { ...DEFAULT_PROVIDER_CONFIG }
  const { mode, provider, model, apiKey } = stored
  return { mode, provider, model, apiKey }
}

export async function saveProviderConfig(config: ProviderConfig): Promise<void> {
  const db = await getDb()
  await db.put('providerConfig', { ...config, key: MAIN_KEY })
}
