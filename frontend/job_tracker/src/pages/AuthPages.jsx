import { ArrowRight, BriefcaseBusiness, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'

import api, { getApiError } from '../api/axios'
import { useAuth } from '../context/AuthContext'
import heroImage from '../assets/hero.png'

function AuthFrame({ children, title, subtitle, alternate }) {
  return (
    <main className="auth-page">
      <section className="auth-visual" style={{ backgroundImage: 'url(' + heroImage + ')' }}>
        <div className="auth-visual-shade" />
        <div className="auth-visual-content">
          <span className="auth-brand"><BriefcaseBusiness size={20} /> JobTrack</span>
          <div>
            <p className="eyebrow">Job search, organized</p>
            <h1>Stay focused on the next good opportunity.</h1>
          </div>
        </div>
      </section>
      <section className="auth-panel">
        <div className="auth-form-wrap">
          <div className="auth-heading">
            <span className="brand-mark mobile-brand"><BriefcaseBusiness size={18} /></span>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          {children}
          <p className="auth-alternate">{alternate}</p>
        </div>
      </section>
    </main>
  )
}

export function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (isAuthenticated) return <Navigate to="/" replace />

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await login(form)
      navigate(location.state?.from || '/', { replace: true })
    } catch (requestError) {
      setError(getApiError(requestError))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthFrame
      title="Welcome back"
      subtitle="Sign in to keep your job search moving."
      alternate={<>New here? <Link to="/register">Create an account</Link></>}
    >
      <form className="auth-form" onSubmit={submit}>
        {error && <div className="form-error">{error}</div>}
        <label>
          <span>Email</span>
          <span className="input-icon"><Mail size={17} /><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required autoComplete="email" /></span>
        </label>
        <label>
          <span>Password</span>
          <span className="input-icon"><LockKeyhole size={17} /><input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required autoComplete="current-password" /></span>
        </label>
        <button className="button button-primary auth-submit" disabled={busy}>
          {busy ? 'Signing in...' : <>Sign in <ArrowRight size={17} /></>}
        </button>
      </form>
    </AuthFrame>
  )
}

export function RegisterPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
  })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (isAuthenticated) return <Navigate to="/" replace />

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await api.post('auth/register/', form)
      navigate('/login', { replace: true })
    } catch (requestError) {
      setError(getApiError(requestError))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthFrame
      title="Create your account"
      subtitle="A clearer way to follow every application."
      alternate={<>Already have an account? <Link to="/login">Sign in</Link></>}
    >
      <form className="auth-form" onSubmit={submit}>
        {error && <div className="form-error">{error}</div>}
        <label>
          <span>Name</span>
          <span className="input-icon"><UserRound size={17} /><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required autoComplete="name" /></span>
        </label>
        <label>
          <span>Email</span>
          <span className="input-icon"><Mail size={17} /><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required autoComplete="email" /></span>
        </label>
        <label>
          <span>Password</span>
          <span className="input-icon"><LockKeyhole size={17} /><input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required autoComplete="new-password" /></span>
        </label>
        <label>
          <span>Confirm password</span>
          <span className="input-icon"><LockKeyhole size={17} /><input type="password" value={form.confirm_password} onChange={(event) => setForm({ ...form, confirm_password: event.target.value })} required autoComplete="new-password" /></span>
        </label>
        <button className="button button-primary auth-submit" disabled={busy}>
          {busy ? 'Creating account...' : <>Create account <ArrowRight size={17} /></>}
        </button>
      </form>
    </AuthFrame>
  )
}
