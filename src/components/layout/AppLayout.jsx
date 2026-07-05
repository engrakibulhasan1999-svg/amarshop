import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Sidebar, MobileSidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      <Sidebar />
      <AnimatePresence>
        {mobileOpen && (
          <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
        )}
      </AnimatePresence>
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
