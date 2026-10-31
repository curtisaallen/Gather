
import { useEffect, useState } from 'react'
import { MapPin} from 'lucide-react'
import type { Event } from '../types/event'
import { Link } from 'react-router-dom'

const API_URL = 'https://gather-production-f9af.up.railway.app'

export default function FeaturedEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function fetchEvents() {
      try {
        const response = await fetch(`${API_URL}/events/`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Failed to load events')
        }

        const data: { events: Event[] } = await response.json()
        setEvents(data.events)
      } catch (err) {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchEvents()

    return () => controller.abort()
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900">
          Featured Events
        </h2>


<Link
  to="/events"
  className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
>
  View All Events
</Link>

      </div>

      {loading && <p className="text-gray-500">Loading events...</p>}

      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}

      {!loading && !error && events.length === 0 && (
        <p className="text-gray-500">No events available yet.</p>
      )}

      {!loading && !error && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <article
              key={event.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg"
            >
              <div className="relative">
                <img
                  src={event.image_url || 'https://placehold.co/800x500/png'}
                  alt={event.name}
                  className="h-52 w-full object-cover"
                />

                <span className="absolute left-4 top-4 rounded-full bg-white px-4 py-1 text-sm font-semibold text-violet-700 shadow">
                  {event.price === 0 ? 'Free' : `$${event.price}`}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-slate-900">
                  {event.name}
                </h3>

                <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <MapPin size={16} />
                  {event.location}
                </p>

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                  {event.description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Capacity: {event.capacity}
                  </span>

                  <a
                    href={`/events/${event.id}`}
                    className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
