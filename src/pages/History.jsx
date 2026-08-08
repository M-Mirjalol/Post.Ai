// src/pages/History.jsx
import { useState } from 'react'
import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../hooks/useAuth'

const PLATFORM_ICONS = { instagram: '📸', telegram: '✈️', tiktok: '🎵' }
const LANG_LABELS = { uz: 'UZ', ru: 'RU', en: 'EN' }
const TYPE_LABELS = { post: 'Post', weekly: 'Haftalik reja', hashtags: 'Hashtaglar' }

export default function History() {
  const { user } = useAuth()
  const { posts, loading, deletePost } = usePosts(user?.uid)
  const [copied, setCopied] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const [filter, setFilter] = useState('all')

  async function handleCopy(id, text) {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const filtered = filter === 'all' ? posts : posts.filter(p => p.type === filter)

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Saqlangan Postlar</h1>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Barcha yaratilgan kontentlaringiz</p>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['all', 'Hammasi'], ['post', 'Postlar'], ['weekly', 'Haftalik reja']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500,
              cursor: 'pointer', border: 'none', transition: 'all 0.15s',
              background: filter === val ? 'var(--accent)' : 'var(--bg3)',
              color: filter === val ? '#fff' : 'var(--text2)',
              outline: filter === val ? 'none' : '1px solid var(--border)'
            }}
          >
            {label}
          </button>
        ))}
        <span className="badge badge-purple" style={{ alignSelf: 'center', marginLeft: 4 }}>
          {filtered.length} ta
        </span>
      </div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '80px 0', opacity: 0.5 }}>
          <span style={{ fontSize: 40 }}>🕐</span>
          <p style={{ fontSize: 14, color: 'var(--text2)' }}>Hali hech narsa saqlanmagan</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(post => {
          const isOpen = expanded === post.id
          const preview = post.content?.slice(0, 120) + (post.content?.length > 120 ? '...' : '')
          const date = post.createdAt?.toDate?.()?.toLocaleDateString('uz-UZ') || ''

          return (
            <div key={post.id} className="card" style={{ transition: 'border-color 0.2s' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span className="badge badge-purple">{TYPE_LABELS[post.type] || 'Post'}</span>
                  {post.platform && (
                    <span style={{ fontSize: 12, color: 'var(--text2)' }}>
                      {PLATFORM_ICONS[post.platform]} {post.platform}
                    </span>
                  )}
                  {post.language && (
                    <span className="badge" style={{ background: 'var(--bg3)', color: 'var(--text2)', fontSize: 11 }}>
                      {LANG_LABELS[post.language]}
                    </span>
                  )}
                  {post.businessType && (
                    <span style={{ fontSize: 12, color: 'var(--text2)' }}>{post.businessType}</span>
                  )}
                </div>
                <span style={{ fontSize: 12, color: 'var(--text3)', flexShrink: 0 }}>{date}</span>
              </div>

              {/* Content preview */}
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 12 }}>
                {isOpen ? post.content : preview}
              </p>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }}
                  onClick={() => setExpanded(isOpen ? null : post.id)}
                >
                  {isOpen ? 'Yig\'ish' : 'Ko\'proq'}
                </button>
                <button
                  className="btn btn-ghost"
                  style={{ padding: '6px 12px', fontSize: 12, color: copied === post.id ? 'var(--green)' : undefined }}
                  onClick={() => handleCopy(post.id, post.content)}
                >
                  {copied === post.id ? '✓ Nusxalandi' : '📋 Nusxa'}
                </button>
                <button
                  className="btn btn-danger" style={{ padding: '6px 12px', fontSize: 12, marginLeft: 'auto' }}
                  onClick={() => deletePost(post.id)}
                >
                  🗑
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
