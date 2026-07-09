import React from 'react'
import { Button } from '../button'

export default function Navbar() {
  return (
    <div className="bg-card flex flex-row items-center justify-between border-b border-border py-5 h-17">
        <div className="font-[Playfair_Display] text-[20px] font-bold text-(--navy)">
            Book
            <span className="text-(--teal)">Pro</span>
        </div>
        <div className="flex items-center gap-4">
            <Button className="text-[14px] text-(--slate) bg-transparent border-none rounded-[7px] px-2 py-3.5 hover:bg-(--teal-light) hover:text-(--teal) cursor-pointer">Browse doctors</Button>
            <Button className="text-[14px] text-(--slate) bg-transparent border-none rounded-[7px] px-2 py-3.5 hover:bg-(--teal-light) hover:text-(--teal) cursor-pointer">About</Button>
            <Button className="text-[14px] text-(--slate) bg-transparent border-none rounded-[7px] px-2 py-3.5 hover:bg-(--teal-light) hover:text-(--teal) cursor-pointer">Login</Button>
            <Button className="text-[14px] font-semibold text-white border-none rounded-[7px] px-2.5 py-5 bg-(--teal) cursor-pointer">Get Started</Button>
        </div>
    </div>
  )
}
