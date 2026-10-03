import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import HrSideBar from '../hr/components/HrSideBar'
import HrTopBar from '../hr/components/HrTopBar'

const HrLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className='flex h-screen bg-slate-50'>
      <HrSideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className='flex-1 flex flex-col min-w-0'>
        <HrTopBar setSidebarOpen={setSidebarOpen} />
        <main className='flex-1 p-4 md:p-6 overflow-y-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default HrLayout
