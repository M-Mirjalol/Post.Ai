// src/components/Layout.jsx
import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const NAV = [
  { to: '/', icon: '✦', label: 'Post yaratish' },
  { to: '/weekly', icon: '📅', label: 'Haftalik reja' },
  { to: '/hashtags', icon: '#', label: 'Hashtaglar' },
  { to: '/history', icon: '🕐', label: 'Tarix' },
]

export default function Layout({ children }) {
  const { user, logout } = useAuth()

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: 'var(--bg2)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', padding: '20px 12px',
        position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 50
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', marginBottom: 32 }}>
          <span style={{ fontSize: 18, color: 'var(--accent2)' }}>✦</span>
          <span style={{ fontFamily: 'Syne', fontSize: 18, fontWeight: 700 }}>PostAI</span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV.map(item => (
            <NavLink
              key={item.to} to={item.to} end={item.to === '/'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 8, textDecoration: 'none',
                fontSize: 14, fontWeight: 500, transition: 'all 0.15s',
                color: isActive ? '#fff' : 'var(--text2)',
                background: isActive ? 'rgba(124,92,252,0.18)' : 'transparent',
                border: isActive ? '1px solid rgba(124,92,252,0.25)' : '1px solid transparent'
              })}
            >
              <span style={{ fontSize: 16, minWidth: 20, textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <div style={{ padding: '0 8px', marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>
              {user?.displayName || 'Foydalanuvchi'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email}
            </div>
          </div>
          <button onClick={logout} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}>
            Chiqish
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 220, flex: 1, padding: '32px 40px', maxWidth: 'calc(100vw - 220px)' }}>
        {children}
      </main>
    </div>
  )
}
