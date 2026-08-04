import { Link } from 'react-router-dom'
import Navbar from '../components/layout/navbar'
import Footer from '../components/layout/footer'

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-surface min-h-screen pt-16">
      <Navbar />
      <div className="max-w-4xl mx-auto px-[3.75rem] py-[5.5rem]">
        <div className="mb-16">
          <h1 className="font-display font-bold text-[48px] text-navy leading-none mb-6">
            Privacy Policy
          </h1>
        </div>

        <p className="text-[18px] text-slate leading-[1.8] mb-10">
          At BookPro, we prioritize the privacy and security of our users. This Privacy Policy explains how we handle information when you use our website, and it applies to all visitors to the site. By using BookPro, you agree to the terms of this Privacy Policy.
        </p>

        <div className="mb-16">
          <h2 className="font-display font-bold text-[32px] text-navy mb-6">1. Information We Collect</h2>
          <p className="text-[18px] text-slate leading-[1.8] mb-4">
            BookPro collects user information during registration, including username and email address. You are encouraged to create accounts with verified information to access medical services.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="font-display font-bold text-[32px] text-navy mb-6">2. Cookies and Tracking</h2>
          <p className="text-[18px] text-slate leading-[1.8] mb-4">
            We use cookies to improve your experience on our platform. You can control cookie preferences in your browser settings.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="font-display font-bold text-[32px] text-navy mb-6">3. Third-Party Links</h2>
          <p className="text-[18px] text-slate leading-[1.8] mb-4">
            Our website may contain links to third-party websites. BookPro is not responsible for the privacy practices or content of these external sites.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="font-display font-bold text-[32px] text-navy mb-6">4. Data Security</h2>
          <p className="text-[18px] text-slate leading-[1.8] mb-4">
            We implement industry-standard security measures to protect your information.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="font-display font-bold text-[32px] text-navy mb-6">5. Children's Privacy</h2>
          <p className="text-[18px] text-slate leading-[1.8] mb-4">
            BookPro is not directed towards individuals under the age of 13.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="font-display font-bold text-[32px] text-navy mb-6">6. Contact Information</h2>
          <p className="text-[18px] text-slate leading-[1.8] mb-4">
            If you have any questions or concerns about this Privacy Policy, please contact us.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}