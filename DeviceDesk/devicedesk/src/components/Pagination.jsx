export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className="pagination">
      <button className="page-btn" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        ‹
      </button>
      {pages.map((n) => (
        <button
          key={n}
          className={n === page ? 'page-btn active' : 'page-btn'}
          onClick={() => onPageChange(n)}
        >
          {n}
        </button>
      ))}
      <button className="page-btn" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
        ›
      </button>
    </nav>
  )
}
