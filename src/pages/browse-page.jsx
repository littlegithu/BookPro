import Navbar from '../components/layout/Navbar'
import DoctorGrid from '../components/doctor/DoctorGrid'

const DOCTORS = [
  { id: 1, name: 'Dr. Jane Mwangi', specialty: 'General Practice', location: 'Nairobi', tags: ['Family Medicine','Checkups'], availability: 'Available today' },
  { id: 2, name: 'Dr. Kevin Omondi', specialty: 'Pediatrics', location: 'Nairobi', tags: ['Child Health','Vaccines'], availability: 'Available Wed' },
  { id: 3, name: 'Dr. Amara Patel', specialty: 'Dermatology', location: 'Nairobi', tags: ['Skin Care','Acne'], availability: 'Available Fri' },
  { id: 4, name: 'Dr. Rita Lee', specialty: 'Cardiology', location: 'Nairobi', tags: ['Heart Health','ECG'], availability: 'Available Thu' },
  { id: 5, name: 'Dr. Brian Mutua', specialty: 'Dentistry', location: 'Nairobi', tags: ['Dental Care','Orthodontics'], availability: 'Available Mon' },
  { id: 6, name: 'Dr. Sarah Wanjiku', specialty: 'General Practice', location: 'Nairobi', tags: ['Checkups','Nutrition'], availability: 'Available Tue' },
  { id: 7, name: 'Dr. David Otieno', specialty: 'Pediatrics', location: 'Nairobi', tags: ['Child Health','Growth'], availability: 'Available Wed' },
  { id: 8, name: 'Dr. Nancy Kamau', specialty: 'Dermatology', location: 'Nairobi', tags: ['Skin Care','Allergies'], availability: 'Available Fri' },
]
const SPECIALTIES = ['General Practice','Pediatrics','Dentistry','Dermatology','Cardiology']

export default function BrowsePage() {
  return (
    <div className="bg-surface min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-15 py-10">
        <p className="text-[11px] font-semibold text-teal uppercase tracking-wider mb-2">Find a doctor</p>
        <h1 className="font-display font-bold text-[36px] text-navy mb-2">Browse by specialty</h1>
        <p className="text-[15px] text-slate mb-8 max-w-135">Every doctor on BookPro is verified and licensed. Filter by specialty to find the care you need.</p>
        <DoctorGrid doctors={DOCTORS} specialties={SPECIALTIES} />
      </div>
    </div>
  )
}
