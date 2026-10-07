import React, { useEffect, useState } from 'react'

import { Menu, Bell, Maximize, Minimize, Pencil } from 'lucide-react'

import { AnimatePresence, motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'

import { getAdminProfile } from '../../Redux/features/auth/authThunk'

import Modal from '../../UI/Modal'
import UpdateAdminProfileModal from '../../admin/adminModals/UpdateAdminProfileModal'

const EmpTopBar = ({ setSidebarOpen }) => {
  const dispatch = useDispatch()

  // =====================================================
  // REDUX AUTH STATE
  // =====================================================

  const { user, admin, userType, role, isAuthenticated, authChecked } =
    useSelector(state => state.auth)

  // Supports both new and legacy Redux state
  const currentUser = user || admin

  const currentRole = role || currentUser?.role || userType || 'HR'

  const profileName =
    currentUser?.name ||
    [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(' ') ||
    currentUser?.fullName ||
    (userType === 'employee' ? 'Employee' : 'Admin')

  const profileEmail = currentUser?.email || currentUser?.officialEmail || ''

  const profilePhone =
    currentUser?.phone || currentUser?.mobile || currentUser?.phoneNumber || ''

  const profileImage =
    currentUser?.profileImage || currentUser?.profilePhoto || ''

  const profileInitials = profileName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()

  // =====================================================
  // LOCAL STATE
  // =====================================================

  const [profileOpen, setProfileOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [editProfileOpen, setEditProfileOpen] = useState(false)

  // =====================================================
  // FETCH PROFILE
  // Cookie-based authentication: no accessToken check
  // =====================================================

  useEffect(() => {
    if (authChecked && isAuthenticated && !currentUser) {
      dispatch(getAdminProfile())
    }
  }, [authChecked, isAuthenticated, currentUser, dispatch])

  // =====================================================
  // FULLSCREEN
  // =====================================================

  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.error('Fullscreen error:', error)
    }
  }

  // =====================================================
  // FULLSCREEN CHANGE
  // =====================================================

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  // =====================================================
  // EDIT PROFILE
  // =====================================================

  const handleEditProfile = event => {
    event.stopPropagation()
    setProfileOpen(false)
    setEditProfileOpen(true)
  }

  const handleCloseEditProfile = () => {
    setEditProfileOpen(false)
  }

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <>
      <header
        className='
                    h-16 w-full bg-white border-b border-black/10
                    flex items-center justify-between px-4 lg:px-6
                    relative z-40
                '
      >
        {/* LEFT SIDE */}

        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={() => setSidebarOpen(prev => !prev)}
            className='
                            lg:hidden w-9 h-9 rounded-lg flex
                            items-center justify-center text-black/60
                            hover:bg-black/5 hover:text-black
                            transition-all cursor-pointer
                        '
            aria-label='Toggle sidebar'
          >
            <Menu size={20} />
          </button>

          <div>
            <h1 className='text-sm lg:text-base font-semibold text-black'>
              Dashboard
            </h1>

            <p className='hidden sm:block text-[10px] text-black/40'>
              Welcome back
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className='flex items-center gap-2'>
          {/* FULLSCREEN */}

          <button
            type='button'
            onClick={handleFullscreen}
            className='
                            hidden sm:flex w-9 h-9 rounded-lg
                            items-center justify-center text-black/50
                            hover:bg-black/5 hover:text-black
                            transition-all cursor-pointer
                        '
            title='Fullscreen'
            aria-label='Toggle fullscreen'
          >
            {isFullscreen ? <Minimize size={17} /> : <Maximize size={17} />}
          </button>

          {/* NOTIFICATIONS */}

          <button
            type='button'
            className='
                            relative w-9 h-9 rounded-lg flex
                            items-center justify-center text-black/50
                            hover:bg-black/5 hover:text-black
                            transition-all cursor-pointer
                        '
            aria-label='Notifications'
          >
            <Bell size={18} />

            <span
              className='
                                absolute top-2 right-2 w-1.5 h-1.5
                                rounded-full bg-black
                            '
            />
          </button>

          {/* PROFILE */}

          <div className='relative ml-1'>
            <button
              type='button'
              onClick={() => setProfileOpen(prev => !prev)}
              className='
                                flex items-center gap-2 rounded-lg
                                px-1.5 py-1 hover:bg-black/5
                                transition-all cursor-pointer
                            '
              aria-expanded={profileOpen}
              aria-label='Open profile menu'
            >
              {/* AVATAR */}

              <div
                className='
                                    w-9 h-9 rounded-full bg-black
                                    flex items-center justify-center
                                    text-white text-[11px] font-semibold
                                    overflow-hidden shrink-0
                                '
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={profileName}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  profileInitials || 'U'
                )}
              </div>

              {/* NAME AND ROLE */}

              <div className='hidden md:block text-left'>
                <p className='text-[12px] font-semibold text-black'>
                  {profileName}
                </p>

                <p className='text-[10px] text-black/40 capitalize'>
                  {currentRole.replace(/_/g, ' ')}
                </p>
              </div>
            </button>

            {/* PROFILE DROPDOWN */}

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -8,
                    scale: 0.96
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                  }}
                  exit={{
                    opacity: 0,
                    y: -8,
                    scale: 0.96
                  }}
                  transition={{
                    duration: 0.2,
                    ease: 'easeOut'
                  }}
                  className='
                                        absolute right-0 mt-2.5 w-56
                                        bg-white border border-black/10
                                        rounded-xl shadow-lg overflow-hidden z-50
                                    '
                >
                  {/* PROFILE HEADER */}

                  <div
                    className='
                                            relative flex items-center gap-3
                                            px-4 py-3.5 border-b border-black/10
                                        '
                  >
                    <motion.button
                      type='button'
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={handleEditProfile}
                      className='
                                                absolute top-2.5 right-2.5
                                                w-7 h-7 rounded-lg border
                                                border-black/10 bg-white
                                                flex items-center justify-center
                                                text-black/50 hover:bg-black
                                                hover:text-white hover:border-black
                                                transition-all duration-200 cursor-pointer
                                            '
                      aria-label='Edit profile'
                      title='Edit Profile'
                    >
                      <Pencil size={13} />
                    </motion.button>

                    {/* AVATAR */}

                    <div
                      className='
                                                w-9 h-9 rounded-full bg-black
                                                flex items-center justify-center
                                                text-white text-[12px] font-semibold
                                                shrink-0 overflow-hidden
                                            '
                    >
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt={profileName}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        profileInitials || 'U'
                      )}
                    </div>

                    {/* USER DETAILS */}

                    <div className='pr-7 min-w-0'>
                      <p className='text-[13px] font-semibold text-black'>
                        {profileName}
                      </p>

                      <p className='text-[11px] text-black/40 capitalize mt-0.5'>
                        {currentRole.replace(/_/g, ' ')}
                      </p>

                      {profileEmail && (
                        <p className='text-[10px] text-black/30 mt-1 break-all'>
                          {profileEmail}
                        </p>
                      )}

                      {profilePhone && (
                        <p className='text-[10px] text-black/30 mt-0.5'>
                          {profilePhone}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* UPDATE PROFILE MODAL */}

      <Modal
        isOpen={editProfileOpen}
        onClose={handleCloseEditProfile}
        title={userType === 'admin' ? 'Update Admin Profile' : 'Update Profile'}
        size='md'
      >
        <UpdateAdminProfileModal onClose={handleCloseEditProfile} />
      </Modal>
    </>
  )
}

export default EmpTopBar
