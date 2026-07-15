export default function MedicalRecordCard({ record }) {
  if (!record) return null
  const { diagnosis, prescription, followUpDate } = record
  return (
    <div className="bg-teal-light border border-teal/20 rounded-xl p-5 mt-4">
      <h3 className="font-display font-semibold text-navy text-[16px] mb-4">Medical record</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[11px] font-medium text-teal uppercase tracking-wider mb-1">Diagnosis</p>
          <p className="text-[13px] text-navy">{diagnosis ?? '—'}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-teal uppercase tracking-wider mb-1">Prescription</p>
          <p className="text-[13px] text-navy">{prescription ?? '—'}</p>
        </div>
        {followUpDate && (
          <div className="col-span-2">
            <p className="text-[11px] font-medium text-teal uppercase tracking-wider mb-1">Follow-up date</p>
            <p className="text-[13px] text-navy">{followUpDate}</p>
          </div>
        )}
      </div>
    </div>
  )
}
