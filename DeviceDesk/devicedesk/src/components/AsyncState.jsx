export default function AsyncState({ loading, error, empty, emptyText = 'No devices found', onRetry, children }) {
  if (loading) {
    return (
      <div className="state">
        <div className="spinner" />
        <p>Loading devices…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="state state-error">
        <p>{error}</p>
        {onRetry && (
          <button className="btn btn-secondary" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    )
  }

  if (empty) {
    return <div className="state">{emptyText}</div>
  }

  return children
}
