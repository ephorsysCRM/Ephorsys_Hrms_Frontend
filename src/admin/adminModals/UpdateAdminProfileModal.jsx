import React, { useEffect, useState } from 'react'

import { Pencil, User, Phone, Save, X } from 'lucide-react'

import { useDispatch, useSelector } from 'react-redux'

import { updateAdminProfile } from '../../Redux/features/auth/authThunk'

const UpdateAdminProfileModal = ({ onClose }) => {
  const dispatch = useDispatch()

  // =====================================================
  // REDUX AUTH STATE
  // =====================================================

  const { user, admin, userType } = useSelector(state => state.auth)

  // Support new generic user and legacy admin state
  const currentUser = user || admin

  // =====================================================
  // LOCAL STATES
  // =====================================================

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [profileImage, setProfileImage] = useState(null)
  const [previewImage, setPreviewImage] = useState('')
  const [loading, setLoading] = useState(false)

  // =====================================================
  // USER DETAILS
  // =====================================================

  const userId = currentUser?._id || currentUser?.id

  const email = currentUser?.email || currentUser?.officialEmail || ''

  // =====================================================
  // SET PROFILE DATA
  // =====================================================

  useEffect(() => {
    if (!currentUser) return

    const fullName =
      currentUser.name ||
      [currentUser.firstName, currentUser.lastName].filter(Boolean).join(' ') ||
      currentUser.fullName ||
      ''

    setName(fullName)

    setPhone(
      currentUser.phone || currentUser.mobile || currentUser.phoneNumber || ''
    )

    setPreviewImage(
      currentUser.profileImage ||
        currentUser.profilePhoto ||
        currentUser.avatar ||
        ''
    )
  }, [currentUser])

  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  const handleImageChange = event => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      console.error('Please select a valid image.')
      return
    }

    // Optional client-side file size validation: 5 MB
    if (file.size > 5 * 1024 * 1024) {
      console.error('Image size must be less than 5 MB.')
      return
    }

    setProfileImage(file)

    const imageUrl = URL.createObjectURL(file)

    setPreviewImage(previousPreview => {
      if (previousPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(previousPreview)
      }

      return imageUrl
    })
  }

  // =====================================================
  // CLEAN UP IMAGE PREVIEW
  // =====================================================

  useEffect(() => {
    return () => {
      if (previewImage?.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage)
      }
    }
  }, [previewImage])

  // =====================================================
  // UPDATE PROFILE
  // =====================================================

  const handleSubmit = async event => {
    event.preventDefault()

    if (!userId) {
      console.error('User ID not found.')
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()

      formData.append('name', name.trim())
      formData.append('phone', phone.trim())

      if (profileImage) {
        formData.append('profileImage', profileImage)
      }

      // The thunk and backend must support both Admin
      // and Employee/HR profile updates.
      const result = await dispatch(updateAdminProfile(userId, formData))

      if (updateAdminProfile.fulfilled.match(result)) {
        onClose()
      }
    } catch (error) {
      console.error('Update profile error:', error)
    } finally {
      setLoading(false)
    }
  }

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <form onSubmit={handleSubmit} className='w-full'>
      {/* PROFILE IMAGE */}

      <div className='flex justify-center mb-6'>
        <label
          className='
                        relative
                        w-24 h-24
                        rounded-full
                        bg-black
                        overflow-hidden
                        cursor-pointer
                        group
                    '
        >
          {previewImage ? (
            <img
              src={previewImage}
              alt={name || 'Profile'}
              className='w-full h-full object-cover'
            />
          ) : (
            <div
              className='
                                w-full h-full
                                flex items-center justify-center
                                text-white text-2xl font-semibold
                            '
            >
              {name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}

          {/* IMAGE OVERLAY */}

          <div
            className='
                            absolute inset-0
                            bg-black/50
                            opacity-0
                            group-hover:opacity-100
                            transition-all duration-200
                            flex items-center justify-center
                            text-white
                        '
          >
            <Pencil size={20} />
          </div>

          <input
            type='file'
            accept='image/*'
            className='hidden'
            onChange={handleImageChange}
            disabled={loading}
          />
        </label>
      </div>

      {/* NAME */}

      <div className='mb-5'>
        <label
          className='
                        block text-xs font-medium
                        text-black mb-2
                    '
        >
          Name
        </label>

        <div className='relative'>
          <User
            size={17}
            className='
                            absolute left-3 top-1/2
                            -translate-y-1/2 text-black/40
                        '
          />

          <input
            type='text'
            value={name}
            onChange={event => setName(event.target.value)}
            placeholder='Enter your name'
            required
            maxLength={100}
            disabled={loading}
            className='
                            w-full h-11 pl-10 pr-3
                            rounded-xl border border-black/10
                            bg-white text-sm text-black
                            outline-none focus:border-black
                            transition-all
                        '
          />
        </div>
      </div>

      {/* PHONE */}

      <div className='mb-5'>
        <label
          className='
                        block text-xs font-medium
                        text-black mb-2
                    '
        >
          Phone Number
        </label>

        <div className='relative'>
          <Phone
            size={17}
            className='
                            absolute left-3 top-1/2
                            -translate-y-1/2 text-black/40
                        '
          />

          <input
            type='tel'
            value={phone}
            onChange={event => setPhone(event.target.value)}
            placeholder='Enter phone number'
            maxLength={20}
            disabled={loading}
            className='
                            w-full h-11 pl-10 pr-3
                            rounded-xl border border-black/10
                            bg-white text-sm text-black
                            outline-none focus:border-black
                            transition-all
                        '
          />
        </div>
      </div>

      {/* EMAIL - READ ONLY */}

      <div className='mb-6'>
        <label
          className='
                        block text-xs font-medium
                        text-black mb-2
                    '
        >
          Email
        </label>

        <input
          type='email'
          value={email}
          disabled
          className='
                        w-full h-11 px-3
                        rounded-xl border border-black/10
                        bg-black/3 text-sm text-black/50
                        outline-none cursor-not-allowed
                    '
        />

        <p className='text-[10px] text-black/30 mt-1.5'>
          Email cannot be changed from here.
        </p>
      </div>

      {/* ACTIONS */}

      <div className='grid grid-cols-2 gap-3'>
        {/* CANCEL */}

        <button
          type='button'
          onClick={onClose}
          disabled={loading}
          className='
                        h-11 rounded-xl
                        border border-black/10
                        bg-white text-black/60
                        hover:bg-black/5 hover:text-black
                        text-sm font-medium
                        transition-all duration-200
                        flex items-center justify-center gap-2
                        cursor-pointer disabled:opacity-50
                    '
        >
          <X size={16} />
          Cancel
        </button>

        {/* UPDATE */}

        <button
          type='submit'
          disabled={loading || !userId}
          className='
                        h-11 rounded-xl
                        bg-black text-white
                        text-sm font-semibold
                        hover:bg-black/80
                        transition-all duration-200
                        flex items-center justify-center gap-2
                        cursor-pointer
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                    '
        >
          {loading ? (
            <>
              <span
                className='
                                    w-4 h-4
                                    border-2 border-white/30
                                    border-t-white
                                    rounded-full animate-spin
                                '
              />
              Updating...
            </>
          ) : (
            <>
              <Save size={16} />
              Update Profile
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default UpdateAdminProfileModal
