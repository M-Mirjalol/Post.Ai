// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Layout from './components/Layout'
import AuthPage from './pages/AuthPage'
import PostGenerator from './pages/PostGenerator'
import WeeklyPlan from './pages/WeeklyPlan'
import HashtagGenerator from './pages/HashtagGenerator'
import History from './pages/History'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  if (user === undefined) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
    </div>
  )
  if (!user) return <Navigate to="/auth" replace />
  return children
}

export default function App() {
  const { user } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={user ? <Navigate to="/" replace /> : <AuthPage />}
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout><PostGenerator /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/weekly"
          element={
            <PrivateRoute>
              <Layout><WeeklyPlan /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/hashtags"
          element={
            <PrivateRoute>
              <Layout><HashtagGenerator /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute>
              <Layout><History /></Layout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
