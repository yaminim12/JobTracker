import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AppShell from './components/AppShell'
import { AuthProvider } from './context/AuthContext'
import ApplicationDetailPage from './pages/ApplicationDetailPage'
import ApplicationEditorPage from './pages/ApplicationEditorPage'
import ApplicationsPage from './pages/ApplicationsPage'
import { LoginPage, RegisterPage } from './pages/AuthPages'
import DashboardPage from './pages/DashboardPage'
import InterviewsPage from './pages/InterviewsPage'
import ProfilePage from './pages/ProfilePage'
import ProtectedRoute from './routes/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route index element={<DashboardPage />} />
              <Route path="applications" element={<ApplicationsPage />} />
              <Route path="applications/add" element={<ApplicationEditorPage />} />
              <Route path="applications/:id" element={<ApplicationDetailPage />} />
              <Route path="applications/:id/edit" element={<ApplicationEditorPage />} />
              <Route path="interviews" element={<InterviewsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
