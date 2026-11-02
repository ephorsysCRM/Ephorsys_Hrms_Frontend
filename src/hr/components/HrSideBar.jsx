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
  Megaphone,
  FileCheck2
} from 'lucide-react'

import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

import Modal from '../../UI/Modal'
import image from '/icon.png'
import LogoutModal from '../../admin/adminModals/LogoutModal'

// =========================================================
// SECTIONS
// =========================================================

const SECTIONS = {
  hr: {
    label: 'HR Panel',
    caption: 'Manage employees, attendance and payroll',
    icon: Users,
    home: '/hr/dashboard'
  },
  self: {
    label: 'My Space',
    caption: 'Your own attendance, leave and salary',
    icon: UserRound,
    home: '/hr/my/dashboard'
  }
}

// =========================================================
// HR PANEL ITEMS (HR manages the company here)
// =========================================================

const HR_ITEMS = [
  {
    label: 'Dashboard',
    path: '/hr/dashboard',
    icon: LayoutDashboard
  },

  {
    label: 'Departments',
    path: '/hr/departments',
    icon: Building2
  },

  {
    label: 'Employees',
    path: '/hr/all-employees',
    icon: Users
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
        label: 'Attendance Requests',
        path: '/hr/attendance-requests',
        icon: FileCheck2
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
// MY SPACE ITEMS (HR uses these as a normal employee)
// =========================================================

const SELF_ITEMS = [
  {
    label: 'Dashboard',
    path: '/hr/my/dashboard',
    icon: LayoutDashboard
  },

  {
    label: 'My Profile',
    path: '/hr/my/profile',
    icon: User
  },

  {
    label: 'My Attendance',
    path: '/hr/my/attendance',
    icon: CalendarCheck
  },

  {
    label: 'My Leave',
    path: '/hr/my/leave',
    icon: CalendarDays
  },

  {
    label: 'My Salary',
    path: '/hr/my/salary',
    icon: Wallet
  }
]

// =========================================================
// HELPERS
// =========================================================

const isPathActive = (pathname, path) =>
  pathname === path || pathname.startsWith(`${path}/`)

// =========================================================
// HR SIDEBAR
// =========================================================

const HrSideBar = ({ sidebarOpen, setSidebarOpen }) => {
  const { pathname } = useLocation()

  const [logoutView, setLogoutView] = useState(false)

  // Only stores menus the user opened/closed by hand.
  // A menu that contains the current page opens automatically.
  const [openMenus, setOpenMenus] = useState({})

  const navigate = useNavigate()

  const getSectionFromPath = path =>
    path === '/hr/my' || path.startsWith('/hr/my/') ? 'self' : 'hr'

  const [activeSection, setActiveSection] = useState(
    getSectionFromPath(pathname)
  )

  // Follow the page the user lands on (refresh, deep link, menu click)
  useEffect(() => {
    setActiveSection(getSectionFromPath(pathname))
  }, [pathname])

  const currentMenuItems = activeSection === 'self' ? SELF_ITEMS : HR_ITEMS

  // Show that section's menu at once and open its home page
  const handleSwitchSection = section => {
    if (section === activeSection) return

    setOpenMenus({})
    setActiveSection(section)
    navigate(SECTIONS[section].home)
  }

  const toggleMenu = (label, isOpen) => {
    setOpenMenus(previous => ({
      ...previous,
      [label]: !isOpen
    }))
  }

  const closeOnMobile = () => setSidebarOpen(false)

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
            className='fixed inset-0 z-40 bg-black/40 lg:hidden'
            onClick={closeOnMobile}
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
        {/* HEADER */}

        <div className='h-16 flex items-center justify-between px-5'>
          <div className='flex items-center gap-3'>
            <div className='w-9 h-9 rounded-lg flex items-center justify-center'>
              <img src={image} alt='EPHORSYS' />
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

          <button
            type='button'
            onClick={closeOnMobile}
            aria-label='Close sidebar'
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

        {/* SECTION SWITCHER */}

        <div className='border-y border-black/10 px-3 py-3'>
          <div
            role='tablist'
            aria-label='Switch workspace'
            className='grid grid-cols-2 gap-1 rounded-lg bg-black/5 p-1'
          >
            {Object.entries(SECTIONS).map(([key, section]) => {
              const SectionIcon = section.icon
              const isActive = activeSection === key

              return (
                <button
                  key={key}
                  type='button'
                  role='tab'
                  aria-selected={isActive}
                  onClick={() => handleSwitchSection(key)}
                  className={`
                    flex items-center justify-center gap-1.5
                    rounded-md px-2 py-2
                    text-[12px] font-medium
                    transition-all duration-200
                    cursor-pointer
                    ${
                      isActive
                        ? 'bg-black text-white shadow-sm'
                        : 'text-black/50 hover:text-black'
                    }
                  `}
                >
                  <SectionIcon size={14} strokeWidth={1.9} />
                  {section.label}
                </button>
              )
            })}
          </div>

          <p className='mt-2 px-1 text-[11px] leading-snug text-black/40'>
            {SECTIONS[activeSection].caption}
          </p>
        </div>

        {/* NAVIGATION */}

        <nav className='flex-1 overflow-y-auto px-3 py-4'>
          <div className='space-y-1'>
            {currentMenuItems.map(item => {
              const Icon = item.icon

              // ---------- MENU WITH SUBMENU ----------

              if (item.children) {
                const hasActiveChild = item.children.some(child =>
                  isPathActive(pathname, child.path)
                )

                const isOpen = openMenus[item.label] ?? hasActiveChild

                return (
                  <div key={item.label}>
                    <button
                      type='button'
                      onClick={() => toggleMenu(item.label, isOpen)}
                      aria-expanded={isOpen}
                      className={`
                        w-full
                        flex
                        items-center
                        justify-between
                        px-3
                        py-3
                        rounded-lg
                        transition-all
                        duration-200
                        cursor-pointer
                        ${
                          hasActiveChild
                            ? 'bg-black/5 text-black'
                            : 'text-black/70 hover:bg-black/5 hover:text-black'
                        }
                      `}
                    >
                      <div className='flex items-center gap-3'>
                        <Icon size={19} strokeWidth={1.8} />

                        <span className='text-sm font-medium'>
                          {item.label}
                        </span>
                      </div>

                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={17} />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          className='overflow-hidden'
                        >
                          <div className='mt-1 ml-3 pl-3 border-l border-black/10 space-y-1'>
                            {item.children.map(child => {
                              const ChildIcon = child.icon

                              return (
                                <NavLink
                                  key={child.path}
                                  to={child.path}
                                  onClick={closeOnMobile}
                                  className={({ isActive }) => `
                                    flex
                                    items-center
                                    gap-3
                                    px-3
                                    py-2.5
                                    rounded-lg
                                    transition-all
                                    duration-200
                                    ${
                                      isActive
                                        ? 'bg-black text-white! font-medium'
                                        : 'text-black/60 hover:bg-black/5 hover:text-black'
                                    }
                                  `}
                                >
                                  <ChildIcon size={16} strokeWidth={1.8} />

                                  <span className='text-sm'>{child.label}</span>
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

              // ---------- NORMAL MENU ----------

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeOnMobile}
                  className={({ isActive }) => `
                    flex
                    items-center
                    gap-3
                    px-3
                    py-3
                    rounded-lg
                    transition-all
                    duration-200
                    ${
                      isActive
                        ? 'bg-black text-white! shadow-sm'
                        : 'text-black/70 hover:bg-black/5 hover:text-black'
                    }
                  `}
                >
                  <Icon size={19} strokeWidth={1.8} />

                  <span className='text-sm font-medium'>{item.label}</span>
                </NavLink>
              )
            })}
          </div>
        </nav>

        {/* FOOTER */}

        <div className='border-t border-black/10 p-3'>
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
              text-white!
              hover:bg-black/80
              transition-all
              duration-200
              cursor-pointer
            '
          >
            <LogOut size={19} strokeWidth={1.8} />

            <span className='text-sm font-medium'>Logout</span>
          </button>
        </div>
      </aside>

      {/* LOGOUT MODAL */}

      <Modal isOpen={logoutView} onClose={() => setLogoutView(false)}>
        <LogoutModal onClose={() => setLogoutView(false)} />
      </Modal>
    </>
  )
}

export default HrSideBar
