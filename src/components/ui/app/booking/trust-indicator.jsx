import { Shield, Lock } from 'lucide-react'

export default function TrustIndicator() {
  return (
    <div className="flex flex-col gap-1.5 mt-3">
      <p className="flex items-center justify-center gap-1.5 text-[12px] text-slate-light">
        <Shield size={14} /> Free cancellation up to 2 hours before
      </p>
      <p className="flex items-center justify-center gap-1.5 text-[12px] text-slate-light">
        <Lock size={14} /> Your data is secure and private
      </p>
    </div>
  )
}
