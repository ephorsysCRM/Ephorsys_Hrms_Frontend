import { useEffect, useState } from 'react'
import { Pencil, User, Phone, Save, X } from 'lucide-react'

import { useDispatch, useSelector } from 'react-redux'

import { updateAdminProfile } from '../../redux/features/auth/authThunk'

const UpdateAdminProfileModal = ({ onClose }) => {
  const dispatch = useDispatch()

  // =====================================================
  // REDUX AUTH STATE
  // =====================================================

  const { user, admin } = useSelector(state => state.auth)

  // Support both:
  // 1. Generic user state
  // 2. Legacy admin state
  const currentUser = user || admin

  // =====================================================
  // LOCAL STATE
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
  // SET USER DATA
  // =====================================================

  useEffect(() => {
    if (!currentUser) return

    // ===================================================
    // NAME
    // ===================================================

    const fullName =
      currentUser.name ||
      [currentUser.firstName, currentUser.middleName, currentUser.lastName]
        .filter(Boolean)
        .join(' ') ||
      currentUser.fullName ||
      ''

    setName(fullName)

    // ===================================================
    // PHONE
    // ===================================================

    setPhone(
      currentUser.phone || currentUser.mobile || currentUser.phoneNumber || ''
    )

    // ===================================================
    // PROFILE IMAGE
    // ===================================================

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

    // ===================================================
    // IMAGE TYPE VALIDATION
    // ===================================================

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image.')
      return
    }

    // ===================================================
    // IMAGE SIZE VALIDATION
    // ===================================================

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5 MB.')
      return
    }

    // ===================================================
    // SET FILE
    // ===================================================

    setProfileImage(file)

    // ===================================================
    // CREATE PREVIEW
    // ===================================================

    const imageUrl = URL.createObjectURL(file)

    setPreviewImage(previousPreview => {
      if (previousPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(previousPreview)
      }

      return imageUrl
    })
  }

  // =====================================================
  // CLEANUP IMAGE PREVIEW
  // =====================================================

  useEffect(() => {
    return () => {
      if (previewImage?.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage)
      }
    }
  }, [previewImage])

  // =====================================================
  // UPDATE PROFILE IMAGE
  // =====================================================

  const handleSubmit = async event => {
    event.preventDefault()

    // ===================================================
    // USER ID CHECK
    // ===================================================

    if (!userId) {
      console.error('User ID not found.')

      alert('User information not found.')

      return
    }

    // ===================================================
    // IMAGE CHECK
    // ===================================================

    if (!profileImage) {
      alert('Please select a new profile image.')

      return
    }

    try {
      setLoading(true)

      // =================================================
      // FORM DATA
      // =================================================

      const formData = new FormData()

      // IMPORTANT:
      // ONLY PROFILE IMAGE IS SENT.
      //
      // Name ❌
      // Phone ❌
      // Email ❌

      formData.append('profileImage', profileImage)

      // =================================================
      // DEBUG
      // =================================================

      console.log('================================')
      console.log('UPDATE PROFILE IMAGE')
      console.log('================================')

      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, {
            name: value.name,
            type: value.type,
            size: value.size
          })
        } else {
          console.log(key, value)
        }
      }

      // =================================================
      // API
      // =================================================

      const result = await dispatch(updateAdminProfile(userId, formData))

      console.log('UPDATE PROFILE RESULT:', result)

      // =================================================
      // SUCCESS
      // =================================================

      if (result?.success) {
        alert(result.message || 'Profile image updated successfully.')

        onClose()

        return
      }

      // =================================================
      // FAILURE
      // =================================================

      alert(result?.message || 'Failed to update profile image.')
    } catch (error) {
      console.error('Update profile image error:', error)

      alert(
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong while updating profile image.'
      )
    } finally {
      setLoading(false)
    }
  }

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <form onSubmit={handleSubmit} className='w-full'>
      {/* =================================================
          PROFILE IMAGE
      ================================================= */}

      <div className='mb-6 flex justify-center'>
        <label
          className='
            group
            relative
            h-24
            w-24
            cursor-pointer
            overflow-hidden
            rounded-full
            bg-black
          '
        >
          {/* IMAGE */}

          {previewImage ? (
            <img
              src={previewImage}
              alt={name || 'Profile'}
              className='
                h-full
                w-full
                object-cover
              '
            />
          ) : (
            <div
              className='
                flex
                h-full
                w-full
                items-center
                justify-center
                text-2xl
                font-semibold
                text-white
              '
            >
              {name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}

          {/* IMAGE HOVER */}

          <div
            className='
              absolute
              inset-0
              flex
              items-center
              justify-center
              bg-black/50
              text-white
              opacity-0
              transition-all
              duration-200
              group-hover:opacity-100
            '
          >
            <Pencil size={20} />
          </div>

          {/* FILE INPUT */}

          <input
            type='file'
            accept='image/*'
            className='hidden'
            onChange={handleImageChange}
            disabled={loading}
          />
        </label>
      </div>

      {/* =================================================
          IMAGE INFORMATION
      ================================================= */}

      <p className='mb-6 text-center text-xs text-black/40'>
        Click the image to change your profile photo.
        <br />
        Maximum file size: 5 MB.
      </p>

      {/* =================================================
          NAME
      ================================================= */}

      <div className='mb-5'>
        <label
          className='
            mb-2
            block
            text-xs
            font-medium
            text-black
          '
        >
          Name
        </label>

        <div className='relative'>
          <User
            size={17}
            className='
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-black/40
            '
          />

          <input
            type='text'
            value={name}
            disabled
            readOnly
            className='
              h-11
              w-full
              cursor-not-allowed
              rounded-xl
              border
              border-black/10
              bg-black/[0.03]
              pl-10
              pr-3
              text-sm
              text-black/50
              outline-none
            '
          />
        </div>

        <p className='mt-1.5 text-[10px] text-black/30'>
          Name cannot be changed from here.
        </p>
      </div>

      {/* =================================================
          PHONE
      ================================================= */}

      <div className='mb-5'>
        <label
          className='
            mb-2
            block
            text-xs
            font-medium
            text-black
          '
        >
          Phone Number
        </label>

        <div className='relative'>
          <Phone
            size={17}
            className='
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-black/40
            '
          />

          <input
            type='tel'
            value={phone}
            disabled
            readOnly
            className='
              h-11
              w-full
              cursor-not-allowed
              rounded-xl
              border
              border-black/10
              bg-black/[0.03]
              pl-10
              pr-3
              text-sm
              text-black/50
              outline-none
            '
          />
        </div>

        <p className='mt-1.5 text-[10px] text-black/30'>
          Phone number cannot be changed from here.
        </p>
      </div>

      {/* =================================================
          EMAIL
      ================================================= */}

      <div className='mb-6'>
        <label
          className='
            mb-2
            block
            text-xs
            font-medium
            text-black
          '
        >
          Email
        </label>

        <input
          type='email'
          value={email}
          disabled
          readOnly
          className='
            h-11
            w-full
            cursor-not-allowed
            rounded-xl
            border
            border-black/10
            bg-black/[0.03]
            px-3
            text-sm
            text-black/50
            outline-none
          '
        />

        <p className='mt-1.5 text-[10px] text-black/30'>
          Email cannot be changed from here.
        </p>
      </div>

      {/* =================================================
          ACTIONS
      ================================================= */}

      <div className='grid grid-cols-2 gap-3'>
        {/* CANCEL */}

        <button
          type='button'
          onClick={onClose}
          disabled={loading}
          className='
            flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-black/10
            bg-white
            text-sm
            font-medium
            text-black/60
            transition-all
            duration-200
            hover:bg-black/5
            hover:text-black
            disabled:cursor-not-allowed
            disabled:opacity-50
          '
        >
          <X size={16} />
          Cancel
        </button>

        {/* UPDATE */}

        <button
          type='submit'
          disabled={loading || !userId || !profileImage}
          className='
            flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-black
            text-sm
            font-semibold
            text-white
            transition-all
            duration-200
            hover:bg-black/80
            disabled:cursor-not-allowed
            disabled:opacity-50
          '
        >
          {loading ? (
            <>
              <span
                className='
                  h-4
                  w-4
                  animate-spin
                  rounded-full
                  border-2
                  border-white/30
                  border-t-white
                '
              />
              Updating...
            </>
          ) : (
            <>
              <Save size={16} />
              Update Image
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default UpdateAdminProfileModal
