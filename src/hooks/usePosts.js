// src/hooks/usePosts.js
import { useState, useEffect } from 'react'
import { db } from '../lib/firebase'
import {
  collection, addDoc, getDocs, deleteDoc,
  doc, query, where, orderBy, serverTimestamp
} from 'firebase/firestore'

export function usePosts(userId) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)

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

  useEffect(() => { fetchPosts() }, [userId])

  async function savePost(data) {
    const docRef = await addDoc(collection(db, 'posts'), {
      ...data,
      userId,
      createdAt: serverTimestamp()
    })
    await fetchPosts()
    return docRef.id
  }

  async function deletePost(postId) {
    await deleteDoc(doc(db, 'posts', postId))
    setPosts(prev => prev.filter(p => p.id !== postId))
  }

  return { posts, loading, savePost, deletePost, refetch: fetchPosts }
}
