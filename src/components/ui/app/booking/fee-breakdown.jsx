export default function FeeBreakdown({ fee = 'KES 2,500', duration = '30 minutes' }) {
  return (
    <div>
      <hr className="border-border my-4" />
      <div className="flex justify-between items-center mb-2">
        <span className="text-[13px] text-slate-light">Consultation fee</span>
        <span className="text-[13px] font-medium text-navy">{fee}</span>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[13px] text-slate-light">Duration</span>
        <span className="text-[13px] font-medium text-navy">{duration}</span>
      </div>
      <hr className="border-border my-4" />
      <div className="flex justify-between items-center">
        <span className="text-[14px] font-semibold text-navy">Total</span>
        <span className="text-[16px] font-bold text-teal">{fee}</span>
      </div>
    </div>
  )
}
