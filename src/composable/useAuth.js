import { useSupabase } from "./useSupabase";
const { supabase } = useSupabase();


export async function login  ( email ) {
    console.log('email', email)
    const user = await supabase.from('tps_usuario').select()
    console.log('user', user)
    debugger
    const { data, error } = await supabase.auth.signInWithOtp({email})
    if (error){
        console.log('error', error)
        throw error
    } 
}

export async function getSession  ({ email }) {
    const { data, error } = await supabase.auth.getSession()
    
        if (error) throw error
    
        if (data.session && data.session.user) {
          setUser(data.session.user)
        }
    
        return data.session
}