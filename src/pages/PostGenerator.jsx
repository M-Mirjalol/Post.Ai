// src/pages/PostGenerator.jsx
import { useState } from 'react'
import { generatePost } from '../lib/gemini'
import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../hooks/useAuth'

const BUSINESS_TYPES = [
  'Kiyim do\'koni', 'Oziq-ovqat / Kafe', 'Kosmetika va go\'zallik', 'Qurilish materiallari',
  'Elektronika', 'Mebel', 'Sport va fitness', 'Ta\'lim / Kurslar',
  'Tibbiyot / Klinika', 'Usta / Xizmat ko\'rsatish', 'Boshqa'
]

export default function PostGenerator() {
  const { user } = useAuth()
  const { savePost } = usePosts(user?.uid)

  const [form, setForm] = useState({
    businessType: '', productDesc: '',
    language: 'uz', platform: 'instagram', tone: 'friendly'
  })
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); setSaved(false) }

  async function handleGenerate() {
    if (!form.businessType || !form.productDesc.trim()) {
      setError('Biznes turi va mahsulot tavsifini to\'ldiring'); return
    }
    setError(''); setLoading(true); setResult(''); setSaved(false)
    try {
      const text = await generatePost(form)
      setResult(text)
    } catch (e) {
      setError('Xato yuz berdi: ' + e.message)
    }
    setLoading(false)
  }

  async function handleSave() {
    if (!result) return
    await savePost({ type: 'post', content: result, ...form })
    setSaved(true)
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(result)
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Post Yaratish</h1>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Mahsulotingiz haqida yozing — AI tayyor post yozib beradi</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Left — form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card">
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Biznes turi</label>
              <select value={form.businessType} onChange={e => set('businessType', e.target.value)}>
                <option value="">— Tanlang —</option>
                {BUSINESS_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>
                Mahsulot / xizmat tavsifi
              </label>
              <textarea
                placeholder="Masalan: Yangi kelgan yozgi ko'ylaklar, narxi 150 000 so'm, o'lchamlari S-XXL, ranglari: oq, ko'k, yashil"
                value={form.productDesc} onChange={e => set('productDesc', e.target.value)}
                style={{ minHeight: 110 }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>Til</label>
                <select value={form.language} onChange={e => set('language', e.target.value)}>
                  <option value="uz">O'zbek</option>
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>Platform</label>
                <select value={form.platform} onChange={e => set('platform', e.target.value)}>
                  <option value="instagram">Instagram</option>
                  <option value="telegram">Telegram</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>Ohang</label>
                <select value={form.tone} onChange={e => set('tone', e.target.value)}>
                  <option value="friendly">Do'stona</option>
                  <option value="professional">Professional</option>
                  <option value="funny">Kulgili</option>
                  <option value="urgent">Aksiya</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div style={{
              background: 'var(--red-bg)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--red)'
            }}>{error}</div>
          )}

          <button
            className="btn btn-primary" onClick={handleGenerate} disabled={loading}
            style={{ justifyContent: 'center', padding: '13px', fontSize: 15 }}
          >
            {loading ? (
              <><span className="spinner" /> Post yaratilmoqda...</>
            ) : (
              '✦  Post yaratish'
            )}
          </button>
        </div>

        {/* Right — result */}
        <div>
          {result ? (
            <div className="card fade-in" style={{ border: '1px solid rgba(124,92,252,0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Tayyor post</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }} onClick={handleCopy}>
                    📋 Nusxa
                  </button>
                  <button
                    className="btn btn-ghost"
                    style={{ padding: '6px 12px', fontSize: 12, color: saved ? 'var(--green)' : undefined }}
                    onClick={handleSave}
                  >
                    {saved ? '✓ Saqlandi' : '💾 Saqlash'}
                  </button>
                </div>
              </div>
              <div style={{
                whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8,
                color: 'var(--text)', maxHeight: 500, overflowY: 'auto'
              }}>
                {result}
              </div>
            </div>
          ) : (
            <div className="card" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', minHeight: 300, gap: 12,
              border: '1px dashed var(--border2)'
            }}>
              {loading ? (
                <>
                  <div style={{ position: 'relative' }}>
                    <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
                  </div>
                  <p style={{ color: 'var(--text2)', fontSize: 14 }}>AI post yozmoqda...</p>
                </>
              ) : (
                <>
                  <span style={{ fontSize: 36, opacity: 0.3 }}>✦</span>
                  <p style={{ color: 'var(--text3)', fontSize: 13, textAlign: 'center' }}>
                    Ma'lumotlarni to'ldirib<br />«Post yaratish» tugmasini bosing
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
