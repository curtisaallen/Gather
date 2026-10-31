
import { useState } from 'react'
import { Search, MapPin, CalendarDays, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Hero() {
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('Atlanta, GA')
  const [date, setDate] = useState('')
  const navigate = useNavigate()


function handleSearch(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()

  const params = new URLSearchParams()

  if (search.trim()) {
    params.set('q', search.trim())
  }

  if (location.trim()) {
    params.set('location', location.trim())
  }

  navigate(`/events?${params.toString()}`)
}


  return (
    <section
      className="relative bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(12, 17, 38, 0.78), rgba(12, 17, 38, 0.12)), url('https://images.unsplash.com/photo-1575917649705-5b59aaa12e6b?auto=format&fit=crop&w=2000&q=85')",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
            Find Events.
            <br />
            Meet People.
            <br />
            <span className="text-violet-400">
              Belong Together.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/90">
            Discover local events, connect with like-minded people,
            and turn shared interests into real-world experiences.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="mt-10 grid gap-3 rounded-2xl bg-white p-3 shadow-xl md:grid-cols-[2fr_1fr_1fr_auto] md:items-center"
        >
          <label className="flex items-center gap-3 px-3">
            <Search className="shrink-0 text-gray-500" size={21} />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events, topics, or locations..."
              className="w-full min-w-0 py-3 text-sm text-gray-900 outline-none"
            />
          </label>

          <label className="flex items-center gap-2 border-gray-200 px-3 md:border-l">
            <MapPin size={20} className="shrink-0 text-gray-600" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              aria-label="Location"
              className="w-full min-w-0 py-3 text-sm text-gray-900 outline-none"
            />
          </label>

          <label className="flex items-center gap-2 border-gray-200 px-3 md:border-l">
            <CalendarDays size={20} className="shrink-0 text-gray-600" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-label="Event date"
              className="w-full min-w-0 py-3 text-sm text-gray-900 outline-none"
            />
          </label>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-8 py-3 font-semibold text-white transition hover:bg-violet-700"
          >
            Search
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </section>
  )
}
