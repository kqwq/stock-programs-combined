"use client"

import React from 'react'
import Navbar from '@/components/Navbar'
import { main } from "./excel"

const Page = () => {

  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const progressRef = React.useRef<HTMLDivElement>(null)
  const statusRef = React.useRef<HTMLSpanElement>(null)

  function textareaOnType() {
    if (!textareaRef.current) return
    textareaRef.current.value = textareaRef.current.value.toUpperCase()
  }
  function textareaOnAreaLeave() {
    if (!textareaRef.current) return
    let val = textareaRef.current.value
    val = val.trimStart().toUpperCase().split(/\W+/gi).join(', ').trimEnd();
    textareaRef.current.value = val
  }
  function updateProgress(percent: number) {
    if (!progressRef.current) return
    progressRef.current.style.width = `${percent}%`
  }
  function updateStatus(status: string) {
    if (!statusRef.current) return
    statusRef.current.innerText = status
  }
  function startDownload() {
    const tickers = textareaRef.current?.value.split(',').map(t => t.trim()).filter(t => t.length > 0)
    if (tickers) {
      console.log('startDownload', tickers);

      main(tickers, { updateProgress, updateStatus })
    }
  }

  return (
    <>
      <Navbar />
      <main>

        <div className="flex flex-col items-center justify-center h-36 bg-gradient-to-br from-green-800 to-green-700">
          <h1 className="text-4xl font-bold text-white" >Excel Stock Downloader</h1>
        </div>
        {/* Split between 2 sides. One has a text input for stocks input, the other is an empty div of results */}

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-200 text-black">
          <div className="flex flex-col items-center justify-center my-8">
            <h2 className="text-2xl font-bold mb-3">Input</h2>
            <span>Comma-separated list of stock tickers</span>
            <textarea className="w-1/2 h-24 mt-4 text-xlgl p-3 " placeholder='example: AAPL, META' onChange={textareaOnType} onBlur={textareaOnAreaLeave} ref={textareaRef} />
            <button className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded mt-4" onClick={startDownload}>Start download</button>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-3">Result</h2>
            {/* Status */}
            <span className=" " ref={statusRef}>No download started</span>
            {/* Progress bar */}
            <div className="w-1/2 h-2 bg-gray-300 rounded-sm overflow-hidden mt-1">
              <div className="bg-blue-700 h-full w-2" ref={progressRef}></div>
            </div>
          </div>
        </div>

      </main >

    </>

  )
}

export default Page
