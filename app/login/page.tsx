'use client'

import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })

    if (error) {
      console.log(error.message)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-green-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-bold mb-6 text-green-700">
          Bon-accueil Hotel
        </h1>

        <button
          onClick={signInWithGoogle}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Se connecter avec Google
        </button>
      </div>
    </div>
  )
}