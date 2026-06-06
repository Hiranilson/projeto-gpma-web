import type { constants } from '@/utils'

type Key = ExtractValueOf<typeof constants.localStorageKeys>

const storage = {
  local: {
    get: (key: Key) => localStorage.getItem(key),
    set: (key: Key, value: string) => localStorage.setItem(key, value),
    delete: (key: Key) => localStorage.removeItem(key),
    clear: () => localStorage.clear(),
  },
}
export default storage
