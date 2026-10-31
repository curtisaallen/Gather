
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Users, Ticket } from 'lucide-react'
import type { Event } from '../types/event'
import { useAuth } from '../context/AuthContext'

const API_URL = 'https://gather-production-f9af.up.railway.app'

export default function EventDetails() {
  const { id } = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()

  const [joining, setJoining] = useState(false)
  const [joinError, setJoinError] = useState('')
  const [isAttending, setIsAttending] = useState(false)
  const [checkingAttendance, setCheckingAttendance] = useState(true)
  const isOwner = Boolean(user && event && user.id === event.user_id)
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function fetchEvent() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(`${API_URL}/events/${id}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? 'Event not found'
              : 'Failed to load event'
          )
        }

        const data: Event = await response.json()
        setEvent(data)
      } catch (err) {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchEvent()
    return () => controller.abort()
  }, [id])


useEffect(() => {
  const token = sessionStorage.getItem('gather_token')

  if (!user || !token || !id) {
    setIsAttending(false)
    setCheckingAttendance(false)
    return
  }

  const controller = new AbortController()

  async function checkAttendance() {
    setCheckingAttendance(true)

    try {
      const response = await fetch(
        `${API_URL}/events/${id}/my-attendance`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        }
      )

      if (!response.ok) {
        throw new Error('Unable to check attendance')
      }

      const data: { is_attending: boolean } = await response.json()

      setIsAttending(data.is_attending)
    } catch (err) {
      if (!controller.signal.aborted) {
        setJoinError('Unable to load your attendance status.')
      }
    } finally {
      if (!controller.signal.aborted) {
        setCheckingAttendance(false)
      }
    }
  }

  checkAttendance()

  return () => controller.abort()
}, [id, user])



async function handleJoinEvent() {
  const token = sessionStorage.getItem('gather_token')

  if (!token) {
    setJoinError('Please log in to join this event.')
    return
  }

  setJoining(true)
  setJoinError('')

  try {
    const response = await fetch(`${API_URL}/events/${id}/going`, {
      method: isAttending ? 'DELETE' : 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const data = await response.json().catch(() => null)

      throw new Error(
        typeof data?.detail === 'string'
          ? data.detail
          : 'Unable to update attendance.'
      )
    }

    setIsAttending(!isAttending)
  } catch (err) {
    setJoinError(
      err instanceof Error ? err.message : 'Something went wrong.'
    )
  } finally {
    setJoining(false)
  }
}


async function handleDeleteEvent() {
  if (!event || !user || user.id !== event.user_id) {
    setDeleteError('You cannot delete this event.')
    return
  }

  const confirmed = window.confirm(
    `Are you sure you want to delete "${event.name}"? This cannot be undone.`
  )

  if (!confirmed) return

  const token = sessionStorage.getItem('gather_token')

  if (!token) {
    setDeleteError('Please log in again.')
    return
  }

  setDeleting(true)
  setDeleteError('')

  try {
    const response = await fetch(`${API_URL}/events/${event.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const data = await response.json().catch(() => null)

      throw new Error(
        typeof data?.detail === 'string'
          ? data.detail
          : 'Unable to delete event.'
      )
    }

    navigate('/events')
  } catch (err) {
    setDeleteError(
      err instanceof Error ? err.message : 'Something went wrong.'
    )
  } finally {
    setDeleting(false)
  }
}


  if (loading) {
    return <p className="mx-auto max-w-6xl px-6 py-16">Loading event...</p>
  }

  if (error || !event) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16">
        <p role="alert" className="text-red-600">
          {error || 'Event not found'}
        </p>
        <Link to="/" className="mt-4 inline-block text-violet-600">
          Back to events
        </Link>
      </div>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-violet-600"
      >
        <ArrowLeft size={18} />
        Back to Events
      </Link>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <img
          src={event.image_url || 'https://placehold.co/1200x600/png'}
          alt={event.name}
          className="h-64 w-full object-cover md:h-96"
        />

        <div className="grid gap-10 p-6 md:grid-cols-[1fr_280px] md:p-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              {event.name}
            </h1>


            {isOwner && (
              <div className="mt-5 flex gap-3">
                <Link
                  to={`/events/${event.id}/edit`}
                  className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  Edit Event
                </Link>

                <button
                  type="button"
                  onClick={handleDeleteEvent}
                  disabled={deleting}
                  className="rounded-lg border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  {deleting ? 'Deleting...' : 'Delete Event'}
                </button>
              </div>
            )}

            {deleteError && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {deleteError}
              </p>
            )}

            <p className="mt-5 flex items-center gap-2 text-gray-600">
              <MapPin size={20} className="text-violet-600" />
              {event.location}
            </p>

            <h2 className="mt-10 text-xl font-bold">About This Event</h2>

            <p className="mt-3 leading-7 text-gray-600">
              {event.description}
            </p>
          </div>

          <aside className="h-fit rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2">
              <Ticket size={20} className="text-violet-600" />
              <span className="text-2xl font-bold">
                {event.price === 0 ? 'Free' : `$${event.price}`}
              </span>
            </div>

            <p className="mt-5 flex items-center gap-2 text-gray-600">
              <Users size={20} className="text-violet-600" />
              Capacity: {event.capacity}
            </p>

            {!user ? (
              <Link
                to="/login"
                className="mt-8 block w-full rounded-lg bg-violet-600 py-3 text-center font-semibold text-white hover:bg-violet-700"
              >
                Log In to Join
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleJoinEvent}
                disabled={joining || checkingAttendance}
                className={`mt-8 w-full rounded-lg py-3 font-semibold transition disabled:opacity-50 ${
                  isAttending
                    ? 'border border-red-300 bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-violet-600 text-white hover:bg-violet-700'
                }`}
              >
                {checkingAttendance
                  ? 'Checking Attendance...'
                  : joining
                    ? 'Updating...'
                    : isAttending
                      ? 'Cancel Attendance'
                      : 'Join Event'}
              </button>
            )}

            {isAttending && (
              <p role="status" className="mt-3 text-center text-sm font-medium text-green-600">
                ✓ You're registered for this event!
              </p>
            )}

            {joinError && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {joinError}
              </p>
            )}


          </aside>
        </div>
      </div>
    </main>
  )
}
