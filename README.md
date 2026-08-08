# PostAI — SMM AI Ilovasi

React + Vite + Firebase + Gemini API bilan qurilgan SMM AI assistant.

## Funksiyalar
- ✦ Post generatsiya (Instagram, Telegram, TikTok)
- 📅 Haftalik kontent rejasi
- # Hashtag generatsiya
- 🕐 Saqlangan postlar tarixi
- 🔐 Firebase Authentication
- ☁️ Firestore da saqlash

---

## O'rnatish

### 1. Dependencylarni o'rnating
```bash
npm install
```

### 2. Firebase loyihasi yarating
1. https://console.firebase.google.com ga boring
2. Yangi loyiha yarating
3. Authentication > Sign-in method > Email/Password ni yoqing
4. Firestore Database yarating (Production mode)
5. Project Settings > Web app qo'shing > config oling

### 3. Firebase config ni kiriting
`src/lib/firebase.js` faylini oching va o'z ma'lumotlaringizni qo'ying:
```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  ...
}
```

### 4. Gemini API key oling
1. https://aistudio.google.com/app/apikey ga boring
2. API key yarating (bepul)
3. `.env` fayl yarating:
```
VITE_GEMINI_API_KEY=your_key_here
```

### 5. Firestore Rules ni o'rnating
Firebase Console > Firestore > Rules ga `firestore.rules` ichidagi qoidalarni ko'chiring.

### 6. Ishga tushiring
```bash
npm run dev
```

### 7. Vercel ga deploy
```bash
npm run build
# GitHub ga push qiling, Vercel bilan bog'lang
# Vercel Environment Variables ga VITE_GEMINI_API_KEY qo'shing
```

---

## Loyiha tuzilmasi
```
src/
  lib/
    firebase.js    — Firebase config
    gemini.js      — Gemini API funksiyalar
  hooks/
    useAuth.js     — Authentication
    usePosts.js    — Firestore CRUD
  pages/
    AuthPage.jsx       — Login/Register
    PostGenerator.jsx  — Post yaratish
    WeeklyPlan.jsx     — Haftalik reja
    HashtagGenerator.jsx — Hashtaglar
    History.jsx        — Tarix
  components/
    Layout.jsx     — Sidebar layout
```
