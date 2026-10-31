
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API_URL = 'https://gather-production-f9af.up.railway.app'

export default function CreateEvent() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()

  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('0')
  const [capacity, setCapacity] = useState('50')
  const [imageUrl, setImageUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const token = sessionStorage.getItem('gather_token')

    if (!token) {
      setError('Please log in to create an event.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/events/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          location,
          description,
          price: Number(price),
          capacity: Number(capacity),
          image_url: imageUrl.trim() || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)

        throw new Error(
          typeof data?.detail === 'string'
            ? data.detail
            : 'Unable to create event.'
        )
      }

      const event: { id: number } = await response.json()
      navigate(`/events/${event.id}`)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading) {
    return <main className="p-10 text-center">Loading...</main>
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold">Create an Event</h1>
        <p className="mt-4 text-gray-600">
          Please log in before creating an event.
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

  const inputClass =
    'mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-violet-600'

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Create an Event
        </h1>
        <p className="mt-2 text-gray-600">
          Share your event with the Gather community.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl bg-white p-6 shadow-sm md:p-8"
      >
        <div>
          <label htmlFor="name" className="font-medium">
            Event Name
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Atlanta Developer Meetup"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="location" className="font-medium">
            Location
          </label>
          <input
            id="location"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Atlanta, GA"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="description" className="font-medium">
            Description
          </label>
          <textarea
            id="description"
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell people what your event is about..."
            className={inputClass}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="font-medium">
              Price ($)
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="capacity" className="font-medium">
              Capacity
            </label>
            <input
              id="capacity"
              type="number"
              min="1"
              step="1"
              required
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="imageUrl" className="font-medium">
            Image URL (optional)
          </label>
          <input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/event.jpg"
            className={inputClass}
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-violet-600 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
        >
          {submitting ? 'Creating Event...' : 'Create Event'}
        </button>
      </form>
    </main>
  )
}
