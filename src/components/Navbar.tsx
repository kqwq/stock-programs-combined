

import { repositoryUrl } from '@/util/constants';
import { usePathname } from 'next/navigation'
import React from 'react'

const Navbar = () => {
  const page = usePathname();
  const pageNames = [
    { name: "Home", path: "/", isCurrent: false },
    { name: "Downloader", path: "/downloader", isCurrent: false },
    { name: "Intervals", path: "/intervals", isCurrent: false },
  ]
  console.log(page);

  for (let i = 0; i < pageNames.length; i++) {
    if (pageNames[i].path === page) {
      pageNames[i].isCurrent = true;
    }
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 w-full h-12">
      <div className="flex flex-row w-full justify-between items-center h-full space-x-6">
        <div className="flex flex-row space-x-4">
          <span className="text-white text-xl font-bold ml-4 ">Stock market tools</span>
          <div className="flex flex-row justify-between items-center mr-4 text-slate-300 font-normal space-x-4">
            {
              pageNames.map((pageName, index) => {

                return (
                  <a
                    key={index}
                    href={pageName.path}
                    className={`hover:text-white ${pageName.isCurrent ? "underline" : ""}`}
                  >
                    {pageName.name}
                  </a>
                )
              })
            }
          </div>
        </div>
        <div>
          <a href={repositoryUrl} className="mx-4 text-sm text-slate-300 hover:text-white">Source code</a>
        </div>
      </div>
    </div>
  )
}

export default Navbar