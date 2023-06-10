'use client'

import Navbar from '@/components/Navbar'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-between p-24">
        <span>Home page</span>
        {/* Icon of home */}
        <Image src="/images/home.png" width={200} height={200} alt="Home icon" />

      </main>
    </>
  )
}
