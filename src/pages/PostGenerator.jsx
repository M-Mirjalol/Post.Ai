import { useState } from 'react'
import { generatePost } from '../lib/gemini'
import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../hooks/useAuth'

const BUSINESS_TYPES = [
  'Kiyim do\'koni',
  'Oziq-ovqat / Kafe',
  'Kosmetika va go\'zallik',
  'Qurilish materiallari',
  'Elektronika',
  'Mebel',
  'Sport va fitness',
  'Ta\'lim / Kurslar',
  'Tibbiyot / Klinika',
  'Usta / Xizmat ko\'rsatish',
  'Boshqa'
]

const PRO_TELEGRAM = '@mirjalol_mirqobilov'

export default function PostGenerator() {
  const { user } = useAuth()
  const { savePost, isPro, monthlyCount, FREE_LIMIT } = usePosts(user?.uid)

  const [form, setForm] = useState({
    businessType: '',
    productDesc: '',
    language: 'uz',
    platform: 'instagram',
    tone: 'friendly'
  })

  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showProModal, setShowProModal] = useState(false)

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  const limitReached = !isPro && monthlyCount >= FREE_LIMIT

  async function handleGenerate() {
    if (!form.businessType || !form.productDesc.trim()) {
      setError('Biznes turi va mahsulot tavsifini to\'ldiring')
      return
    }

    if (limitReached) {
      setShowProModal(true)
      return
    }

    setError('')
    setLoading(true)
    setResult('')

    try {
      const text = await generatePost(form)

      setResult(text)

      await savePost({
        type: 'post',
        content: text,
        ...form
      })
    } catch (e) {
      if (e.message === 'LIMIT_REACHED') {
        setShowProModal(true)
      } else {
        setError('Xato yuz berdi: ' + e.message)
      }
    }

    setLoading(false)
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(result)
    } catch {
      setError('Nusxa olishda xatolik yuz berdi')
    }
  }

  return (
    <div className="fade-in">

      {/* PRO MODAL */}
      {showProModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
        >
          <div
            className="card fade-in"
            style={{
              maxWidth: 400,
              width: '100%',
              border: '1px solid rgba(124,92,252,0.4)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>
              ✦
            </div>

            <h2 style={{ fontSize: 22, marginBottom: 8 }}>
              Pro rejimga o'ting
            </h2>

            <p
              style={{
                color: 'var(--text2)',
                fontSize: 14,
                marginBottom: 20,
                lineHeight: 1.7
              }}
            >
              Bepul limitingiz tugadi ({FREE_LIMIT} ta post).
              <br />
              Cheksiz post yaratish uchun Pro rejimga o'ting.
            </p>

            <div
              style={{
                background: 'var(--bg3)',
                borderRadius: 10,
                padding: '14px 20px',
                marginBottom: 20
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: 'var(--accent2)'
                }}
              >
                $5{' '}
                <span
                  style={{
                    fontSize: 14,
                    color: 'var(--text2)',
                    fontWeight: 400
                  }}
                >
                  /oy
                </span>
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: 'var(--text2)',
                  marginTop: 4
                }}
              >
                Cheksiz post • Haftalik reja • Hashtaglar
              </div>
            </div>

            {/* TELEGRAM PAYMENT BUTTON */}
            <a
              href={`https://t.me/${PRO_TELEGRAM.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '12px',
                fontSize: 15,
                textDecoration: 'none',
                marginBottom: 10,
                display: 'flex'
              }}
            >
              Telegram orqali to'lash
            </a>

            <button
              className="btn btn-ghost"
              style={{
                width: '100%',
                justifyContent: 'center'
              }}
              onClick={() => setShowProModal(false)}
            >
              Yopish
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 700,
                marginBottom: 6
              }}
            >
              Post Yaratish
            </h1>

            <p
              style={{
                color: 'var(--text2)',
                fontSize: 14
              }}
            >
              Mahsulotingiz haqida yozing — AI tayyor post yozib beradi
            </p>
          </div>

          {/* LIMIT */}
          <div
            style={{
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '8px 14px',
              textAlign: 'center',
              flexShrink: 0
            }}
          >
            {isPro ? (
              <div
                style={{
                  fontSize: 13,
                  color: 'var(--green)',
                  fontWeight: 500
                }}
              >
                ✦ Pro
              </div>
            ) : (
              <>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: limitReached
                      ? 'var(--red)'
                      : 'var(--text)'
                  }}
                >
                  {monthlyCount}/{FREE_LIMIT}
                </div>

                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--text2)'
                  }}
                >
                  bepul post
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          alignItems: 'start'
        }}
        className="post-grid"
      >

        {/* LEFT */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18
          }}
        >

          {/* FORM */}
          <div className="card">

            {/* BUSINESS TYPE */}
            <div style={{ marginBottom: 14 }}>
              <label
                style={{
                  fontSize: 13,
                  color: 'var(--text2)',
                  display: 'block',
                  marginBottom: 6
                }}
              >
                Biznes turi
              </label>

              <select
                value={form.businessType}
                onChange={e =>
                  set('businessType', e.target.value)
                }
              >
                <option value="">
                  — Tanlang —
                </option>

                {BUSINESS_TYPES.map(b => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* DESCRIPTION */}
            <div style={{ marginBottom: 14 }}>
              <label
                style={{
                  fontSize: 13,
                  color: 'var(--text2)',
                  display: 'block',
                  marginBottom: 6
                }}
              >
                Mahsulot / xizmat tavsifi
              </label>

              <textarea
                placeholder="Masalan: Yangi kelgan yozgi ko'ylaklar, narxi 150 000 so'm, o'lchamlari S-XXL"
                value={form.productDesc}
                onChange={e =>
                  set('productDesc', e.target.value)
                }
                style={{ minHeight: 110 }}
              />
            </div>

            {/* SELECTS */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 12
              }}
              className="form-grid"
            >

              {/* LANGUAGE */}
              <div>
                <label
                  style={{
                    fontSize: 12,
                    color: 'var(--text2)',
                    display: 'block',
                    marginBottom: 5
                  }}
                >
                  Til
                </label>

                <select
                  value={form.language}
                  onChange={e =>
                    set('language', e.target.value)
                  }
                >
                  <option value="uz">O'zbek</option>
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                </select>
              </div>

              {/* PLATFORM */}
              <div>
                <label
                  style={{
                    fontSize: 12,
                    color: 'var(--text2)',
                    display: 'block',
                    marginBottom: 5
                  }}
                >
                  Platform
                </label>

                <select
                  value={form.platform}
                  onChange={e =>
                    set('platform', e.target.value)
                  }
                >
                  <option value="instagram">
                    Instagram
                  </option>
                  <option value="telegram">
                    Telegram
                  </option>
                  <option value="tiktok">
                    TikTok
                  </option>
                </select>
              </div>

              {/* TONE */}
              <div>
                <label
                  style={{
                    fontSize: 12,
                    color: 'var(--text2)',
                    display: 'block',
                    marginBottom: 5
                  }}
                >
                  Ohang
                </label>

                <select
                  value={form.tone}
                  onChange={e =>
                    set('tone', e.target.value)
                  }
                >
                  <option value="friendly">
                    Do'stona
                  </option>
                  <option value="professional">
                    Professional
                  </option>
                  <option value="funny">
                    Kulgili
                  </option>
                  <option value="urgent">
                    Aksiya
                  </option>
                </select>
              </div>

            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div
              style={{
                background: 'var(--red-bg)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 8,
                padding: '10px 14px',
                fontSize: 13,
                color: 'var(--red)'
              }}
            >
              {error}
            </div>
          )}

          {/* GENERATE BUTTON */}
          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={loading}
            style={{
              justifyContent: 'center',
              padding: '13px',
              fontSize: 15
            }}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Post yaratilmoqda...
              </>
            ) : limitReached ? (
              '🔒 Limit tugadi — Pro ga o\'ting'
            ) : (
              '✦  Post yaratish'
            )}
          </button>

        </div>

        {/* RIGHT */}
        <div>

          {result ? (

            <div
              className="card fade-in"
              style={{
                border: '1px solid rgba(124,92,252,0.25)'
              }}
            >

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 14
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    color: 'var(--text2)',
                    fontWeight: 500
                  }}
                >
                  Tayyor post ✓
                </span>

                <button
                  className="btn btn-ghost"
                  style={{
                    padding: '6px 12px',
                    fontSize: 12
                  }}
                  onClick={handleCopy}
                >
                  📋 Nusxa
                </button>
              </div>

              <div
                style={{
                  whiteSpace: 'pre-wrap',
                  fontSize: 14,
                  lineHeight: 1.8,
                  color: 'var(--text)',
                  maxHeight: 500,
                  overflowY: 'auto'
                }}
              >
                {result}
              </div>

            </div>

          ) : (

            <div
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 300,
                gap: 12,
                border: '1px dashed var(--border2)'
              }}
            >

              {loading ? (
                <>
                  <div
                    className="spinner"
                    style={{
                      width: 36,
                      height: 36,
                      borderWidth: 3
                    }}
                  />

                  <p
                    style={{
                      color: 'var(--text2)',
                      fontSize: 14
                    }}
                  >
                    AI post yozmoqda...
                  </p>
                </>
              ) : (
                <>
                  <span
                    style={{
                      fontSize: 36,
                      opacity: 0.3
                    }}
                  >
                    ✦
                  </span>

                  <p
                    style={{
                      color: 'var(--text3)',
                      fontSize: 13,
                      textAlign: 'center'
                    }}
                  >
                    Ma'lumotlarni to'ldirib
                    <br />
                    «Post yaratish» tugmasini bosing
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