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
