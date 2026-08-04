import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import Navbar from '../components/layout/navbar'
import Footer from '../components/layout/footer'

export default function ContactPage() {
  return (
    <div className="bg-surface min-h-screen pt-16">
      <Navbar />
      <div className="max-w-4xl mx-auto px-[3.75rem] py-[5.5rem]">
        <div className="mb-16">
          <h1 className="font-display font-bold text-[48px] text-navy leading-none mb-6">
            Contact Us
          </h1>
        </div>

        <div className="mb-16">
          <h2 className="font-display font-bold text-[32px] text-navy mb-6">Get in Touch</h2>
          <p className="text-[18px] text-slate leading-[1.8] mb-8">
            Have questions about BookPro or need assistance? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-display font-semibold text-[20px] text-navy mb-4">Contact Information</h3>
            <div className="flex items-start gap-3 mb-4">
              <Mail size={20} className="text-teal mt-0.5" />
              <div>
                <p className="text-[14px] font-medium text-navy">Email</p>
                <p className="text-[14px] text-slate">info@bookpro.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3 mb-4">
              <Phone size={20} className="text-teal mt-0.5" />
              <div>
                <p className="text-[14px] font-medium text-navy">Phone</p>
                <p className="text-[14px] text-slate">+254 700 000 000</p>
              </div>
            </div>
            <div className="flex items-start gap-3 mb-4">
              <MapPin size={20} className="text-teal mt-0.5" />
              <div>
                <p className="text-[14px] font-medium text-navy">Address</p>
                <p className="text-[14px] text-slate">Nairobi, Kenya</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={20} className="text-teal mt-0.5" />
              <div>
                <p className="text-[14px] font-medium text-navy">Hours</p>
                <p className="text-[14px] text-slate">Mon-Fri: 8am - 6pm</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-display font-semibold text-[20px] text-navy mb-4">Send a Message</h3>
            <form className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Your name"
                className="px-4 py-3 border border-border rounded-lg bg-surface text-slate focus:outline-none focus:border-teal"
              />
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-3 border border-border rounded-lg bg-surface text-slate focus:outline-none focus:border-teal"
              />
              <textarea
                placeholder="Your message"
                rows="4"
                className="px-4 py-3 border border-border rounded-lg bg-surface text-slate focus:outline-none focus:border-teal resize-none"
              />
              <button className="self-start w-full md:w-auto bg-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-mid transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}