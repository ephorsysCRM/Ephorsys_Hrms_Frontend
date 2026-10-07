import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import EmpSideBar from '../employee/components/EmpSideBar'
import EmpTopBar from '../employee/components/EmpTopBar'

const EmpLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className='flex h-screen bg-slate-50'>
      <EmpSideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className='flex-1 flex flex-col min-w-0'>
        <EmpTopBar setSidebarOpen={setSidebarOpen} />
        <main className='flex-1 p-4 md:p-6 overflow-y-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default EmpLayout
