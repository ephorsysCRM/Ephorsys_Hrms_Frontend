import {
  LayoutDashboard,
  LogOut,
  X,
  Users,
  UserRound,
  Building2,
  CalendarCheck,
  CalendarDays,
  WalletCards,
  FileText,
  Settings,
  ChevronDown,
  ClipboardList,
  User,
  Wallet,
  Folder,
  Megaphone,
  BellRing
} from 'lucide-react'

import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

import Modal from '../../UI/Modal'
import image from '/icon.png'
import LogoutModal from '../../admin/adminModals/LogoutModal'


// =========================================================
// MANAGE EMPLOYEE SIDEBAR ITEMS
// =========================================================

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/hr/dashboard',
    icon: LayoutDashboard
  },

  {
    label: 'Departments',
    icon: Building2,
    children: [
      {
        label: 'Departments',
        path: '/hr/departments',
        icon: Building2
      }
    ]
  },

  {
    label: 'Employees',
    icon: Users,
    children: [
      {
        label: 'All Employees',
        path: '/hr/all-employees',
        icon: UserRound
      }
    ]
  },

  {
    label: 'Attendance',
    icon: CalendarCheck,
    children: [
      {
        label: 'Attendance',
        path: '/hr/attendance',
        icon: CalendarDays
      },
      {
        label: 'Leave Management',
        path: '/hr/leave-management',
        icon: ClipboardList
      }
    ]
  },

  {
    label: 'Announcements',
    path: '/hr/announcements',
    icon: Megaphone
  },

  {
    label: 'Payroll',
    icon: WalletCards,
    children: [
      {
        label: 'Payroll',
        path: '/hr/payroll',
        icon: WalletCards
      },
      {
        label: 'Payslips',
        path: '/hr/payslips',
        icon: FileText
      }
    ]
  },

  {
    label: 'Reports',
    path: '/hr/reports',
    icon: FileText
  },

  {
    label: 'Settings',
    path: '/hr/settings',
    icon: Settings
  }
]


// =========================================================
// MY PROFILE SIDEBAR ITEMS
// =========================================================

const PROFILE_ITEMS = [
  {
    label: 'Dashboard',
    path: '/employee/dashboard',
    icon: LayoutDashboard
  },

  {
    label: 'My Profile',
    icon: User,
    path: '/employee/profile',
   
  },

  {
    label: 'My Leave',
    icon:   CalendarDays,
    path: '/employee/leave',
    
  },

  {
    label: 'My Salary',
    icon: Wallet,
    children: [
      {
        label: 'Pay Slips',
        path: '/employee/salary',
        icon: FileText
      }
    ]
  },

  {
    label: 'My Document',
    icon: Folder,
    path: '/employee/document',
  },

  {
    label: 'Announcement',
    path: '/employee/announcement',
    icon: Megaphone
  },

  {
    label: 'Notification',
    path: '/employee/notification',
    icon: BellRing
  }
]


// =========================================================
// HR SIDEBAR
// =========================================================

