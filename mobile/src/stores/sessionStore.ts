// NOTE: Module-level mutable state below is temporary demo infrastructure
// and will be replaced by persistent stores in a later PR.

let session: Record<string, unknown> = {}

export const sessionStore = {
  async get(key: string): Promise<unknown> {
    return session[key]
  },

  async set(key: string, value: unknown): Promise<void> {
    session[key] = value
  },

  async clear(): Promise<void> {
    session = {}
  },
}
