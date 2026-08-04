import { Link } from 'react-router-dom'
import Navbar from '../components/layout/navbar'
import Footer from '../components/layout/footer'

export default function TermsOfUsePage() {
  return (
    <div className="bg-surface min-h-screen pt-16">
      <Navbar />
      <div className="max-w-4xl mx-auto px-[3.75rem] py-[5.5rem]">
        <div className="mb-16">
          <h1 className="font-display font-bold text-[48px] text-navy leading-none mb-6">
            Terms of Use
          </h1>
        </div>

        <p className="text-[18px] text-slate leading-[1.8] mb-10">
          Welcome to BookPro. These Terms of Use govern your use of our healthcare booking platform. By accessing or using our services, you agree to be bound by these terms.
        </p>

        <div className="mb-16">
          <h2 className="font-display font-bold text-[32px] text-navy mb-6">1. Acceptance of Terms</h2>
          <p className="text-[18px] text-slate leading-[1.8] mb-4">
            By using BookPro, you acknowledge that you have read, understood, and agree to these Terms of Use.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="font-display font-bold text-[32px] text-navy mb-6">2. Medical Services</h2>
          <p className="text-[18px] text-slate leading-[1.8] mb-4">
            BookPro facilitates appointment bookings with verified healthcare professionals. We do not provide medical advice or treatment.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="font-display font-bold text-[32px] text-navy mb-6">3. Account Registration</h2>
          <p className="text-[18px] text-slate leading-[1.8] mb-4">
            To book appointments, you must provide accurate information and maintain the security of your account credentials.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="font-display font-bold text-[32px] text-navy mb-6">4. Payment Terms</h2>
          <p className="text-[18px] text-slate leading-[1.8] mb-4">
            Payment for medical services is handled directly between you and the healthcare provider.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="font-display font-bold text-[32px] text-navy mb-6">5. Limitation of Liability</h2>
          <p className="text-[18px] text-slate leading-[1.8] mb-4">
            BookPro shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="font-display font-bold text-[32px] text-navy mb-6">6. Governing Law</h2>
          <p className="text-[18px] text-slate leading-[1.8] mb-4">
            These terms are governed by the laws of Kenya.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}