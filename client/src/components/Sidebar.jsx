import React from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import MenuItems from './MenuItems'
import { CirclePlus, LogOut, Moon, Sun } from 'lucide-react'
import { UserButton, useClerk } from '@clerk/clerk-react'
import { useSelector } from 'react-redux'
import { useTheme } from './ThemesContext'

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const user = useSelector((state) => state.user.value)
  const { signOut } = useClerk()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  return (
    <aside
      className={`w-72 shrink-0 border-r border-violet-200/60 bg-gradient-to-b from-violet-100 via-fuchsia-50 to-violet-50 shadow-[0_12px_40px_rgba(88,28,135,0.16)] backdrop-blur-sm flex flex-col justify-between max-sm:absolute max-sm:inset-y-0 max-sm:left-0 z-30 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 ${
        sidebarOpen ? 'translate-x-0' : 'max-sm:-translate-x-full'
      } transition-transform duration-300 ease-out`}
    >
      <div className='w-full px-4 pt-5 pb-3'>
        <button
          onClick={() => {
            navigate('/')
            setSidebarOpen?.(false)
          }}
          className='inline-flex cursor-pointer items-center rounded-xl px-2 py-1.5 hover:bg-violet-200/40 transition dark:hover:bg-slate-700/70'
        >
          <img src={assets.logo} className='h-10 w-auto object-contain' alt='Gather' />
        </button>

        <div className='my-4 h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent dark:via-slate-600' />

        <MenuItems setSidebarOpen={setSidebarOpen} />

        <Link
          to='/create-post'
          onClick={() => setSidebarOpen?.(false)}
          className='mt-6 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-3 text-sm font-medium text-white shadow-[0_10px_24px_rgba(124,58,237,0.35)] hover:from-violet-700 hover:to-fuchsia-600 active:scale-[0.99] transition'
        >
          <CirclePlus className='h-5 w-5' />
          Create Post
        </Link>
      </div>

      <div className='w-full border-t border-violet-200/80 bg-violet-50/80 px-4 py-4 dark:border-slate-700 dark:bg-slate-900/80'>
        <button
          onClick={toggleTheme}
          className='mb-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/70 px-3 py-2 text-sm font-medium text-violet-700 ring-1 ring-violet-200/60 transition hover:bg-violet-100/70 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700 dark:hover:bg-slate-700'
          aria-label='Toggle theme'
          title='Toggle theme'
        >
          {theme === 'dark' ? <Sun className='h-4 w-4' /> : <Moon className='h-4 w-4' />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>

        <div className='flex items-center justify-between rounded-2xl bg-white/70 px-3 py-2.5 ring-1 ring-violet-200/60 dark:bg-slate-800 dark:ring-slate-700'>
          <div className='flex min-w-0 items-center gap-3'>
            <UserButton />
            <div className='min-w-0'>
              <p className='truncate text-sm font-semibold text-violet-950 dark:text-slate-100'>{user?.full_name || 'User'}</p>
              <p className='truncate text-xs text-violet-700 dark:text-slate-300'>@{user?.username || 'username'}</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className='inline-flex cursor-pointer items-center justify-center rounded-lg p-2 text-violet-600 hover:bg-violet-200/70 hover:text-violet-900 transition dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-slate-100'
            aria-label='Sign out'
            title='Sign out'
          >
            <LogOut className='h-4 w-4' />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
