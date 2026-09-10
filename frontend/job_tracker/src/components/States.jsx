import { AlertCircle, Inbox, LoaderCircle } from 'lucide-react'

export function LoadingState({ label = 'Loading' }) {
  return (
    <div className="loading-state" role="status">
      <LoaderCircle size={22} className="spin" />
      <span>{label}</span>
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state" role="alert">
      <AlertCircle size={20} />
      <span>{message}</span>
      {onRetry && <button className="text-button" onClick={onRetry}>Try again</button>}
    </div>
  )
}

export function EmptyState({ title, message, action }) {
  return (
    <div className="empty-state">
      <Inbox size={30} strokeWidth={1.5} />
      <h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  )
}

export function ConfirmDialog({ title, message, onCancel, onConfirm, busy }) {
  return (
    <div className="dialog-backdrop" role="presentation">
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <h2 id="dialog-title">{title}</h2>
        <p>{message}</p>
        <div className="dialog-actions">
          <button className="button button-secondary" onClick={onCancel}>Cancel</button>
          <button className="button button-danger" onClick={onConfirm} disabled={busy}>
            {busy ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
