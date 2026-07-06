import React from 'react'

export default function Dashboard() {
  return (
    <div className="p-4 flex flex-col gap-4 min-h-screen">
        <section className="p-4 flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Welcome, Ian!</h1>
            <h5 classname="text-xl">You have 2 appointments today.</h5>
        </section>

        <section className="flex flex-row gap-4 p-4">
            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold">Upcoming Appointments</h2>
                <div className="flex flex-row gap-2"></div>
            </section>
        </section>
    </div>
  )
}
