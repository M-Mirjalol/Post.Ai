// src/pages/AuthPage.jsx
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function AuthPage() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') await login(email, password)
      else await register(email, password, name)
    } catch (err) {
      const msgs = {
        'auth/user-not-found': 'Foydalanuvchi topilmadi',
        'auth/wrong-password': 'Parol noto\'g\'ri',
        'auth/email-already-in-use': 'Bu email band',
        'auth/weak-password': 'Parol kamida 6 ta belgi bo\'lsin',
        'auth/invalid-email': 'Email noto\'g\'ri',
        'auth/invalid-credential': 'Email yoki parol noto\'g\'ri',
      }
      setError(msgs[err.code] || err.message)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', position: 'relative', overflow: 'hidden'
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,92,252,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 14, padding: '10px 18px', marginBottom: 20
          }}>
            <span style={{ fontSize: 22 }}>✦</span>
            <span style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>PostAI</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            {mode === 'login' ? 'Xush kelibsiz' : 'Ro\'yxatdan o\'ting'}
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>
            {mode === 'login' ? 'Hisobingizga kiring' : 'Bepul hisob oching'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Ism</label>
              <input
                type="text" placeholder="Ismingiz"
                value={name} onChange={e => setName(e.target.value)} required
              />
            </div>
          )}
          <div>
            <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Email</label>
            <input
              type="email" placeholder="email@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required
            />
          </div>
          <div>
            <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Parol</label>
            <input
              type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} required
            />
          </div>

          {error && (
            <div style={{
              background: 'var(--red-bg)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--red)'
            }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} disabled={loading}>
            {loading ? <span className="spinner" /> : mode === 'login' ? 'Kirish' : 'Ro\'yxatdan o\'tish'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text2)' }}>
          {mode === 'login' ? 'Hisobingiz yo\'qmi? ' : 'Hisob bormi? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
            style={{ background: 'none', border: 'none', color: 'var(--accent2)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
          >
            {mode === 'login' ? 'Ro\'yxatdan o\'ting' : 'Kirish'}
          </button>
        </p>
      </div>
    </div>
  )
}
