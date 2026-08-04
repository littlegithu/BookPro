import { Link } from 'react-router-dom'
import Navbar from '../components/layout/navbar'
import Footer from '../components/layout/footer'

export default function CookiePolicyPage() {
  return (
    <div className="bg-surface min-h-screen pt-16">
      <Navbar />
      <div className="max-w-4xl mx-auto px-[3.75rem] py-[5.5rem]">
        <div className="mb-16">
          <h1 className="font-display font-bold text-[48px] text-navy leading-none mb-6">
            Cookie Policy
          </h1>
        </div>

        <p className="text-[18px] text-slate leading-[1.8] mb-10">
          This Cookie Policy explains how BookPro uses cookies and similar technologies to enhance your experience on our healthcare booking platform.
        </p>

        <div className="mb-16">
          <h2 className="font-display font-bold text-[32px] text-navy mb-6">What Are Cookies</h2>
          <p className="text-[18px] text-slate leading-[1.8] mb-4">
            Cookies are small text files stored on your device when you visit websites. They help us remember your preferences and improve functionality.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="font-display font-bold text-[32px] text-navy mb-6">How We Use Cookies</h2>
          <p className="text-[18px] text-slate leading-[1.8] mb-4">
            BookPro uses cookies to:
          </p>
          <ul className="list-disc list-inside text-[18px] text-slate leading-[1.8] ml-4">
            <li>Remember your login status</li>
            <li>Store your preferred language</li>
            <li>Improve site performance</li>
            <li>Measure user engagement</li>
          </ul>
        </div>

        <div className="mb-16">
          <h2 className="font-display font-bold text-[32px] text-navy mb-6">Cookie Types</h2>
          <p className="text-[18px] text-slate leading-[1.8] mb-4">
            We use session cookies (temporary) and persistent cookies (remain on your device for a set period).
          </p>
        </div>

        <div className="mb-16">
          <h2 className="font-display font-bold text-[32px] text-navy mb-6">Managing Cookies</h2>
          <p className="text-[18px] text-slate leading-[1.8] mb-4">
            You can control cookies through your browser settings. Note that disabling cookies may affect your experience.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}