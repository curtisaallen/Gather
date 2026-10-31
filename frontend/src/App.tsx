
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturedEvents from './components/FeaturedEvents'
import EventDetails from './components/EventDetails'
import Login from './components/Login'
import Register from './components/Register'
import CreateEvent from './components/CreateEvent'
import EditEvent from './components/EditEvent'
import MyEvents from './components/MyEvents'
import EventsPage from './components/EventsPage'
import About from './components/About'
import Footer from './components/Footer'

function Home() {
  return (
    <>
      <Hero />
      <FeaturedEvents />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/create-event" element={<CreateEvent />} />
                <Route path="/events/:id/edit" element={<EditEvent />} />
                <Route path="/my-events" element={<MyEvents />} />
              </Routes>
            </div>

            <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
