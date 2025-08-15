'use client'

import { useTheme } from '@/lib/theme'
import { SunIcon, MoonIcon, Bars3Icon } from '@heroicons/react/24/outline'

interface HeaderProps {
  onToggleSidebar: () => void
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        {/* Left side: Mobile menu button and Logo */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CT</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white hidden sm:block">
              CareTrack Pro
            </h1>
          </div>
        </div>

        {/* Right side: User info and theme toggle */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <MoonIcon className="h-5 w-5" />
            ) : (
              <SunIcon className="h-5 w-5" />
            )}
          </button>

          {/* User info */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">EN</span>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
              Enfermera
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}