import { Search } from 'lucide-react'
import React from 'react'

export default function Dashboard() {
  return (
    <div className="p-4 flex flex-col gap-4 min-h-screen w-full">
        <section className="p-4 flex flex-col gap-2">
            <div className="flex flex-col h-full w-10">
                <h1 className="text-3xl font-bold">Welcome, Ian!</h1>
                <h5 className="text-xl">You have 2 appointments today.</h5>
            </div>
            <div className="flex flex-row gap-2"></div>
        </section>

        <section></section>

        <section className="flex flex-row gap-4 p-4">
            <div className="flex flex-col gap-2">
                <div className="bg-green-400 w-3 h-3 rounded-sm"></div>
                <h2 className="text-2xl font-semibold">2</h2>
                <h6 className="text-2xl">Upcoming Appointments</h6>
            </div>

            <div className="flex flex-col gap-2">
                <div className="bg-green-200 w-3 h-3 rounded-sm"></div>
                <h2 className="text-2xl font-semibold">4</h2>
                <h6 className="text-2xl">Completed Visits</h6>
            </div>

            <div className="flex flex-col gap-2">
                <div className="bg-green-200 w-3 h-3 rounded-sm"></div>
                <h2 className="text-2xl font-semibold">3</h2>
                <h6 className="text-2xl">Medical records</h6>
            </div>
        </section>
    </div>
  )
}
