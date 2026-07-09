import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="bg-card flex flex-row items-center justify-between border-b border-border py-5 h-17">
       <Link className="font-[Playfair_Display] text-[20px] font-bold text-(--navy)">
            Book
            <span className="text-(--teal)">Pro</span>
        </Link>
        <div className="flex items-center gap-4">
            <Link className="text-[14px] text-(--slate) bg-transparent border-none rounded-[7px] px-2 py-3.5 hover:bg-(--teal-light) hover:text-(--teal) cursor-pointer">Browse doctors</Link>
            <Link className="text-[14px] text-(--slate) bg-transparent border-none rounded-[7px] px-2 py-3.5 hover:bg-(--teal-light) hover:text-(--teal) cursor-pointer">About</Link>
            <Link className="text-[14px] text-(--slate) bg-transparent border-none rounded-[7px] px-2 py-3.5 hover:bg-(--teal-light) hover:text-(--teal) cursor-pointer">Login</Link>
            <Link className="text-[14px] font-semibold text-white border-none rounded-[7px] px-2.5 py-5 bg-(--teal) cursor-pointer">Get Started</Link>
        </div>
    </nav>
  )
}
