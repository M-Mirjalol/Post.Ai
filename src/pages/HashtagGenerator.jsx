// src/pages/HashtagGenerator.jsx
import { useState } from 'react'
import { generateHashtags } from '../lib/gemini'

const BUSINESS_TYPES = [
  'Kiyim do\'koni', 'Oziq-ovqat / Kafe', 'Kosmetika va go\'zallik', 'Qurilish materiallari',
  'Elektronika', 'Mebel', 'Sport va fitness', 'Ta\'lim / Kurslar',
  'Tibbiyot / Klinika', 'Usta / Xizmat ko\'rsatish', 'Boshqa'
]

export default function HashtagGenerator() {
  const [form, setForm] = useState({ businessType: '', language: 'uz', niche: '' })
  const [tags, setTags] = useState([])
  const [selected, setSelected] = useState(new Set())
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerate() {
    if (!form.businessType) { setError('Biznes turini tanlang'); return }
    setError(''); setLoading(true); setTags([]); setSelected(new Set())
    try {
      const result = await generateHashtags(form)
      setTags(result)
    } catch (e) {
      setError('Xato: ' + e.message)
    }
    setLoading(false)
  }

  function toggleTag(tag) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(tag) ? next.delete(tag) : next.add(tag)
      return next
    })
  }

  function selectAll() { setSelected(new Set(tags)) }
  function clearAll() { setSelected(new Set()) }

  async function handleCopy() {
    const list = selected.size > 0 ? [...selected] : tags
    await navigator.clipboard.writeText(list.join(' '))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Hashtag Generatsiya</h1>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Biznesingizga mos 30 ta eng yaxshi hashtag</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 180px' }}>
            <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Biznes turi</label>
            <select value={form.businessType} onChange={e => setForm(f => ({ ...f, businessType: e.target.value }))}>
              <option value="">— Tanlang —</option>
              {BUSINESS_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div style={{ flex: '1 1 180px' }}>
            <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Tor niche (ixtiyoriy)</label>
            <input
              placeholder="Masalan: handmade zargarlik"
              value={form.niche} onChange={e => setForm(f => ({ ...f, niche: e.target.value }))}
            />
          </div>
          <div style={{ flex: '0 1 120px' }}>
            <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Til</label>
            <select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))}>
              <option value="uz">O'zbek</option>
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleGenerate} disabled={loading} style={{ flexShrink: 0 }}>
            {loading ? <><span className="spinner" /> Yaratilmoqda...</> : '# Generatsiya'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: 'var(--red-bg)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--red)', marginBottom: 16 }}>
          {error}
        </div>
      )}

      {tags.length > 0 && (
        <div className="fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="badge badge-purple">{tags.length} ta hashtag</span>
              {selected.size > 0 && <span className="badge badge-green">{selected.size} ta tanlandi</span>}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }} onClick={selectAll}>Hammasini</button>
              <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }} onClick={clearAll}>Tozalash</button>
              <button
                className="btn btn-primary" style={{ padding: '6px 14px', fontSize: 12 }} onClick={handleCopy}
              >
                {copied ? '✓ Nusxalandi' : '📋 Nusxalash'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {tags.map((tag, i) => (
              <button
                key={i}
                onClick={() => toggleTag(tag)}
                style={{
                  padding: '7px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500,
                  cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                  background: selected.has(tag) ? 'var(--accent)' : 'var(--bg3)',
                  color: selected.has(tag) ? '#fff' : 'var(--text2)',
                  outline: selected.has(tag) ? 'none' : '1px solid var(--border)'
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {selected.size > 0 && (
            <div className="card fade-in" style={{ marginTop: 20, background: 'var(--bg3)' }}>
              <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8 }}>Tanlangan hashtaglar:</p>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--text)' }}>
                {[...selected].join(' ')}
              </p>
            </div>
          )}
        </div>
      )}

      {!loading && tags.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '80px 0', opacity: 0.5 }}>
          <span style={{ fontSize: 40 }}>#</span>
          <p style={{ fontSize: 14, color: 'var(--text2)' }}>Hashtaglar hali yaratilmagan</p>
        </div>
      )}
    </div>
  )
}
