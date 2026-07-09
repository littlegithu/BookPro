import React from 'react'
import { Button } from '../button'

export default function Navbar() {
  return (
    <div className="">
        <Button className="text-[14px] text-[#4a6278] border-none rounded-[7px] px-2 py-3.5 hover:bg-[#e6f4f2] hover:text-[#0f7b6c] cursor-pointer">Browse Doctors</Button>
        <Button className="text-[14px] text-[#4a6278] border-none rounded-[7px] px-2 py-3.5 hover:bg-[#e6f4f2] hover:text-[#0f7b6c] cursor-pointer">About</Button>
        <Button className="text-[14px] text-[#4a6278] border-none rounded-[7px] px-2 py-3.5 hover:bg-[#e6f4f2] hover:text-[#0f7b6c] cursor-pointer">Login</Button>
        <Button className="text-[14px] font-semibold text-white border-none rounded-[7px] px-2.5 py-5 bg-[#0f7b6c] cursor-pointer">Get Started</Button>
    </div>
  )
}
