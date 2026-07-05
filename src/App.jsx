import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ThemeSync } from '@/components/ThemeSync'
import { Toaster } from '@/components/ui/toaster'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAuthStore } from '@/store/useAuthStore'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import Projects from '@/pages/Projects'
import Boq from '@/pages/Boq'
import Materials from '@/pages/Materials'
import Cost from '@/pages/Cost'
import Reports from '@/pages/Reports'
import QuickEstimate from '@/pages/QuickEstimate'
import Settings from '@/pages/Settings'

function RequireAuth({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

export default function App() {
  const location = useLocation()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return (
    <>
      <ThemeSync />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
          />
          <Route
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/boq" element={<Boq />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/cost" element={<Cost />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/quick-estimate" element={<QuickEstimate />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <Toaster />
    </>
  )
}
