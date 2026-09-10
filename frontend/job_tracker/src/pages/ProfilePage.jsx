import { Check, Mail, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'

import api, { getApiError } from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { ErrorState, LoadingState } from '../components/States'

export default function ProfilePage() {
  const { updateUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)

  const load = async () => {
    setError('')
    try {
      const { data } = await api.get('auth/profile/')
      setProfile(data)
      setName(data.display_name || '')
    } catch (requestError) {
      setError(getApiError(requestError))
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => load(), 0)
    return () => window.clearTimeout(timeoutId)
  }, [])

  const save = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    setSaved(false)
    try {
      const { data } = await api.patch('auth/profile/', { display_name: name })
      setProfile(data)
      updateUser(data)
      setSaved(true)
    } catch (requestError) {
      setError(getApiError(requestError))
    } finally {
      setBusy(false)
    }
  }

  if (!profile && !error) return <LoadingState label="Loading profile" />
  if (error && !profile) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="page narrow-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Account</p>
          <h1>Profile</h1>
        </div>
      </div>
      <section className="profile-surface">
        <div className="profile-avatar">{profile.display_name?.slice(0, 1).toUpperCase() || 'U'}</div>
        <div className="profile-intro">
          <h2>{profile.display_name || 'Your profile'}</h2>
          <p><Mail size={15} /> {profile.email}</p>
        </div>
      </section>
      <section className="form-surface">
        <div className="section-heading"><div><h2>Personal details</h2><p>Keep the name shown across your tracker current.</p></div></div>
        <form className="profile-form" onSubmit={save}>
          {error && <div className="form-error">{error}</div>}
          <label>
            <span>Display name</span>
            <span className="input-icon"><UserRound size={17} /><input value={name} onChange={(event) => setName(event.target.value)} required /></span>
          </label>
          <label>
            <span>Email</span>
            <span className="input-icon is-readonly"><Mail size={17} /><input value={profile.email} readOnly /></span>
          </label>
          <div className="form-actions">
            <button className="button button-primary" disabled={busy}>{busy ? 'Saving...' : 'Save profile'}</button>
            {saved && <span className="saved-note"><Check size={16} /> Saved</span>}
          </div>
        </form>
      </section>
    </div>
  )
}
