// src/components/Layout.jsx
import { useState } from 'react'
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
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* MOBILE TOP BAR */}
      <div className="mobile-topbar" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
        padding: '12px 16px', alignItems: 'center', justifyContent: 'space-between',
        display: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--accent2)', fontSize: 18 }}>✦</span>
          <span style={{ fontFamily: 'Syne', fontSize: 17, fontWeight: 700 }}>PostAI</span>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', color: 'var(--text)', fontSize: 24, cursor: 'pointer', padding: 4, lineHeight: 1 }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {menuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            zIndex: 98, display: 'none'
          }}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`} style={{
        width: 220, background: 'var(--bg2)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', padding: '20px 12px',
        position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 99,
        transition: 'transform 0.25s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', marginBottom: 32 }}>
          <span style={{ fontSize: 18, color: 'var(--accent2)' }}>✦</span>
          <span style={{ fontFamily: 'Syne', fontSize: 18, fontWeight: 700 }}>PostAI</span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV.map(item => (
            <NavLink
              key={item.to} to={item.to} end={item.to === '/'}
              onClick={() => setMenuOpen(false)}
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

      {/* MAIN */}
      <main className="main-content" style={{
        marginLeft: 220, flex: 1, padding: '32px 40px', maxWidth: 'calc(100vw - 220px)'
      }}>
        {children}
      </main>
    </div>
  )
}