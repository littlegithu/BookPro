import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <section className="bg-(--navy) pt-14 px-15 pb-8">
        <section className="">
            <div>
                <div>
                    Book
                <span className="text-(--teal)">Pro</span>
                </div>
                <p>
                    Clinical checkups made simple. Find a verified doctor and book your appointment in minutes.
                </p>
            </div>
            <nav>
                <Link className="text-[10px] font-medium color-[rgba(255,255,255,0.65)] margin-b-[14px] uppercase">Patients</Link>
                <Link className="block text-[13px] text-[rgba(255,255,255,0.42)] margin-b-[9px] hover:text-[rgba(255,255,255,0.8)] cursor-pointer">Browse doctors</Link>
                <Link className="block text-[13px] text-[rgba(255,255,255,0.42)] margin-b-[9px] hover:text-[rgba(255,255,255,0.8)] cursor-pointer">My appointments</Link>
                <Link className="block text-[13px] text-[rgba(255,255,255,0.42)] margin-b-[9px] hover:text-[rgba(255,255,255,0.8)] cursor-pointer">Medical records</Link>
            </nav>
        </section>

        <section></section>
    </section>
  )
}
