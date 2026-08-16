// src/hooks/usePosts.js
import { useState, useEffect } from 'react'
import { db } from '../lib/firebase'
import {
  collection, addDoc, getDocs, deleteDoc,
  doc, query, where, orderBy, serverTimestamp, getDoc, setDoc
} from 'firebase/firestore'

export function usePosts(userId) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [isPro, setIsPro] = useState(false)
  const [monthlyCount, setMonthlyCount] = useState(0)

  const FREE_LIMIT = 5

  async function fetchUserData() {
    if (!userId) return
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      setIsPro(userSnap.data().isPro || false)
      setMonthlyCount(userSnap.data().monthlyCount || 0)
    } else {
      await setDoc(userRef, { isPro: false, monthlyCount: 0 })
    }
  }

  async function fetchPosts() {
    if (!userId) return
    setLoading(true)
    try {
      const q = query(
        collection(db, 'posts'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      const snap = await getDocs(q)
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUserData()
    fetchPosts()
  }, [userId])

  async function savePost(data) {
    if (!isPro && monthlyCount >= FREE_LIMIT) {
      throw new Error('LIMIT_REACHED')
    }
    const docRef = await addDoc(collection(db, 'posts'), {
      ...data, userId, createdAt: serverTimestamp()
    })
    // Count oshirish
    const userRef = doc(db, 'users', userId)
    const newCount = monthlyCount + 1
    await setDoc(userRef, { monthlyCount: newCount }, { merge: true })
    setMonthlyCount(newCount)
    await fetchPosts()
    return docRef.id
  }

  async function deletePost(postId) {
    await deleteDoc(doc(db, 'posts', postId))
    setPosts(prev => prev.filter(p => p.id !== postId))
  }

  return { posts, loading, savePost, deletePost, isPro, monthlyCount, FREE_LIMIT, refetch: fetchPosts }
}