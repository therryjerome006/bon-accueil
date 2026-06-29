'use client'

import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function Navbar() {
  const { user } = useAuth()

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow">
      <h1 className="text-green-700 font-bold">Bon-accueil Hotel</h1>

      <div className="flex gap-4 items-center">
        <Link href="/">Accueil</Link>
        <Link href="/rooms">Chambres</Link>

        {!user ? (
          <Link
            href="/login"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Login
          </Link>
        ) : (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <button onClick={logout} className="text-red-500">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}