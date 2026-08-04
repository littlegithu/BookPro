import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Clock, MapPin, Heart, Stethoscope } from 'lucide-react'
import Navbar from '../components/layout/navbar'
import Footer from '../components/layout/footer'

export default function AboutPage() {
  return (
    <div className="bg-surface min-h-screen pt-16">
      <Navbar />

      <div className="max-w-4xl mx-auto px-[3.75rem] py-[5.5rem]">
        <div className="mb-16">
          <h1 className="font-display font-bold text-[48px] text-navy leading-none mb-6">
            The BookPro Story: Making Healthcare Accessible
          </h1>
        </div>

        <p className="text-[18px] text-slate leading-[1.8] mb-10">
          Hey there, healthcare seekers and providers! We know what it's like to be frustrated - juggling work schedules, dealing with outdated waiting lists, and trying to navigate complicated hospital systems just to book a checkup. BookPro was born out of that exact headache.
        </p>

        <div className="mb-16">
          <h2 className="font-display font-bold text-[32px] text-navy mb-6">How It All Began</h2>
          <p className="text-[18px] text-slate leading-[1.8] mb-4">
            Picture this: Dr. Sarah Mutua was trying to book a patient appointment and got stuck in a 20-minute wait on hold with hospital admin. Meanwhile, patients were showing up without appointments because the phone system kept dropping calls. Across the city, nurses were manually updating spreadsheets while patients waited in crowded queues.
          </p>
          <p className="text-[18px] text-slate leading-[1.8] mb-4">
            Fast forward to 2024! BookPro was born in that Nairobi co-working space where frustrated doctors and tech enthusiasts kept saying, "There has to be a better way." We spent three sleepless months building what we hoped would be that better way.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="font-display font-bold text-[32px] text-navy mb-6">What's Our Deal?</h2>
          <p className="text-[18px] text-slate leading-[1.8] mb-6">
            We're not here to reinvent healthcare – just to make everyday appointments happen without the headache.
          </p>
          <ol className="space-y-6">
            <li>
              <span className="font-semibold text-teal text-[20px]">*Instant Booking, No Phones:*</span>
              <p className="text-[16px] text-slate mt-2">
                Skip the endless ringing. Book, reschedule, or cancel appointments in seconds. We've replaced hold music with actual progress bars.
              </p>
            </li>
            <li>
              <span className="font-semibold text-teal text-[20px]">*Verified Doctors Only:*</span>
              <p className="text-[16px] text-slate mt-2">
                Every doctor on our platform is licensed, credentialed, and hospital-employed. Think of us as your digital healthcare quality control squad.
              </p>
            </li>
            <li>
              <span className="font-semibold text-teal text-[20px]">*Real-time Availability:*</span>
              <p className="text-[16px] text-slate mt-2">
                See exactly when doctors have open slots. No more guessing games or calling three different hospitals to find a time that works.
              </p>
            </li>
            <li>
              <span className="font-semibold text-teal text-[20px]">*Unified Medical Records:*</span>
              <p className="text-[16px] text-slate mt-2">
                Access diagnoses, prescriptions, and visit history all in one place. Bookmarking medical websites? So last year.
              </p>
            </li>
            <li>
              <span className="font-semibold text-teal text-[20px]">*Multiple Roles, One Platform:*</span>
              <p className="text-[16px] text-slate mt-2">
                Patients, doctors, nurses, receptionists, and admins - everyone gets the specific tools they need, all connected in one place.
              </p>
            </li>
          </ol>
        </div>

        <div className="mb-16">
          <h2 className="font-display font-bold text-[32px] text-navy mb-6">Who's This For, Anyway?</h2>
          <p className="text-[18px] text-slate leading-[1.8] mb-6">
            This is for real people with real healthcare needs:
          </p>
          <ul className="space-y-4">
            <li>
              <span className="text-teal font-medium">Patients:</span> Folks tired of waiting in crowded hospital queues just to check in for their 8 AM appointment.
            </li>
            <li>
              <span className="text-teal font-medium">Doctors:</span> Healthcare workers drowning in administrative tasks and manual scheduling systems.
            </li>
            <li>
              <span className="text-teal font-medium">Staff:</span> Nurses, receptionists, and clerks who just want to focus on patients, not phone calls.
            </li>
            <li>
              <span className="text-teal font-medium">Hospitals:</span> Institutions looking to modernize without replacing their entire infrastructure.
            </li>
          </ul>
        </div>

        <div className="text-center py-12 bg-card rounded-2xl border border-border">
          <h2 className="font-display font-bold text-[28px] text-navy mb-4">
            Ready to make healthcare less stressful?
          </h2>
          <p className="text-[18px] text-slate mb-8 max-w-2xl mx-auto">
            We're not trying to revolutionize medicine; just fix the daily headaches so you can focus on what matters - your health and your practice.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="bg-teal text-white text-[14px] font-semibold px-8 py-3 rounded-lg hover:bg-teal-mid transition-colors">
              Get Started Free
            </Link>
            <Link to="/doctors" className="px-8 py-3 text-teal font-semibold border border-teal rounded-lg hover:bg-teal-light hover:text-navy transition-colors">
              Browse Doctors
            </Link>
          </div>
        </div>

        <p className="text-[18px] text-slate text-center mt-12">
          Welcome to BookPro. Healthcare, simplified.
        </p>
      </div>

      <Footer />
    </div>
  )
}