export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="search"
      className="search"
      placeholder="Search by device name or inventory number"
      aria-label="Search devices"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
