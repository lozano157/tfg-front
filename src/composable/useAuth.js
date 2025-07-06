import { useSupabase } from "./useSupabase";

import { useUser } from "./useUser";

const { supabase } = useSupabase();

import {store} from '@/stores/store'


export async function login  ( email ) {
    
    console.log('email', email)
    let url = import.meta.env.VITE_API_URL + '/paradas'
    console.log('url', url)
    const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: { 
            emailRedirectTo: import.meta.env.VITE_API_URL + '/paradas'
        }
    
    })
    if (error){
        console.log('error', error)
        throw error
    } 
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error){
        console.log('error', error)
        throw error
  } 
}

export async function getSession  () {

    const { setUser } = useUser()
    
    
        const { data, error } = await supabase.auth.getSession()
    
        if (error) {
            setUser(null)
            store.commit('setAuthenticated', false)
            throw error
        }
    
        if (data.session && data.session.user) {
            console.log('data.session.user', data.session.user)
            setUser(data.session.user)
            store.commit('setAuthenticated', true)
        }
    
        return data.session
}