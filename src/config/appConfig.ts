const REQUIRED_KEYS = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY'] as const

type RequiredKey = (typeof REQUIRED_KEYS)[number]

export interface AppConfig {
  readonly supabaseUrl: string
  readonly supabaseKey: string
  readonly authRedirectUrl: string
}

export type ConfigResult =
  | { readonly ok: true; readonly config: AppConfig }
  | { readonly ok: false; readonly missingKeys: readonly RequiredKey[] }

export function loadConfig(env: ImportMetaEnv = import.meta.env): ConfigResult {
  const read = (key: RequiredKey): string => env[key]?.trim() ?? ''
  const missingKeys = REQUIRED_KEYS.filter((key) => read(key) === '')

  if (missingKeys.length > 0) {
    return { ok: false, missingKeys }
  }

  return {
    ok: true,
    config: {
      supabaseUrl: read('VITE_SUPABASE_URL'),
      supabaseKey: read('VITE_SUPABASE_PUBLISHABLE_KEY'),
      authRedirectUrl: new URL(env.BASE_URL, window.location.origin).toString(),
    },
  }
}
