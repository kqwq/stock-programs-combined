"use client"

import React from 'react'
import Navbar from '@/components/Navbar'

const Page = () => {
  return (
    <>
      <Navbar />
      <main>

        <div className="flex flex-col items-center justify-center h-36 bg-gradient-to-br from-green-800 to-green-700">
          <h1 className="text-4xl font-bold text-white" >Excel Stock Downloader</h1>
        </div>
      </main >

    </>

  )
}

export default Page