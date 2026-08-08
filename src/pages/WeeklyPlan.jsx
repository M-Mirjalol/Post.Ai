// src/pages/WeeklyPlan.jsx
import { useState } from 'react'
import { generateWeeklyPlan } from '../lib/gemini'
import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../hooks/useAuth'

const BUSINESS_TYPES = [
  'Kiyim do\'koni', 'Oziq-ovqat / Kafe', 'Kosmetika va go\'zallik', 'Qurilish materiallari',
  'Elektronika', 'Mebel', 'Sport va fitness', 'Ta\'lim / Kurslar',
  'Tibbiyot / Klinika', 'Usta / Xizmat ko\'rsatish', 'Boshqa'
]

const TYPE_COLORS = {
  'rasm': { bg: 'rgba(124,92,252,0.12)', color: '#a78bfa' },
  'video': { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
  'story': { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  'poll': { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' },
  'carousel': { bg: 'rgba(99,102,241,0.12)', color: '#818cf8' },
}

function getTypeStyle(type) {
  const t = (type || '').toLowerCase()
  for (const [key, val] of Object.entries(TYPE_COLORS)) {
    if (t.includes(key)) return val
  }
  return { bg: 'rgba(255,255,255,0.06)', color: 'var(--text2)' }
}

export default function WeeklyPlan() {
  const { user } = useAuth()
  const { savePost } = usePosts(user?.uid)
  const [form, setForm] = useState({ businessType: '', language: 'uz', platform: 'instagram' })
  const [plan, setPlan] = useState([])
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerate() {
    if (!form.businessType) { setError('Biznes turini tanlang'); return }
    setError(''); setLoading(true); setPlan([]); setSaved(false)
    try {
      const data = await generateWeeklyPlan(form)
      setPlan(data)
    } catch (e) {
      setError('Xato: ' + e.message)
    }
    setLoading(false)
  }

  async function handleSave() {
    await savePost({ type: 'weekly', content: JSON.stringify(plan), ...form })
    setSaved(true)
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Haftalik Kontent Rejasi</h1>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>7 kunlik post rejasini AI bilan avtomatik tuzing</p>
      </div>

      <div className="card" style={{ marginBottom: 24, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Biznes turi</label>
          <select value={form.businessType} onChange={e => setForm(f => ({ ...f, businessType: e.target.value }))}>
            <option value="">— Tanlang —</option>
            {BUSINESS_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div style={{ flex: '0 1 140px' }}>
          <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Til</label>
          <select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))}>
            <option value="uz">O'zbek</option>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </div>
        <div style={{ flex: '0 1 140px' }}>
          <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Platform</label>
          <select value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}>
            <option value="instagram">Instagram</option>
            <option value="telegram">Telegram</option>
            <option value="tiktok">TikTok</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={handleGenerate} disabled={loading} style={{ flexShrink: 0, padding: '10px 20px' }}>
          {loading ? <><span className="spinner" /> Yaratilmoqda...</> : '✦ Reja yaratish'}
        </button>
      </div>

      {error && (
        <div style={{ background: 'var(--red-bg)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--red)', marginBottom: 16 }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '60px 0' }}>
          <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>Haftalik reja tuzilmoqda...</p>
        </div>
      )}

      {plan.length > 0 && (
        <div className="fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span className="badge badge-green">{plan.length} kun</span>
            <button
              className="btn btn-ghost"
              style={{ padding: '7px 14px', fontSize: 13, color: saved ? 'var(--green)' : undefined }}
              onClick={handleSave}
            >
              {saved ? '✓ Saqlandi' : '💾 Saqlash'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {plan.map((day, i) => {
              const ts = getTypeStyle(day.type)
              return (
                <div key={i} className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '16px 20px' }}>
                  <div style={{
                    minWidth: 90, fontFamily: 'Syne', fontSize: 12, fontWeight: 700,
                    color: 'var(--accent2)', textTransform: 'uppercase', letterSpacing: '0.08em', paddingTop: 2
                  }}>
                    {day.day}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{day.topic}</span>
                      {day.type && (
                        <span style={{
                          fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 500,
                          background: ts.bg, color: ts.color
                        }}>
                          {day.type}
                        </span>
                      )}
                    </div>
                    {day.desc && <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{day.desc}</p>}
                  </div>
                  <div style={{ fontSize: 18, opacity: 0.3 }}>{i + 1}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!loading && plan.length === 0 && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 12, padding: '80px 0', opacity: 0.5
        }}>
          <span style={{ fontSize: 40 }}>📅</span>
          <p style={{ fontSize: 14, color: 'var(--text2)' }}>Reja hali yaratilmagan</p>
        </div>
      )}
    </div>
  )
}
