import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Stethoscope, User, Calendar, Activity, FileText, Pill, Printer,
  ArrowLeft, ArrowRight, CheckCircle, Plus, Trash2, AlertCircle, SkipForward
} from 'lucide-react'
import Topbar from '../../components/layout/topbar'
import DoctorDashboardLayout from '../../components/layout/doctor-dashboard-layout'
import { toast } from 'react-hot-toast'
import {
  fetchDoctorPatient,
  fetchDoctorAppointment,
  createDoctorPrescription,
  updateDoctorAppointment,
  createConsultation
} from '../../services/api'

const STEPS = [
  { key: 'overview', label: 'Patient Overview', icon: <User size={16} /> },
  { key: 'vitals', label: 'Vital Signs', icon: <Activity size={16} /> },
  { key: 'symptoms', label: 'Symptoms', icon: <FileText size={16} /> },
  { key: 'diagnosis', label: 'Diagnosis', icon: <Stethoscope size={16} /> },
  { key: 'prescription', label: 'Prescription', icon: <Pill size={16} /> },
  { key: 'labs', label: 'Lab Tests', icon: <Activity size={16} /> },
  { key: 'followup', label: 'Follow-up', icon: <Calendar size={16} /> },
  { key: 'complete', label: 'Complete', icon: <CheckCircle size={16} /> },
]

const EMPTY_VITALS = {
  blood_pressure: '',
  heart_rate: '',
  temperature: '',
  weight: '',
  height: '',
  spo2: ''
}

const EMPTY_MEDICATION = {
  medicine: '',
  strength: '',
  dosage: '',
  frequency: '',
  duration: '',
  instructions: ''
}

