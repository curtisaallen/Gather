
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, MapPin, Plus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import type { Event } from '../types/event'

const API_URL = 'https://gather-production-f9af.up.railway.app'

export default function MyEvents() {
  const { user, loading: authLoading } = useAuth()

  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      setLoading(false)
      return
    }

    const controller = new AbortController()

    async function fetchMyEvents() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(`${API_URL}/events/`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Unable to load your events.')
        }

        const data: { events: Event[] } = await response.json()

        setEvents(
          data.events.filter((event) => event.user_id === user!.id)
        )
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error ? err.message : 'Something went wrong.'
          )
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchMyEvents()

    return () => controller.abort()
  }, [user, authLoading])

  if (authLoading || loading) {
    return <main className="p-10 text-center">Loading events...</main>
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold">My Events</h1>
        <p className="mt-4 text-gray-600">
          Please log in to manage your events.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-block rounded-lg bg-violet-600 px-6 py-3 text-white"
        >
          Log In
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            My Events
          </h1>
          <p className="mt-2 text-gray-600">
            Manage the events you've created.
          </p>
        </div>

        <Link
          to="/create-event"
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-700"
        >
          <Plus size={18} />
          Create Event
        </Link>
      </div>

      {error && (
        <p role="alert" className="mb-6 text-red-600">
          {error}
        </p>
      )}

      {!error && events.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
          <CalendarDays size={42} className="mx-auto text-violet-500" />
          <h2 className="mt-4 text-xl font-bold">
            You haven't created any events yet.
          </h2>
          <p className="mt-2 text-gray-600">
            Create your first event and share it with the community.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <article
              key={event.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm"
            >
              <img
                src={event.image_url || 'https://placehold.co/600x400/png'}
                alt={event.name}
                className="h-44 w-full object-cover"
              />

              <div className="p-5">
                <h2 className="text-lg font-bold text-slate-900">
                  {event.name}
                </h2>

                <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} className="text-violet-600" />
                  {event.location}
                </p>

                <p className="mt-2 font-semibold text-violet-600">
                  {event.price === 0 ? 'Free' : `$${event.price}`}
                </p>

                <div className="mt-5 flex gap-3">
                  <Link
                    to={`/events/${event.id}`}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium"
                  >
                    View
                  </Link>

                  <Link
                    to={`/events/${event.id}/edit`}
                    className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
