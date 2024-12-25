import { createClient } from "@supabase/supabase-js"
import { useUser } from "./useUser"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

supabase.auth.onAuthStateChange((event, session) => {
  const { setUser } = useUser()

  setUser(session?.user)
})

export  function useSupabase() {
    return { supabase }
}