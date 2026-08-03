export default function ErrorMessage({ message }) {
  if (!message) return null
  return (
    <div className="bg-danger-bg text-danger-text text-sm px-4 py-3 rounded-lg border border-danger-text/20">
      {message}
    </div>
  )
}
