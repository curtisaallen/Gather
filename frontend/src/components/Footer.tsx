
import { Link } from 'react-router-dom'
import { CalendarDays, Code2 } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-bold text-violet-700"
            >
              <CalendarDays size={28} />
              Gather
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-gray-600">
              Discover local events, meet new people,
              and bring your community together.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Explore
            </h2>

            <nav
              aria-label="Footer navigation"
              className="mt-4 flex flex-col gap-3 text-sm text-gray-600"
            >
              <Link to="/" className="hover:text-violet-600">
                Home
              </Link>

              <Link to="/events" className="hover:text-violet-600">
                Explore Events
              </Link>

              <Link to="/about" className="hover:text-violet-600">
                About Gather
              </Link>

              <Link to="/create-event" className="hover:text-violet-600">
                Create Event
              </Link>
            </nav>
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Connect
            </h2>

            <p className="mt-4 text-sm text-gray-600">
              Gather is a full-stack portfolio project
              built with React, TypeScript, FastAPI,
              and PostgreSQL.
            </p>

            <a
              href="https://github.com/curtisaallen/Gather"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-800"
            >
              <Code2 size={18} />
              View on GitHub
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Gather. Built with React & FastAPI.
        </div>
      </div>
    </footer>
  )
}
