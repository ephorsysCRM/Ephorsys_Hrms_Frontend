import React, { useEffect, useState } from 'react'

import { Menu, Bell, Maximize, Minimize, Pencil } from 'lucide-react'

import { AnimatePresence, motion } from 'framer-motion'

import { useDispatch, useSelector } from 'react-redux'

import { getAdminProfile } from '../../Redux/features/auth/authThunk'

import Modal from '../../UI/Modal'

import UpdateAdminProfileModal from '../adminModals/UpdateAdminProfileModal'

const TopBar = ({ setSidebarOpen }) => {
  const dispatch = useDispatch()

  // =====================================================
  // REDUX AUTH STATE
  // =====================================================

  const { user, admin, userType, role, isAuthenticated, authChecked } =
    useSelector(state => state.auth)

  // Support both the new generic user and legacy admin state
  const currentUser = user || admin

  // =====================================================
  // LOCAL STATES
  // =====================================================

  const [profileOpen, setProfileOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [editProfileOpen, setEditProfileOpen] = useState(false)

  // =====================================================
  // USER PROFILE DATA
  // =====================================================

  const userName =
    currentUser?.name ||
    [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(' ') ||
    currentUser?.fullName ||
    currentUser?.username ||
    (userType === 'employee' ? 'Employee' : 'Admin')

  const userRole = role || currentUser?.role || userType || 'Admin'

  const formattedRole = String(userRole)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase())

  const userEmail = currentUser?.email || currentUser?.officialEmail || ''

  const userPhone =
    currentUser?.phone || currentUser?.mobile || currentUser?.phoneNumber || ''

  const userProfileImage =
    currentUser?.profileImage ||
    currentUser?.profilePhoto ||
    currentUser?.avatar ||
    ''

  const userInitials =
    userName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(word => word.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U'

  // =====================================================
  // FETCH PROFILE
  // =====================================================

  useEffect(() => {
    if (authChecked && isAuthenticated && !currentUser) {
      dispatch(getAdminProfile())
    }
  }, [authChecked, isAuthenticated, Boolean(currentUser), dispatch])

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
  // AVATAR COMPONENT
  // =====================================================

  const renderAvatar = (sizeClass, textClass) => (
    <div
      className={`
                ${sizeClass}
                rounded-full
                bg-black
                flex
                items-center
                justify-center
                text-white
                ${textClass}
                font-semibold
                overflow-hidden
                shrink-0
            `}
    >
      {userProfileImage ? (
        <img
          src={userProfileImage}
          alt={userName}
          className='w-full h-full object-cover'
          onError={event => {
            event.currentTarget.style.display = 'none'
          }}
        />
      ) : (
        userInitials
      )}
    </div>
  )

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <>
      {/* TOP BAR */}

      <header
        className='
                    h-16
                    w-full
                    bg-white
                    border-b
                    border-black/10
                    flex
                    items-center
                    justify-between
                    px-4
                    lg:px-6
                    relative
                    z-40
                '
      >
        {/* LEFT SIDE */}

        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={() => setSidebarOpen(previous => !previous)}
            className='
                            lg:hidden
                            w-9 h-9
                            rounded-lg
                            flex items-center justify-center
                            text-black/60
                            hover:bg-black/5
                            hover:text-black
                            transition-all
                            cursor-pointer
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
                            hidden sm:flex
                            w-9 h-9
                            rounded-lg
                            items-center justify-center
                            text-black/50
                            hover:bg-black/5
                            hover:text-black
                            transition-all
                            cursor-pointer
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
                            relative
                            w-9 h-9
                            rounded-lg
                            flex items-center justify-center
                            text-black/50
                            hover:bg-black/5
                            hover:text-black
                            transition-all
                            cursor-pointer
                        '
            aria-label='Notifications'
          >
            <Bell size={18} />

            <span
              className='
                                absolute top-2 right-2
                                w-1.5 h-1.5
                                rounded-full bg-black
                            '
            />
          </button>

          {/* PROFILE */}

          <div className='relative ml-1'>
            <button
              type='button'
              onClick={() => setProfileOpen(previous => !previous)}
              className='
                                flex items-center gap-2
                                rounded-lg px-1.5 py-1
                                hover:bg-black/5
                                transition-all
                                cursor-pointer
                            '
              aria-expanded={profileOpen}
              aria-label='Open profile menu'
            >
              {renderAvatar('w-9 h-9', 'text-[11px]')}

              <div className='hidden md:block text-left'>
                <p className='text-[12px] font-semibold text-black'>
                  {userName}
                </p>

                <p className='text-[10px] text-black/40 capitalize'>
                  {formattedRole}
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
                                        absolute right-0 mt-2.5
                                        w-64 max-w-[calc(100vw-2rem)]
                                        bg-white
                                        border border-black/10
                                        rounded-xl
                                        shadow-lg
                                        overflow-hidden
                                        z-50
                                    '
                >
                  {/* PROFILE HEADER */}

                  <div
                    className='
                                            relative
                                            flex items-center gap-3
                                            px-4 py-3.5
                                            border-b border-black/10
                                        '
                  >
                    {/* EDIT PROFILE BUTTON */}

                    <motion.button
                      type='button'
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={handleEditProfile}
                      className='
                                                absolute top-2.5 right-2.5
                                                w-7 h-7
                                                rounded-lg
                                                border border-black/10
                                                bg-white
                                                flex items-center justify-center
                                                text-black/50
                                                hover:bg-black
                                                hover:text-white
                                                hover:border-black
                                                transition-all duration-200
                                                cursor-pointer
                                            '
                      aria-label='Edit profile'
                      title='Edit Profile'
                    >
                      <Pencil size={13} />
                    </motion.button>

                    {/* AVATAR */}

                    {renderAvatar('w-10 h-10', 'text-[12px]')}

                    {/* USER DETAILS */}

                    <div className='min-w-0 pr-5'>
                      <p className='text-[13px] font-semibold text-black break-words'>
                        {userName}
                      </p>

                      <p className='text-[11px] text-black/40 capitalize mt-0.5'>
                        {formattedRole}
                      </p>

                      {userEmail && (
                        <p className='text-[10px] text-black/50 mt-1 break-all'>
                          {userEmail}
                        </p>
                      )}

                      {userPhone && (
                        <p className='text-[10px] text-black/50 mt-0.5'>
                          {userPhone}
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

export default TopBar
