
import { Link } from 'react-router-dom'
import { CalendarDays, Users, Search } from 'lucide-react'

export default function About() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-slate-900">
          About Gather
        </h1>

        <p className="mt-6 text-lg leading-8 text-gray-600">
          Gather is a community event discovery platform
          that helps people find local events, connect with
          others, and create memorable experiences.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <Search size={36} className="mx-auto text-violet-600" />
          <h2 className="mt-5 text-xl font-bold">
            Discover Events
          </h2>
          <p className="mt-3 text-gray-600">
            Explore community events and find experiences
            that match your interests.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <CalendarDays size={36} className="mx-auto text-violet-600" />
          <h2 className="mt-5 text-xl font-bold">
            Create Events
          </h2>
          <p className="mt-3 text-gray-600">
            Organize events, share details, and bring
            your community together.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <Users size={36} className="mx-auto text-violet-600" />
          <h2 className="mt-5 text-xl font-bold">
            Join the Community
          </h2>
          <p className="mt-3 text-gray-600">
            Register for events and connect with people
            who share your interests.
          </p>
        </div>
      </div>

      <div className="mt-16 text-center">
        <Link
          to="/events"
          className="inline-block rounded-lg bg-violet-600 px-8 py-3 font-semibold text-white hover:bg-violet-700"
        >
          Explore Events
        </Link>
      </div>
    </main>
  )
}
