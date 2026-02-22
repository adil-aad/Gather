import React, { useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Loading from '../components/Loading.jsx'
import { useSelector } from 'react-redux'

const Layout = () => {
  const user = useSelector((state) => state.user.value)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return user ? (
    <div className='w-full flex h-screen overflow-hidden'>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {sidebarOpen && (
        <div
          className='fixed inset-0 z-20 bg-slate-900/25 backdrop-blur-[1px] sm:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className='flex-1 bg-slate-50'>
        <Outlet />
      </div>

      {sidebarOpen ? (
        <button
          type='button'
          className='absolute top-3 right-3 z-40 rounded-xl bg-white/90 p-2 shadow text-slate-700 sm:hidden'
          onClick={() => setSidebarOpen(false)}
          aria-label='Close sidebar'
        >
          <X className='h-6 w-6' />
        </button>
      ) : (
        <button
          type='button'
          className='absolute top-3 right-3 z-40 rounded-xl bg-white/90 p-2 shadow text-slate-700 sm:hidden'
          onClick={() => setSidebarOpen(true)}
          aria-label='Open sidebar'
        >
          <Menu className='h-6 w-6' />
        </button>
      )}
    </div>
  ) : (
    <Loading />
  )
}

export default Layout
