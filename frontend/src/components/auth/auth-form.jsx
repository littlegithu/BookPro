import { useState, useRef } from 'react'
import { Calendar, Clock, Eye, EyeOff } from 'lucide-react'
import { useTheme } from '../../context/theme-context'
import ErrorMessage from '../shared/error-message'

export default function AuthForm({ title, subtitle, fields, submitLabel, onSubmit, error, loading, footer, extra, twoColumn }) {
  const { theme } = useTheme()
  const [openSelect, setOpenSelect] = useState(null)
  const [selectQuery, setSelectQuery] = useState('')
  const [showPassword, setShowPassword] = useState({})
  const selectInputRef = useRef(null)

  const handleSelectChange = (field, value) => {
    field.onChange(value)
    setOpenSelect(null)
    setSelectQuery('')
  }

  const handleSelectAndFocusNext = (field, value, currentInput) => {
    handleSelectChange(field, value)
    const form = currentInput.closest('form')
    if (form) {
      const inputs = Array.from(form.querySelectorAll('input, select'))
      const idx = inputs.indexOf(currentInput)
      if (idx < inputs.length - 1) {
        setTimeout(() => inputs[idx + 1].focus(), 0)
      }
    }
  }

  const filteredOptions = (field) => {
    if (!field.options) return []
    if (!selectQuery) return field.options
    return field.options.filter(opt => {
      const label = field.optionLabels
        ? field.optionLabels[field.options.indexOf(opt)]
        : opt
      return label.toLowerCase().includes(selectQuery.toLowerCase())
    })
  }

  const dropdownBg = 'bg-card'
  const dropdownBorder = theme === 'dark' ? 'border-white/10' : 'border-border'
  const dropdownHover = theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-teal-light'
  const dropdownItemText = theme === 'dark' ? 'text-white/90' : 'text-navy'
  const noMatchText = theme === 'dark' ? 'text-white/50' : 'text-slate-light'

  return (
    <div className={`w-full ${twoColumn ? 'max-w-xl' : 'max-w-md'} px-4`}>
      <form onSubmit={e => { e.preventDefault(); onSubmit() }}>
        <div className="bg-card rounded-2xl border border-border p-8 shadow-card">
          <div className="text-center mb-7">
            <h1 className="font-display font-bold text-2xl text-navy mb-2">{title}</h1>
            <p className="text-sm text-slate-light">{subtitle}</p>
          </div>
          <ErrorMessage message={error} />
          <div className={`flex flex-col gap-4 mt-4 ${twoColumn ? 'md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-4' : ''}`}>
          {fields.map(field => (
            <div key={field.name} className={field.fullWidth && twoColumn ? 'col-span-2' : ''}>
              <label className="block text-[12px] font-medium text-navy mb-1.5">{field.label}</label>
               {field.type === 'select' ? (
                 <div className="relative">
                   <input
                     ref={selectInputRef}
                     type="text"
                    value={openSelect === field.name ? selectQuery : (field.value && field.optionLabels && field.options
                        ? (field.optionLabels[field.options.indexOf(field.value)] || field.value)
                        : field.value)}
                    onChange={e => {
                      if (openSelect !== field.name) {
                        setOpenSelect(field.name)
                      }
                      field.onChange(e.target.value)
                      setSelectQuery(e.target.value)
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        setOpenSelect(null)
                      }, 200)
                    }}
                    onFocus={() => {
                      setOpenSelect(field.name)
                      setSelectQuery(field.value && field.optionLabels && field.options
                        ? (field.optionLabels[field.options.indexOf(field.value)] || '')
                        : field.value)
                    }}
                     onFocus={() => setOpenSelect(field.name)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && openSelect === field.name) {
                          e.preventDefault()
                          setOpenSelect(null)
                          setSelectQuery('')
                        }
                      }}
                     placeholder={field.placeholder || 'Type or select...'}
                     className="w-full border border-border rounded-lg px-4 py-3 text-[13px] text-navy bg-surface outline-none focus:border-teal focus:bg-card transition-colors"
                   />
                   {openSelect === field.name && (
                     <div className={`absolute z-10 mt-1 w-full ${dropdownBg} border ${dropdownBorder} rounded-lg shadow-lg max-h-40 overflow-auto`}>
                       {filteredOptions(field).map(opt => {
                         const label = field.optionLabels
                           ? field.optionLabels[field.options.indexOf(opt)]
                           : opt
                         return (
                           <div
                             key={opt}
                             onClick={() => {
                               handleSelectAndFocusNext(field, opt, selectInputRef.current)
                             }}
                             className={`px-4 py-2 text-[13px] cursor-pointer ${dropdownHover} ${dropdownItemText}`}
                           >
                             {label}
                           </div>
                         )
                       })}
                       {filteredOptions(field).length === 0 && (
                         <div className={`px-4 py-2 text-[13px] ${noMatchText}`}>No matches found</div>
                       )}
                     </div>
                   )}
                </div>
           ) : (
                 <div className="relative">
                     {field.type === 'date' && (
                       <Calendar size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${theme === 'dark' ? 'text-white/40' : 'text-slate-light'}`} />
                     )}
                     {field.type === 'time' && (
                       <Clock size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${theme === 'dark' ? 'text-white/40' : 'text-slate-light'}`} />
                     )}
                   <input
                     type={field.type === 'password' && showPassword[field.name] ? 'text' : field.type ?? 'text'}
                     placeholder={field.placeholder}
                     value={field.value}
                     onChange={e => field.onChange(e.target.value)}
                     className={`w-full border border-border rounded-lg px-4 py-3 text-[13px] text-navy bg-surface outline-none focus:border-teal focus:bg-card transition-colors ${field.type === 'date' || field.type === 'time' ? 'pl-10' : ''} ${field.type === 'password' ? 'pr-10' : ''}`}
                   />
                   {field.type === 'password' && (
                     <button
                       type="button"
                       onClick={() => setShowPassword(prev => ({ ...prev, [field.name]: !prev[field.name] }))}
                       className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-white/60 hover:text-white' : 'text-slate-light hover:text-navy'} transition-colors`}
                     >
                       {showPassword[field.name] ? <EyeOff size={16} /> : <Eye size={16} />}
                     </button>
                   )}
                 </div>
               )}
            </div>
          ))}
        </div>
        <button
          onClick={onSubmit}
          disabled={loading}
          className="w-full mt-6 bg-teal text-white text-[14px] font-semibold py-3.5 rounded-lg hover:bg-teal-mid transition-colors disabled:opacity-60 cursor-pointer inline-flex items-center justify-center gap-2 min-h-[44px]"
        >
          {loading && (
            <span className="inline-block w-4 h-4 border-2 border-white/70 border-t-white rounded-full animate-spin" aria-hidden="true" />
          )}
          <span>{loading ? 'Please wait…' : submitLabel}</span>
        </button>
        {extra && <div className="mt-3">{extra}</div>}
        {footer && <div className="mt-5 text-center text-[13px] text-slate-light">{footer}</div>}
      </div>
      </form>
    </div>
  )
}