const HrSideBar = ({ sidebarOpen, setSidebarOpen }) => {

  const [logoutview, setLogoutView] = useState(false)

  const [openMenus, setOpenMenus] = useState({})

  // Manage Employee is selected by default
  const [activeSection, setActiveSection] = useState('manage')


  // =======================================================
  // CURRENT SIDEBAR ITEMS
  // =======================================================

  const currentMenuItems =
    activeSection === 'profile'
      ? PROFILE_ITEMS
      : NAV_ITEMS


  // =======================================================
  // TOGGLE SUBMENU
  // =======================================================

  const toggleMenu = label => {
    setOpenMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }))
  }


  const handleManageEmployee = () => {
    setActiveSection('manage')
    setOpenMenus({})
  }



  const handleMyProfile = () => {
    setActiveSection('profile')
    setOpenMenus({})
  }


  return (
    <>
      {/* =========================================================
          MOBILE OVERLAY
      ========================================================= */}

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 z-40 bg-black/40  text-white! lg:hidden'
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>


      {/* =========================================================
          SIDEBAR
      ========================================================= */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-64
          bg-white
          text-black
          flex flex-col
          border-r border-black/10
          shadow-xl
          transform transition-transform duration-300
          lg:relative lg:translate-x-0 lg:shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >

        {/* =======================================================
            SIDEBAR HEADER
        ======================================================= */}

        <div className='h-16 flex items-center justify-between px-5 border-black/10'>

          <div className='flex items-center gap-3'>

            {/* Logo */}

            <div className='w-9 h-9 rounded-lg text-white flex items-center justify-center'>
              <img
                src={image}
                alt='EPHORSYS'
              />
            </div>


            <div>
              <h1 className='text-lg font-bold tracking-tight text-black'>
                EPHORSYS
              </h1>

              <p className='text-[10px] uppercase tracking-[0.2em] text-black/50'>
                HRMS
              </p>
            </div>

          </div>


          {/* Mobile Close */}

          <button
            type='button'
            onClick={() => setSidebarOpen(false)}
            className='
              lg:hidden
              p-2
              rounded-lg
              text-black/60
              hover:bg-black/5
              hover:text-black
              transition
            '
          >
            <X size={20} />
          </button>

        </div>


        {/* =======================================================
            SECTION SWITCHER
        ======================================================= */}

        <div className='border-y border-black/10 px-2 py-3'>

          <div className='grid grid-cols-2 gap-1 rounded-lg bg-black/5 p-1'>

            {/* =================================================
                MANAGE EMPLOYEE
            ================================================= */}

            <button
              type='button'
              onClick={handleManageEmployee}
              className={`
                rounded-md
                px-1
                py-2
                text-[11px]
                font-medium
                transition-all
                duration-200

                ${activeSection === 'manage'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-black/50 hover:text-black'
                }
              `}
            >
              Manage Employee
            </button>


            {/* =================================================
                MY PROFILE
            ================================================= */}

            <button
              type='button'
              onClick={handleMyProfile}
              className={`
                rounded-md
                px-2
                py-2
                text-[11px]
                font-medium
                transition-all
                duration-200

                ${activeSection === 'profile'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-black/50 hover:text-black'
                }
              `}
            >
              My Profile
            </button>

          </div>

        </div>


        {/* =======================================================
            NAVIGATION
        ======================================================= */}

        <nav className='flex-1 overflow-y-auto px-3 py-5'>

          <div className='space-y-1'>

            {currentMenuItems.map(item => {

              const Icon = item.icon


              {/* =================================================
                  MENU WITH SUBMENU
              ================================================= */}

              if (item.children) {

                const isOpen = openMenus[item.label]


                return (
                  <div key={item.label}>

                    {/* Parent Menu */}

                    <button
                      type='button'
                      onClick={() => toggleMenu(item.label)}
                      className='
                        w-full
                        flex
                        items-center
                        justify-between
                        px-3
                        py-3
                        rounded-lg
                        text-black/70
                        hover:bg-black/5
                        hover:text-black
                        transition-all
                        duration-200
                      '
                    >

                      <div className='flex items-center gap-3'>

                        <Icon
                          size={19}
                          strokeWidth={1.8}
                        />

                        <span className='text-sm font-medium'>
                          {item.label}
                        </span>

                      </div>


                      <motion.div
                        animate={{
                          rotate: isOpen ? 180 : 0
                        }}
                        transition={{
                          duration: 0.2
                        }}
                      >
                        <ChevronDown size={17} />
                      </motion.div>

                    </button>


                    {/* Submenu */}

                    <AnimatePresence initial={false}>

                      {isOpen && (

                        <motion.div
                          initial={{
                            height: 0,
                            opacity: 0
                          }}
                          animate={{
                            height: 'auto',
                            opacity: 1
                          }}
                          exit={{
                            height: 0,
                            opacity: 0
                          }}
                          transition={{
                            duration: 0.2,
                            ease: 'easeInOut'
                          }}
                          className='overflow-hidden'
                        >

                          <div className='mt-1 ml-3 pl-3 border-l border-black/10 space-y-1'>

                            {item.children.map(child => {

                              const ChildIcon = child.icon


                              return (
                                <NavLink
                                  key={child.path}
                                  to={child.path}
                                  onClick={() => setSidebarOpen(false)}
                                  className={({ isActive }) => `
                                    flex
                                    items-center
                                    gap-3
                                    px-3
                                    py-2.5
                                    rounded-lg
                                    transition-all
                                    duration-200

                                    ${isActive
                                      ? 'bg-black text-white! font-medium'
                                      : 'text-black/60 hover:bg-black/5 hover:text-black'
                                    }
                                  `}
                                >

                                  <ChildIcon
                                    size={16}
                                    strokeWidth={1.8}
                                  />

                                  <span className='text-sm'>
                                    {child.label}
                                  </span>

                                </NavLink>
                              )

                            })}

                          </div>

                        </motion.div>

                      )}

                    </AnimatePresence>

                  </div>
                )
              }


              {/* =================================================
                  NORMAL MENU
              ================================================= */}

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => `
                    flex
                    items-center
                    gap-3
                    px-3
                    py-3
                    rounded-lg
                    transition-all
                    duration-200

                    ${isActive
                      ? 'bg-black !text-white shadow-sm'
                      : 'text-black/70 hover:bg-black/5 hover:text-black'
                    }
                  `}
                >

                  <Icon
                    size={19}
                    strokeWidth={1.8}
                  />

                  <span className='text-sm font-medium'>
                    {item.label}
                  </span>

                </NavLink>
              )
            })}

          </div>

        </nav>


        {/* =======================================================
            SIDEBAR FOOTER
        ======================================================= */}

        <div className='p-3 border-black/10'>

          <button
            type='button'
            onClick={() => setLogoutView(true)}
            className='
              w-full
              flex
              items-center
              gap-3
              px-3
              py-3
              rounded-lg
              bg-black
              text-white
              hover:bg-black/5
              hover:text-black
              transition-all
              duration-200
            '
          >

            <LogOut
              size={19}
              strokeWidth={1.8}
            />

            <span className='text-sm font-medium'>
              Logout
            </span>

          </button>

        </div>

      </aside>


      {/* =========================================================
          LOGOUT MODAL
      ========================================================= */}

      <Modal
        isOpen={logoutview}
        onClose={() => setLogoutView(false)}
      >
        <LogoutModal
          onClose={() => setLogoutView(false)}
        />
      </Modal>

    </>
  )
}


export default HrSideBar