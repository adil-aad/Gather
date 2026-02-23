import React from 'react'
import { NavLink } from 'react-router-dom'
import { menuItemsData } from '../assets/assets'

const MenuItems = ({ setSidebarOpen }) => {
  return (
    <nav className='space-y-1.5'>
      {menuItemsData.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={() => setSidebarOpen?.(false)}
          className={({ isActive }) => `flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200 ${
            isActive
              ? 'bg-white text-slate-900 shadow-[0_8px_20px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700'
              : 'text-slate-600 hover:bg-white/70 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100'
          }`}
        >
          <div className='flex items-center gap-3'>
            <item.Icon className='h-5 w-5' />
            <span className='font-medium'>{item.label}</span>
          </div>

          {item.badge && (
            <span className='min-w-[22px] rounded-full bg-blue-100 px-2 py-0.5 text-center text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'>
              {item.badge}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export default MenuItems