export default function DoctorConsultationPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const appointmentId = searchParams.get('appointment_id')
  const patientId = searchParams.get('patient_id')

  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [patient, setPatient] = useState(null)
  const [appointment, setAppointment] = useState(null)

  const [vitals, setVitals] = useState(EMPTY_VITALS)
  const [symptoms, setSymptoms] = useState('')
  const [physicalExam, setPhysicalExam] = useState('')
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState('')
  const [secondaryDiagnosis, setSecondaryDiagnosis] = useState('')
  const [differentialDiagnosis, setDifferentialDiagnosis] = useState('')
  const [medications, setMedications] = useState([{ ...EMPTY_MEDICATION }])
  const [labTests, setLabTests] = useState('')
  const [imagingRequests, setImagingRequests] = useState('')
  const [followUpDate, setFollowUpDate] = useState('')
  const [doctorNotes, setDoctorNotes] = useState('')

  useEffect(() => {
    async function loadData() {
      if (!patientId && !appointmentId) return
      setLoading(true)
      setErrors({})
      try {
        const promises = []
        if (patientId) {
          promises.push(fetchDoctorPatient(patientId))
        }
        if (appointmentId) {
          promises.push(fetchDoctorAppointment(appointmentId))
        }
        if (promises.length > 0) {
          const results = await Promise.all(promises)
          if (patientId && results[0]) {
            setPatient(results[0])
          }
          if (appointmentId) {
            const aptIndex = patientId ? 1 : 0
            setAppointment(results[aptIndex])
          }
        }
      } catch (err) {
        setErrors({ load: err.message || 'Failed to load consultation data' })
        toast.error(err.message || 'Failed to load consultation data')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [patientId, appointmentId])

  const updateField = (setter) => (e) => {
    setter(e.target.value)
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }))
    }
  }

  const updateVital = (field) => (e) => {
    setVitals(prev => ({ ...prev, [field]: e.target.value }))
  }

  const addMedication = () => {
    setMedications(prev => [...prev, { ...EMPTY_MEDICATION }])
  }

  const removeMedication = (index) => {
    setMedications(prev => prev.filter((_, i) => i !== index))
  }

  const updateMedication = (index, field) => (e) => {
    setMedications(prev => prev.map((med, i) => i === index ? { ...med, [field]: e.target.value } : med))
  }

  const validateStep = (step) => {
    const newErrors = {}
    if (step === 1) {
      if (!primaryDiagnosis.trim()) newErrors.primaryDiagnosis = 'Primary diagnosis is required'
    } else if (step === 2) {
      const validMeds = medications.filter(m => m.medicine.trim())
      if (validMeds.length === 0) newErrors.medications = 'At least one medication is required'
      medications.forEach((med, i) => {
        if (med.medicine.trim() && !med.dosage.trim()) {
          newErrors[`medication_${i}_dosage`] = 'Dosage is required'
        }
      })
    } else if (step === 6) {
      if (!followUpDate) newErrors.followUpDate = 'Follow-up date is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const goNext = () => {
    if (currentStep === 1 && !validateStep(1)) return
    if (currentStep === 2 && !validateStep(2)) return
    if (currentStep === 5 && !validateStep(6)) return
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleComplete = async () => {
    if (!validateStep(6)) return
    try {
      const consultationData = {
        appointment_id: appointmentId ? parseInt(appointmentId) : null,
        patient_id: patientId ? parseInt(patientId) : null,
        vitals: vitals,
        symptoms: symptoms,
        physical_examination: physicalExam,
        primary_diagnosis: primaryDiagnosis,
        secondary_diagnosis: secondaryDiagnosis,
        differential_diagnosis: differentialDiagnosis,
        medications: medications.filter(m => m.medicine.trim()),
        lab_tests: labTests,
        imaging_requests: imagingRequests,
        follow_up_date: followUpDate,
        doctor_notes: doctorNotes
      }

      await createConsultation(consultationData)

      if (medications.filter(m => m.medicine.trim()).length > 0) {
        const prescriptionPromises = medications
          .filter(m => m.medicine.trim())
          .map(med =>
            createDoctorPrescription({
              patient_id: patientId ? parseInt(patientId) : (appointment?.patient_id || null),
              appointment_id: appointmentId ? parseInt(appointmentId) : null,
              medicine: med.medicine,
              strength: med.strength,
              dosage: med.dosage,
              frequency: med.frequency,
              duration: med.duration,
              instructions: med.instructions
            })
          )
        await Promise.all(prescriptionPromises)
      }

      if (appointmentId) {
        await updateDoctorAppointment(appointmentId, { status: 'Completed' })
      }

      toast.success('Consultation completed successfully!')
      setCurrentStep(STEPS.length - 1)
    } catch (err) {
      console.error('Failed to complete consultation:', err)
      toast.error(err.message || 'Failed to complete consultation')
    }
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    const patientName = patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient'
    printWindow.document.write(`
      <html>
        <head><title>Consultation Summary</title></head>
        <body>
          <h1>Consultation Summary</h1>
          <p><strong>Patient:</strong> ${patientName}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-GB')}</p>
          <p><strong>Primary Diagnosis:</strong> ${primaryDiagnosis || 'N/A'}</p>
          <p><strong>Symptoms:</strong> ${symptoms || 'N/A'}</p>
          <p><strong>Physical Exam:</strong> ${physicalExam || 'N/A'}</p>
          <p><strong>Secondary Diagnosis:</strong> ${secondaryDiagnosis || 'N/A'}</p>
          <p><strong>Differential Diagnosis:</strong> ${differentialDiagnosis || 'N/A'}</p>
          <p><strong>Follow-up Date:</strong> ${followUpDate || 'N/A'}</p>
          <p><strong>Doctor Notes:</strong> ${doctorNotes || 'N/A'}</p>
          <h3>Medications</h3>
          ${medications.filter(m => m.medicine.trim()).map(m => `
            <p><strong>${m.medicine}</strong> - ${m.strength || ''} ${m.dosage || ''} ${m.frequency || ''} ${m.duration || ''}<br/>
            Instructions: ${m.instructions || 'N/A'}</p>
          `).join('')}
          <h3>Lab Tests</h3>
          <p>${labTests || 'N/A'}</p>
          <h3>Imaging Requests</h3>
          <p>${imagingRequests || 'N/A'}</p>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  const getPatientName = () => {
    if (patient?.first_name && patient?.last_name) return `${patient.first_name} ${patient.last_name}`
    return appointment?.patient_name || 'Unknown Patient'
  }

  if (loading) {
    return (
      <DoctorDashboardLayout>
        <Topbar title="Consultation" subtitle="Loading..." />
        <div className="p-7">
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </DoctorDashboardLayout>
    )
  }

  if (errors.load && !patient && !appointment) {
    return (
      <DoctorDashboardLayout>
        <Topbar title="Consultation" subtitle="" />
        <div className="p-7">
          <div className="text-red-600 text-center py-10 bg-red-50 rounded-xl border border-red-200">{errors.load}</div>
        </div>
      </DoctorDashboardLayout>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display font-semibold text-lg text-navy mb-4">Patient Overview</h3>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-teal-light flex items-center justify-center text-teal text-xl font-semibold shrink-0">
                {getPatientName().charAt(0)}
              </div>
              <div className="flex-1">
                <h4 className="font-display font-bold text-xl text-navy">{getPatientName()}</h4>
                <p className="text-sm text-slate-light mt-1 flex flex-wrap gap-3">
                  {patient?.gender && <span className="flex items-center gap-1"><User size={13} />{patient.gender}</span>}
                  {patient?.dob && <span className="flex items-center gap-1"><Calendar size={13} />{formatDate(patient.dob)}</span>}
                  {patient?.blood_group && <span className="flex items-center gap-1"><Activity size={13} />{patient.blood_group}</span>}
                  {patient?.allergies && <span className="flex items-center gap-1"><AlertCircle size={13} />{patient.allergies}</span>}
                </p>
              </div>
            </div>
            {appointment && (
              <div className="mt-6 p-4 bg-surface rounded-lg border border-border">
                <h4 className="font-display font-semibold text-navy mb-3">Appointment Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-slate-light mb-1">Date</p>
                    <p className="text-sm font-medium text-navy">{formatDate(appointment.appointment_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-light mb-1">Time</p>
                    <p className="text-sm font-medium text-navy">{appointment.appointment_time || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-light mb-1">Type</p>
                    <p className="text-sm font-medium text-navy">{appointment.consultation_type || 'Physical'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-light mb-1">Hospital</p>
                    <p className="text-sm font-medium text-navy">{appointment.hospital?.name || appointment.hospital_name || 'BookPro Clinic'}</p>
                  </div>
                  {appointment.room && (
                    <div>
                      <p className="text-xs text-slate-light mb-1">Room</p>
                      <p className="text-sm font-medium text-navy">{appointment.room}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="mt-6">
              <button onClick={goNext} className="px-6 py-2.5 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors flex items-center gap-1.5">
                Start Consultation <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )
      case 1:
        return (
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display font-semibold text-lg text-navy mb-4">Vital Signs</h3>
            <p className="text-sm text-slate-light mb-4">Record the patient's vital signs as measured by nursing staff. This section is optional.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Blood Pressure</label>
                <input type="text" value={vitals.blood_pressure} onChange={updateVital('blood_pressure')} placeholder="e.g., 120/80" className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal" />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Heart Rate (bpm)</label>
                <input type="text" value={vitals.heart_rate} onChange={updateVital('heart_rate')} placeholder="e.g., 72" className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal" />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Temperature (°C)</label>
                <input type="text" value={vitals.temperature} onChange={updateVital('temperature')} placeholder="e.g., 36.5" className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal" />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Weight (kg)</label>
                <input type="text" value={vitals.weight} onChange={updateVital('weight')} placeholder="e.g., 70" className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal" />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Height (cm)</label>
                <input type="text" value={vitals.height} onChange={updateVital('height')} placeholder="e.g., 175" className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal" />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">SpO2 (%)</label>
                <input type="text" value={vitals.spo2} onChange={updateVital('spo2')} placeholder="e.g., 98" className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-6">
              <button onClick={goBack} className="px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors flex items-center gap-1.5">
                <ArrowLeft size={16} />Back
              </button>
              <div className="flex items-center gap-2">
                <button onClick={handleSkip} className="px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors flex items-center gap-1.5">
                  <SkipForward size={16} />Skip
                </button>
                <button onClick={goNext} className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors flex items-center gap-1.5">
                  Save & Continue <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display font-semibold text-lg text-navy mb-4">Symptoms & Examination</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Symptoms *</label>
                <textarea name="symptoms" value={symptoms} onChange={updateField(setSymptoms)} rows={4} placeholder="Describe the patient's symptoms..." className={`w-full px-3 py-2 bg-surface border rounded-lg text-sm text-navy outline-none focus:border-teal ${errors.symptoms ? 'border-red-500' : 'border-border'}`} />
                {errors.symptoms && <p className="text-red-600 text-xs mt-1">{errors.symptoms}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Physical Examination Findings</label>
                <textarea value={physicalExam} onChange={updateField(setPhysicalExam)} rows={4} placeholder="Record physical examination findings..." className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-6">
              <button onClick={goBack} className="px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors flex items-center gap-1.5">
                <ArrowLeft size={16} />Back
              </button>
              <button onClick={goNext} className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors flex items-center gap-1.5">
                Save & Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display font-semibold text-lg text-navy mb-4">Diagnosis</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Primary Diagnosis *</label>
                <input name="primaryDiagnosis" value={primaryDiagnosis} onChange={updateField(setPrimaryDiagnosis)} placeholder="Enter primary diagnosis" className={`w-full px-3 py-2 bg-surface border rounded-lg text-sm text-navy outline-none focus:border-teal ${errors.primaryDiagnosis ? 'border-red-500' : 'border-border'}`} />
                {errors.primaryDiagnosis && <p className="text-red-600 text-xs mt-1">{errors.primaryDiagnosis}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Secondary Diagnosis</label>
                <input value={secondaryDiagnosis} onChange={updateField(setSecondaryDiagnosis)} placeholder="Enter secondary diagnosis (optional)" className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal" />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Differential Diagnosis</label>
                <textarea value={differentialDiagnosis} onChange={updateField(setDifferentialDiagnosis)} rows={3} placeholder="Enter differential diagnosis (optional)" className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-6">
              <button onClick={goBack} className="px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors flex items-center gap-1.5">
                <ArrowLeft size={16} />Back
              </button>
              <button onClick={goNext} className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors flex items-center gap-1.5">
                Save & Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-lg text-navy">Prescription</h3>
              <button onClick={addMedication} className="px-3 py-1.5 border border-border rounded-lg text-sm text-navy hover:bg-surface transition-colors flex items-center gap-1.5">
                <Plus size={14} />Add Medication
              </button>
            </div>
            {errors.medications && <p className="text-red-600 text-sm mb-3">{errors.medications}</p>}
            <div className="space-y-4">
              {medications.map((med, index) => (
                <div key={index} className="p-4 bg-surface rounded-lg border border-border relative">
                  {medications.length > 1 && (
                    <button onClick={() => removeMedication(index)} className="absolute top-3 right-3 p-1 rounded-md text-slate hover:text-red hover:bg-red-light transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-navy mb-1">Medicine Name *</label>
                      <input type="text" value={med.medicine} onChange={updateMedication(index, 'medicine')} placeholder="Medicine name" className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-navy outline-none focus:border-teal" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-navy mb-1">Strength</label>
                      <input type="text" value={med.strength} onChange={updateMedication(index, 'strength')} placeholder="e.g., 500mg" className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-navy outline-none focus:border-teal" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-navy mb-1">Dosage *</label>
                      <input type="text" value={med.dosage} onChange={updateMedication(index, 'dosage')} placeholder="e.g., 1 tablet" className={`w-full px-3 py-2 bg-card border rounded-lg text-sm text-navy outline-none focus:border-teal ${errors[`medication_${index}_dosage`] ? 'border-red-500' : 'border-border'}`} />
                      {errors[`medication_${index}_dosage`] && <p className="text-red-600 text-xs mt-1">{errors[`medication_${index}_dosage`]}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-navy mb-1">Frequency</label>
                      <input type="text" value={med.frequency} onChange={updateMedication(index, 'frequency')} placeholder="e.g., Twice daily" className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-navy outline-none focus:border-teal" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-navy mb-1">Duration</label>
                      <input type="text" value={med.duration} onChange={updateMedication(index, 'duration')} placeholder="e.g., 7 days" className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-navy outline-none focus:border-teal" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-navy mb-1">Instructions</label>
                      <input type="text" value={med.instructions} onChange={updateMedication(index, 'instructions')} placeholder="Special instructions" className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-navy outline-none focus:border-teal" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-6">
              <button onClick={goBack} className="px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors flex items-center gap-1.5">
                <ArrowLeft size={16} />Back
              </button>
              <button onClick={goNext} className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors flex items-center gap-1.5">
                Save & Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )
      case 5:
        return (
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display font-semibold text-lg text-navy mb-4">Lab Tests & Imaging</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Requested Tests</label>
                <textarea value={labTests} onChange={updateField(setLabTests)} rows={4} placeholder="Enter requested lab tests..." className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal" />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Imaging Requests</label>
                <textarea value={imagingRequests} onChange={updateField(setImagingRequests)} rows={4} placeholder="Enter imaging requests..." className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-6">
              <button onClick={goBack} className="px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors flex items-center gap-1.5">
                <ArrowLeft size={16} />Back
              </button>
              <button onClick={goNext} className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors flex items-center gap-1.5">
                Save & Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )
      case 6:
        return (
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display font-semibold text-lg text-navy mb-4">Follow-up & Summary</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Follow-up Date *</label>
                <input type="date" name="followUpDate" value={followUpDate} onChange={updateField(setFollowUpDate)} className={`w-full px-3 py-2 bg-surface border rounded-lg text-sm text-navy outline-none focus:border-teal ${errors.followUpDate ? 'border-red-500' : 'border-border'}`} />
                {errors.followUpDate && <p className="text-red-600 text-xs mt-1">{errors.followUpDate}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Doctor Notes</label>
                <textarea value={doctorNotes} onChange={updateField(setDoctorNotes)} rows={4} placeholder="Additional notes..." className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal" />
              </div>
              <div className="p-4 bg-surface rounded-lg border border-border">
                <h4 className="font-display font-semibold text-navy mb-3">Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-slate-light">Patient</span>
                    <span className="text-navy font-medium">{getPatientName()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-slate-light">Primary Diagnosis</span>
                    <span className="text-navy font-medium">{primaryDiagnosis || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-slate-light">Symptoms</span>
                    <span className="text-navy font-medium text-right max-w-[60%]">{symptoms || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-slate-light">Medications</span>
                    <span className="text-navy font-medium">{medications.filter(m => m.medicine.trim()).length} prescribed</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-slate-light">Lab Tests</span>
                    <span className="text-navy font-medium">{labTests ? 'Requested' : 'None'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-slate-light">Imaging</span>
                    <span className="text-navy font-medium">{imagingRequests ? 'Requested' : 'None'}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-light">Follow-up</span>
                    <span className="text-navy font-medium">{followUpDate ? formatDate(followUpDate) : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-6">
              <button onClick={goBack} className="px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors flex items-center gap-1.5">
                <ArrowLeft size={16} />Back
              </button>
              <button onClick={handleComplete} className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors flex items-center gap-1.5">
                Complete Consultation <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )
      case 7:
        return (
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display font-semibold text-lg text-navy mb-4">Consultation Complete</h3>
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-light flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green" />
              </div>
              <h4 className="font-display font-bold text-xl text-navy mb-2">Consultation Saved Successfully</h4>
              <p className="text-sm text-slate-light mb-6">The consultation record has been saved and the appointment has been marked as completed.</p>
              <div className="flex items-center justify-center gap-3">
                {appointmentId && (
                  <button onClick={async () => { await updateDoctorAppointment(appointmentId, { status: 'Completed' }); toast.success('Appointment marked as completed') }} className="px-4 py-2 bg-green-light text-green rounded-lg text-sm font-medium hover:bg-green hover:text-white transition-colors flex items-center gap-1.5">
                    <CheckCircle size={14} />Mark Appointment as Completed
                  </button>
                )}
                <button onClick={handlePrint} className="px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors flex items-center gap-1.5">
                  <Printer size={14} />Print Summary
                </button>
                <button onClick={() => navigate('/doctor/appointments')} className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors">
                  Return to Schedule
                </button>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <DoctorDashboardLayout>
      <Topbar title="Consultation" subtitle="Record and manage patient consultation" />

      <div className="p-7 space-y-5">
        {errors.load && (
          <div className="text-red-600 text-center py-5 bg-red-50 rounded-xl border border-red-200">{errors.load}</div>
        )}

        {!patientId && !appointmentId && (
          <div className="text-red-600 text-center py-10 bg-red-50 rounded-xl border border-red-200">
            No patient or appointment selected. Please access this page from an appointment or patient profile.
          </div>
        )}

        {patientId && !patient && !loading && (
          <div className="text-red-600 text-center py-10 bg-red-50 rounded-xl border border-red-200">Patient not found</div>
        )}

        {(patient || appointment) && (
          <>
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                {STEPS.map((step, index) => (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        index <= currentStep ? 'bg-teal text-white' : 'bg-surface text-slate-light border border-border'
                      }`}>
                        {index < currentStep ? <CheckCircle size={16} /> : step.icon}
                      </div>
                      <span className={`text-xs mt-1 whitespace-nowrap ${index <= currentStep ? 'text-teal font-medium' : 'text-slate-light'}`}>
                        {step.label}
                      </span>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 mt-[-16px] ${index < currentStep ? 'bg-teal' : 'bg-border'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {renderStepContent()}
          </>
        )}
      </div>
    </DoctorDashboardLayout>
  )
}
