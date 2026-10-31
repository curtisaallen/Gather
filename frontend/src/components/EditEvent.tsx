
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { Event } from '../types/event'

const API_URL = 'https://gather-production-f9af.up.railway.app'

export default function EditEvent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()

  const [event, setEvent] = useState<Event | null>(null)
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('0')
  const [capacity, setCapacity] = useState('50')
  const [imageUrl, setImageUrl] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function fetchEvent() {
      try {
        const response = await fetch(`${API_URL}/events/${id}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Unable to load event.')
        }

        const data: Event = await response.json()

        setEvent(data)
        setName(data.name)
        setLocation(data.location)
        setDescription(data.description)
        setPrice(String(data.price))
        setCapacity(String(data.capacity))
        setImageUrl(data.image_url || '')
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

    fetchEvent()

    return () => controller.abort()
  }, [id])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!user || !event || user.id !== event.user_id) {
      setError('You do not have permission to edit this event.')
      return
    }

    const token = sessionStorage.getItem('gather_token')

    if (!token) {
      setError('Please log in again.')
      return
    }

    setSaving(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/events/${id}`, {
        method: 'PATCH',
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
            : 'Unable to update event.'
        )
      }

      navigate(`/events/${id}`)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong.'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading || authLoading) {
    return <main className="p-10 text-center">Loading event...</main>
  }

  if (error && !event) {
    return <main role="alert" className="p-10 text-center text-red-600">{error}</main>
  }

  if (!user || !event || user.id !== event.user_id) {
    return (
      <main className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-3 text-gray-600">
          You can only edit events you've created.
        </p>
        <Link to="/" className="mt-5 inline-block text-violet-600">
          Back to Events
        </Link>
      </main>
    )
  }

  const inputClass =
    'mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-violet-600'

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">
        Edit Event
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl bg-white p-6 shadow-sm md:p-8"
      >
        <div>
          <label htmlFor="name" className="font-medium">Event Name</label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="location" className="font-medium">Location</label>
          <input
            id="location"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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
            className={inputClass}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="font-medium">Price ($)</label>
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
            <label htmlFor="capacity" className="font-medium">Capacity</label>
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
            Image URL
          </label>
          <input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className={inputClass}
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          <Link
            to={`/events/${id}`}
            className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  )
}
