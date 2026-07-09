import React from 'react'
import { Button } from '../button'

export default function Navbar() {
  return (
    <div className="bg-card flex flex-row items-center justify-between border-b border-border py-15 h-17">
        <Button className="text-[14px] text-(--slate) border-none rounded-[7px] px-2 py-3.5 hover:bg-(--teal-light) hover:text-(--teal) cursor-pointer">Browse Doctors</Button>
        <Button className="text-[14px] text-(--slate) border-none rounded-[7px] px-2 py-3.5 hover:bg-(--teal-light) hover:text-(--teal) cursor-pointer">About</Button>
        <Button className="text-[14px] text-(--slate) border-none rounded-[7px] px-2 py-3.5 hover:bg-(--teal-light) hover:text-(--teal) cursor-pointer">Login</Button>
        <Button className="text-[14px] font-semibold text-white border-none rounded-[7px] px-2.5 py-5 bg-(--teal) cursor-pointer">Get Started</Button>
    </div>
  )
}
