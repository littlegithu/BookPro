import ErrorMessage from '../shared/ErrorMessage'

export default function AuthForm({ title, subtitle, fields, submitLabel, onSubmit, error, loading, footer }) {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="bg-card rounded-2xl border border-border p-8 w-full max-w-md shadow-card">
        <div className="text-center mb-7">
          <h1 className="font-display font-bold text-2xl text-navy mb-2">{title}</h1>
          <p className="text-sm text-slate-light">{subtitle}</p>
        </div>
        <ErrorMessage message={error} />
        <div className="flex flex-col gap-4 mt-4">
          {fields.map(field => (
            <div key={field.name}>
              <label className="block text-[12px] font-medium text-navy mb-1.5">{field.label}</label>
              <input
                type={field.type ?? 'text'}
                placeholder={field.placeholder}
                value={field.value}
                onChange={e => field.onChange(e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-3 text-[13px] text-navy bg-surface outline-none focus:border-teal focus:bg-card transition-colors"
              />
            </div>
          ))}
        </div>
        <button
          onClick={onSubmit}
          disabled={loading}
          className="w-full mt-6 bg-teal text-white text-[14px] font-semibold py-3.5 rounded-lg hover:bg-teal-mid transition-colors disabled:opacity-60 cursor-pointer"
        >
          {loading ? 'Please wait…' : submitLabel}
        </button>
        {footer && <div className="mt-5 text-center text-[13px] text-slate-light">{footer}</div>}
      </div>
    </div>
  )
}
