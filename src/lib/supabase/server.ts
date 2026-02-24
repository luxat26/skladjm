import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {
          // U domácí appky cookies neřešíme, auth jsme zrušili
        },
      },
      // Nasměrování do našeho nového domácího schématu!
      db: {
        schema: 'jm',
      },
    }
  )
}