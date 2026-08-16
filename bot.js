// bot.js — Telegram Bot
// npm install node-telegram-bot-api

const TelegramBot = require('node-telegram-bot-api')
const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

const BOT_TOKEN = '8901000755:AAFVBBPE3RsW3PoB2YyuVhuUnvbEzJSDjA8'
const ADMIN_ID = '8434538880'// quyida tushuntiraman

const bot = new TelegramBot(BOT_TOKEN, { polling: true })

// Firebase Admin SDK
initializeApp({
  credential: cert(require('./serviceAccount.json'))
})
const db = getFirestore()

// /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id,
    `👋 Salom! PostAI botiga xush kelibsiz!\n\n` +
    `Pro rejim: $5/oy\n` +
    `✅ Cheksiz post\n` +
    `✅ Haftalik reja\n` +
    `✅ Hashtaglar\n\n` +
    `To'lov uchun:\n` +
    `Payme: +998 XX XXX XX XX\n` +
    `To'lovdan keyin /pro buyrug'ini yuboring`
  )
})

// /pro — foydalanuvchi to'lov qilganini bildiradi
bot.onText(/\/pro/, (msg) => {
  const userId = msg.chat.id
  const username = msg.from.username || msg.from.first_name

  // Adminga xabar yuborish
  bot.sendMessage(ADMIN_ID,
    `💰 Yangi Pro so'rovi!\n\n` +
    `👤 Ism: ${msg.from.first_name}\n` +
    `📱 Username: @${username}\n` +
    `🆔 Telegram ID: ${userId}\n\n` +
    `Email ni so'rang va Firebase ID ni bering:\n` +
    `/activate ${userId}`,
    {
      reply_markup: {
        inline_keyboard: [[
          { text: '✅ Pro Faollashtirish', callback_data: `activate_${userId}` }
        ]]
      }
    }
  )

  bot.sendMessage(userId, '⏳ So\'rovingiz qabul qilindi! Tez orada admin siz bilan bog\'lanadi.')
})

// Admin email so'raydi
bot.on('callback_query', async (query) => {
  if (query.data.startsWith('activate_')) {
    const telegramId = query.data.split('_')[1]
    bot.sendMessage(query.message.chat.id,
      `Foydalanuvchining PostAI emailini yuboring:\n/setemail ${telegramId} email@example.com`
    )
  }
})

// /setemail — admin email orqali Pro yoqadi
bot.onText(/\/setemail (.+) (.+)/, async (msg, match) => {
  if (msg.chat.id.toString() !== ADMIN_ID) return

  const telegramId = match[1]
  const email = match[2]

  try {
    // Firebase da email bo'yicha user topib isPro = true qilamiz
    const usersRef = db.collection('users')
    const snap = await usersRef.where('email', '==', email).get()

    if (snap.empty) {
      bot.sendMessage(msg.chat.id, `❌ ${email} emailli foydalanuvchi topilmadi!`)
      return
    }

    snap.forEach(async (doc) => {
      await doc.ref.update({ isPro: true })
    })

    bot.sendMessage(msg.chat.id, `✅ ${email} Pro ga o'tkazildi!`)
    bot.sendMessage(telegramId, `🎉 Tabriklayman! Siz Pro foydalanuvchi bo'ldingiz!\n\npost-ai-ppel.vercel.app ga kiring va cheksiz post yarating!`)
  } catch (e) {
    bot.sendMessage(msg.chat.id, `❌ Xato: ${e.message}`)
  }
})

console.log('Bot ishga tushdi! ✅')