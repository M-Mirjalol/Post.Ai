// src/lib/gemini.js — OpenRouter orqali Gemini
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY
const API_URL = 'https://openrouter.ai/api/v1/chat/completions'

async function callAI(prompt) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://postai-uz.vercel.app',
      'X-Title': 'PostAI'
    },
    body: JSON.stringify({
      model: 'openrouter/auto',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 5000,
      temperature: 0.85
    })
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.error?.message || res.status)
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

export async function generatePost({ businessType, productDesc, language, platform, tone }) {
  const langMap = { uz: "O'zbek", ru: "Rus", en: "Ingliz" }
  const platformMap = { instagram: "Instagram", telegram: "Telegram kanal", tiktok: "TikTok" }
  const toneMap = {
    friendly: "do'stona va issiq",
    professional: "professional va ishonchli",
    funny: "qiziqarli va kulgili",
    urgent: "shoshilinch va jozibali (aksiya)"
  }

  const prompt = `Sen professional SMM mutaxassissan. Quyidagi ma'lumotlar asosida ${platformMap[platform]} uchun post yoz.

Biznes turi: ${businessType}
Mahsulot/xizmat tavsifi: ${productDesc}
Ohang: ${toneMap[tone]}
Til: ${langMap[language]}

Talablar:
- Post jozibali va ${platformMap[platform]} ga mos bo'lsin
- Emoji'lardan o'rinli foydalanish
- Oxirida 10-15 ta mos hashtag qo'sh (#)
- Call-to-action (CTA) bo'lsin
- 150-250 so'z oralig'ida

Faqat postning o'zini yoz, boshqa izoh kerak emas.`

  return callAI(prompt)
}

export async function generateWeeklyPlan({ businessType, language, platform }) {
  const langMap = { uz: "O'zbek", ru: "Rus", en: "Ingliz" }
  const platformMap = { instagram: "Instagram", telegram: "Telegram", tiktok: "TikTok" }

  const prompt = `Sen professional SMM strategist san. ${businessType} uchun ${platformMap[platform]}da 7 kunlik kontent rejasini tuz.

Til: ${langMap[language]}

Har kun uchun:
- Kun nomi (Dushanba, Seshanba...)
- Post mavzusi (qisqa sarlavha)
- Post turi (rasm, video, story, poll)
- Qisqa tavsif (1-2 jumla)

Format: har kunni yangi qatorda, quyidagicha:
DUSHANBA | [mavzu] | [tur] | [tavsif]
SESHANBA | ...
...

Faqat rejani yoz, boshqa izoh kerak emas.`

  const text = await callAI(prompt)
  const lines = text.split('\n').filter(l => l.trim() && l.includes('|'))
  return lines.map((line, i) => {
    const parts = line.split('|').map(p => p.trim())
    return { id: i, day: parts[0] || '', topic: parts[1] || '', type: parts[2] || '', desc: parts[3] || '' }
  }).filter(d => d.topic)
}

export async function generateHashtags({ businessType, language, niche }) {
  const langMap = { uz: "O'zbek", ru: "Rus", en: "Ingliz" }

  const prompt = `${businessType} biznes uchun ${langMap[language]} tilida 30 ta eng yaxshi Instagram/Telegram hashtag ber.

Niche: ${niche || businessType}

Hashtaglar:
- Mahalliy (Uzbekiston) va global mix bo'lsin
- Turli qiyinlik darajasi: keng (1M+), o'rta (100K-1M), tor (10K-100K)
- Har biri # bilan boshlansin
- Vergul bilan ajrat

Faqat hashtaglarni yoz, boshqa narsa kerak emas.`

  const text = await callAI(prompt)
  return text.split(/[,\n]/).map(h => h.trim()).filter(h => h.startsWith('#'))
}