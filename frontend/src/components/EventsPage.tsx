
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MapPin, Search } from 'lucide-react'
import type { Event } from '../types/event'

const API_URL = 'https://gather-production-f9af.up.railway.app'

export default function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const query = searchParams.get('q') || ''
  const location = searchParams.get('location') || ''

  const [search, setSearch] = useState(query)
  const [city, setCity] = useState(location)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchEvents() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(`${API_URL}/events/`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Unable to load events.')
        }

        const data: { events: Event[] } = await response.json()
        setEvents(data.events)
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

    fetchEvents()

    return () => controller.abort()
  }, [])

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(query.toLowerCase()) ||
      event.description.toLowerCase().includes(query.toLowerCase())

    const matchesLocation = event.location
      .toLowerCase()
      .includes(location.toLowerCase())

    return matchesSearch && matchesLocation
  })

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const params: Record<string, string> = {}

    if (search.trim()) params.q = search.trim()
    if (city.trim()) params.location = city.trim()

    setSearchParams(params)
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">
          Explore Events
        </h1>
        <p className="mt-2 text-gray-600">
          Discover events happening in your community.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="mb-10 grid gap-4 rounded-2xl bg-white p-5 shadow-sm md:grid-cols-[1fr_1fr_auto]"
      >
        <input
          type="search"
          placeholder="Search events..."
          aria-label="Search events"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-3"
        />

        <input
          type="text"
          placeholder="City or location"
          aria-label="City or location"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-3"
        />

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700"
        >
          <Search size={18} />
          Search
        </button>
      </form>

      {loading ? (
        <p>Loading events...</p>
      ) : error ? (
        <p role="alert" className="text-red-600">{error}</p>
      ) : filteredEvents.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center">
          <h2 className="text-xl font-bold">No events found</h2>
          <p className="mt-2 text-gray-600">
            Try a different search or location.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-5 text-sm text-gray-600">
            Showing {filteredEvents.length} event(s)
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
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
                  <h2 className="text-lg font-bold">{event.name}</h2>

                  <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} />
                    {event.location}
                  </p>

                  <p className="mt-3 font-semibold text-violet-600">
                    {event.price === 0 ? 'Free' : `$${event.price}`}
                  </p>

                  <Link
                    to={`/events/${event.id}`}
                    className="mt-5 inline-block rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  )
}
