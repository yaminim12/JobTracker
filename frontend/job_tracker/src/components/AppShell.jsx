import {
  BriefcaseBusiness,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Sun,
  UserRound,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

const navigation = [
  ['/', 'Overview', LayoutDashboard],
  ['/applications', 'Applications', BriefcaseBusiness],
  ['/interviews', 'Interviews', CalendarDays],
  ['/profile', 'Profile', UserRound],
]

export default function AppShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem('jobTrackerTheme') === 'dark')

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('jobTrackerTheme', dark ? 'dark' : 'light')
  }, [dark])

  const signOut = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <button
        className="mobile-menu-button icon-button"
        title={menuOpen ? 'Close navigation' : 'Open navigation'}
        aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`sidebar ${menuOpen ? 'is-open' : ''}`}>
        <div className="brand">
          <span className="brand-mark"><BriefcaseBusiness size={19} /></span>
          <span>JobTrack</span>
        </div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map(([path, label, Icon]) => (
            <NavLink key={path} to={path} end={path === '/'} onClick={() => setMenuOpen(false)}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <NavLink to="/profile" className="account-link" onClick={() => setMenuOpen(false)}>
            <span className="avatar">{user?.display_name?.slice(0, 1).toUpperCase() || 'U'}</span>
            <span className="account-copy">
              <strong>{user?.display_name || 'Your profile'}</strong>
              <small>{user?.email}</small>
            </span>
          </NavLink>
          <button className="sidebar-action" onClick={signOut}>
            <LogOut size={17} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-mobile-brand">JobTrack</div>
          <button
            className="icon-button"
            onClick={() => setDark((value) => !value)}
            title={dark ? 'Use light theme' : 'Use dark theme'}
            aria-label={dark ? 'Use light theme' : 'Use dark theme'}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>
        <Outlet />
      </main>
    </div>
  )
}
