
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Search } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  console.log('Gather Auth:', { user, loading })

  function handleLogout() {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="border-b border-gray-100 bg-white">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="text-3xl font-bold text-violet-900">
          Gather
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link to="/events" className="hover:text-violet-600">
            Events
          </Link>
          <Link to="/about" className="hover:text-violet-600">
            About
          </Link>
          <Link to="/create-event" className="hover:text-violet-600">
            Create Event
          </Link>
          {user && (
            <Link to="/my-events">
              My Events
            </Link>
          )}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Search size={20} />

          {!loading && (
            user ? (
              <>
                <span className="text-sm text-gray-700">
                  Hi, {user.name}
                </span>

                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium">
                  Log In
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
                >
                  Sign Up
                </Link>
              </>
            )
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden"
        >
          <Menu size={26} />
        </button>
      </nav>

      {menuOpen && (
        <div className="flex flex-col gap-4 border-t border-gray-100 px-6 py-5 text-sm md:hidden">
          <Link to="/events" onClick={() => setMenuOpen(false)}>
            Events
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>
          <Link to="/create-event" onClick={() => setMenuOpen(false)}>
            Create Event
          </Link>

          {!loading && (
            user ? (
              <>
                <span>Hi, {user.name}</span>
                <button onClick={handleLogout} className="text-left text-violet-600">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  Log In
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )
          )}
        </div>
      )}
    </header>
  )
}
