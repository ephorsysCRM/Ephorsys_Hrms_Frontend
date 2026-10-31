import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  ChevronsRight,
  ChevronsLeft,
  CheckCircle2,
  LoaderCircle,
  MapPin,
  AlertCircle,
  Clock,
  X
} from 'lucide-react'

import {
  checkIn as checkInThunk,
  checkOut as checkOutThunk,
  getMyAttendance
} from '../../../Redux/features/attendance/attendanceThunk'

const KNOB = 48 // knob size in px
const PADDING = 4 // gap between knob and track edge
const COMPLETE_AT = 0.8 // swipe distance needed to confirm

// Today's date in Indian timezone (YYYY-MM-DD)
const getTodayDate = () => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date())

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  )

  return `${values.year}-${values.month}-${values.day}`
}

// "9:12 AM" in Indian timezone
const formatClock = timestamp =>
  new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(new Date(timestamp))

// Employee's current GPS location
const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('This browser does not support location access.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        resolve({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy
        })
      },
      error => {
        const message =
          error.code === 1
            ? 'Location access is blocked. Allow it in your browser settings, then try again.'
            : error.code === 2
            ? "We couldn't find your location. Check that GPS is on and try again."
            : 'Finding your location took too long. Try again.'

        reject(new Error(message))
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    )
  })

const MINIMIZED_KEY = 'attendanceWidgetMinimized'

const readMinimized = () => {
  try {
    return sessionStorage.getItem(MINIMIZED_KEY) === '1'
  } catch {
    return false
  }
}

const vibrate = pattern => {
  try {
    navigator.vibrate?.(pattern)
  } catch {
    /* not supported */
  }
}

const AttendanceTimer = () => {
  const dispatch = useDispatch()

  const { attendance = [], loading = {} } = useSelector(
    state => state.attendance || {}
  )

  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [actionError, setActionError] = useState('')
  const [step, setStep] = useState('idle') // idle | locating | saving
  const [justDone, setJustDone] = useState('') // '', 'in', 'out'
  const [isMinimized, setIsMinimized] = useState(readMinimized)

  const trackRef = useRef(null)
  const startXRef = useRef(0)
  const dragXRef = useRef(0)
  const maxDragRef = useRef(0)
  const pointerIdRef = useRef(null)
  const actionInProgressRef = useRef(false)

  const today = getTodayDate()

  const isBusy = step !== 'idle' || Boolean(loading.checkIn || loading.checkOut)

  const fetchToday = () =>
    dispatch(
      getMyAttendance({ startDate: today, endDate: today, page: 1, limit: 10 })
    )

  // Fetch today's attendance
  useEffect(() => {
    fetchToday()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, today])

  // Tick every second
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Hide the success message after a moment
  useEffect(() => {
    if (!justDone) return
    const timeout = setTimeout(() => setJustDone(''), 2500)
    return () => clearTimeout(timeout)
  }, [justDone])

  // Today's attendance record
  const todayAttendance = attendance.find(
    item => item.date?.slice(0, 10) === today
  )

  const firstHalf = todayAttendance?.firstHalf
  const secondHalf = todayAttendance?.secondHalf

  const isHalfOpen = half =>
    Boolean(half?.checkIn?.time && !half?.checkOut?.time)
  const isHalfFinished = half =>
    Boolean(half?.checkIn?.time && half?.checkOut?.time)

  const openHalf = isHalfOpen(secondHalf)
    ? secondHalf
    : isHalfOpen(firstHalf)
    ? firstHalf
    : null

  const isCheckedIn = Boolean(openHalf)
  const isCompleted = isHalfFinished(firstHalf) && isHalfFinished(secondHalf)

  // Elapsed time of the active session
  const checkInTimestamp = openHalf?.checkIn?.time
    ? new Date(openHalf.checkIn.time).getTime()
    : null

  const elapsedSeconds = checkInTimestamp
    ? Math.max(0, Math.floor((currentTime - checkInTimestamp) / 1000))
    : 0

  const formattedTime = [
    Math.floor(elapsedSeconds / 3600),
    Math.floor((elapsedSeconds % 3600) / 60),
    elapsedSeconds % 60
  ]
    .map(value => String(value).padStart(2, '0'))
    .join(':')

  // Check-in / check-out
  const handleAttendanceAction = async () => {
    if (actionInProgressRef.current || isBusy || isCompleted) return

    const wasCheckedIn = isCheckedIn

    actionInProgressRef.current = true
    setActionError('')
    setStep('locating')

    try {
      const location = await getCurrentLocation()

      setStep('saving')

      if (wasCheckedIn) {
        await dispatch(checkOutThunk(location)).unwrap()
      } else {
        await dispatch(
          checkInThunk({ ...location, workMode: 'office' })
        ).unwrap()
      }

      await fetchToday().unwrap()

      vibrate(40)
      setJustDone(wasCheckedIn ? 'out' : 'in')
    } catch (err) {
      vibrate([60, 40, 60])
      setActionError(
        typeof err === 'string'
          ? err
          : err?.message || 'Something went wrong. Please try again.'
      )
    } finally {
      setStep('idle')
      actionInProgressRef.current = false
    }
  }

  // Swipe handling
  const handlePointerDown = event => {
    if (isCompleted || isBusy || pointerIdRef.current !== null) return

    const track = trackRef.current
    if (!track) return

    const rect = track.getBoundingClientRect()

    const onKnob = isCheckedIn
      ? event.clientX >= rect.right - KNOB - PADDING * 2
      : event.clientX <= rect.left + KNOB + PADDING * 2

    if (!onKnob) return

    event.preventDefault()

    pointerIdRef.current = event.pointerId
    startXRef.current = event.clientX
    dragXRef.current = 0
    maxDragRef.current = Math.max(0, rect.width - KNOB - PADDING * 2)

    track.setPointerCapture(event.pointerId)
    setActionError('')
    setIsDragging(true)
  }

  const handlePointerMove = event => {
    if (pointerIdRef.current !== event.pointerId) return

    const movement = event.clientX - startXRef.current
    const distance = isCheckedIn ? -movement : movement
    const nextX = Math.max(0, Math.min(maxDragRef.current, distance))

    // Small buzz the moment the swipe becomes "enough"
    const wasReady = dragXRef.current >= maxDragRef.current * COMPLETE_AT
    const isReady = nextX >= maxDragRef.current * COMPLETE_AT
    if (isReady && !wasReady) vibrate(15)

    dragXRef.current = nextX
    setDragX(nextX)
  }

  const resetSwipe = () => {
    pointerIdRef.current = null
    dragXRef.current = 0
    setDragX(0)
    setIsDragging(false)
  }

  const handlePointerUp = event => {
    if (pointerIdRef.current !== event.pointerId) return

    const completed =
      maxDragRef.current > 0 &&
      dragXRef.current >= maxDragRef.current * COMPLETE_AT

    resetSwipe()

    if (completed) handleAttendanceAction()
  }

  const handlePointerCancel = event => {
    if (pointerIdRef.current !== event.pointerId) return
    resetSwipe()
  }

  // Keyboard fallback for accessibility
  const handleKeyDown = event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleAttendanceAction()
    }
  }

  const toggleMinimized = value => {
    setIsMinimized(value)
    try {
      sessionStorage.setItem(MINIMIZED_KEY, value ? '1' : '0')
    } catch {
      /* ignore */
    }
  }

  // Derived UI values
  const progress = maxDragRef.current
    ? Math.min(1, dragX / maxDragRef.current)
    : 0

  const sessionLabel = isHalfOpen(secondHalf)
    ? 'Second session'
    : isHalfOpen(firstHalf)
    ? 'First session'
    : ''

  const status = isCompleted
    ? { dot: 'bg-emerald-500', text: "You're done for today" }
    : isCheckedIn
    ? { dot: 'bg-emerald-500 animate-pulse', text: 'You are checked in' }
    : { dot: 'bg-gray-300', text: 'Not checked in yet' }

  const busyLabel =
    step === 'locating'
      ? 'Finding your location…'
      : step === 'saving'
      ? isCheckedIn
        ? 'Checking you out…'
        : 'Checking you in…'
      : ''

  const trackTone = isCheckedIn
    ? 'bg-rose-50 border-rose-200'
    : isCompleted
    ? 'bg-emerald-50 border-emerald-200'
    : 'bg-gray-900 border-gray-900'

  const labelTone = isCheckedIn
    ? 'text-rose-700'
    : isCompleted
    ? 'text-emerald-700'
    : 'text-gray-100'

  // Minimized: small button that shows only the timer
  if (isMinimized) {
    return (
      <button
        type='button'
        onClick={() => toggleMinimized(false)}
        aria-label='Open attendance'
        className={`fixed bottom-3 right-3 z-50 flex h-12 items-center gap-2 rounded-full px-4 text-sm font-semibold text-white shadow-lg outline-none transition-transform hover:scale-105 focus-visible:ring-4 sm:bottom-5 sm:right-5 ${
          isCheckedIn
            ? 'bg-rose-600 shadow-rose-500/40 focus-visible:ring-rose-300'
            : isCompleted
            ? 'bg-emerald-600 shadow-emerald-500/40 focus-visible:ring-emerald-300'
            : 'bg-gray-900 shadow-gray-900/30 focus-visible:ring-gray-400'
        }`}
      >
        {isCheckedIn ? (
          <>
            <span className='h-2 w-2 animate-pulse rounded-full bg-white' />
            <span className='font-mono tabular-nums'>{formattedTime}</span>
          </>
        ) : isCompleted ? (
          <>
            <CheckCircle2 size={18} />
            <span>Done</span>
          </>
        ) : (
          <>
            <Clock size={18} />
            <span>Check in</span>
          </>
        )}
      </button>
    )
  }

  return (
    <div className='fixed bottom-3 left-3 right-3 z-50 sm:bottom-5 sm:left-auto sm:right-5 sm:w-90'>
      <div className='rounded-3xl border border-gray-200 bg-white p-3 shadow-xl shadow-gray-900/10'>
        {/* Status + timer */}
        <div className='flex items-center justify-between px-2 pb-3 pt-1'>
          <div className='min-w-0'>
            <div className='flex items-center gap-2'>
              <span className={`h-2 w-2 rounded-full ${status.dot}`} />
              <p className='truncate text-sm font-semibold text-gray-900'>
                {justDone === 'in'
                  ? 'Checked in. Have a great day!'
                  : justDone === 'out'
                  ? 'Checked out. See you soon!'
                  : status.text}
              </p>
            </div>

            <p className='mt-0.5 pl-4 text-xs text-gray-500'>
              {isCheckedIn && checkInTimestamp
                ? `${sessionLabel} · since ${formatClock(checkInTimestamp)}`
                : isCompleted
                ? 'Both sessions are recorded'
                : 'Swipe to start your day'}
            </p>
          </div>

          <div className='ml-3 flex shrink-0 items-center gap-2'>
            {isCheckedIn && (
              <div className='rounded-xl bg-gray-900 px-3 py-1.5 font-mono text-sm font-semibold tabular-nums text-white'>
                {formattedTime}
              </div>
            )}

            <button
              type='button'
              onClick={() => toggleMinimized(true)}
              aria-label='Minimize attendance'
              className='rounded-full p-1.5 text-gray-400 outline-none transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-gray-300'
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Swipe track */}
        <div
          ref={trackRef}
          role='button'
          tabIndex={isCompleted || isBusy ? -1 : 0}
          aria-disabled={isCompleted || isBusy}
          aria-label={isCheckedIn ? 'Check out' : 'Check in'}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          className={`relative h-14 select-none overflow-hidden rounded-full border outline-none transition-colors duration-300 focus-visible:ring-4 focus-visible:ring-emerald-300 ${trackTone} ${
            isBusy || isCompleted
              ? 'cursor-not-allowed'
              : 'cursor-grab active:cursor-grabbing'
          }`}
          style={{ touchAction: 'none' }}
        >
          {/* Fill that follows the knob */}
          <div
            className={`absolute inset-y-0 ${
              isCheckedIn ? 'right-0 bg-rose-500' : 'left-0 bg-emerald-500'
            }`}
            style={{
              width: `${KNOB + PADDING * 2 + dragX}px`,
              opacity: isDragging ? 0.25 + progress * 0.75 : 0,
              transition: isDragging ? 'none' : 'opacity 200ms ease'
            }}
          />

          {/* Label */}
          <div
            className={`pointer-events-none absolute inset-0 flex items-center justify-center gap-2 px-16 text-sm font-medium ${labelTone}`}
            style={{
              opacity: isDragging ? Math.max(0, 1 - progress * 1.4) : 1
            }}
          >
            {isBusy ? (
              <>
                <LoaderCircle size={16} className='animate-spin' />
                <span>{busyLabel || 'Please wait…'}</span>
              </>
            ) : isCompleted ? (
              <>
                <CheckCircle2 size={18} />
                <span>Attendance completed</span>
              </>
            ) : isCheckedIn ? (
              <span>Swipe left to check out</span>
            ) : (
              <span>Swipe right to check in</span>
            )}
          </div>

          {/* Knob */}
          {!isCompleted && (
            <div
              className={`pointer-events-none absolute flex items-center justify-center rounded-full shadow-md ${
                isCheckedIn
                  ? 'bg-rose-500 text-white'
                  : 'bg-white text-gray-900'
              }`}
              style={{
                top: PADDING,
                width: KNOB,
                height: KNOB,
                left: isCheckedIn ? 'auto' : PADDING,
                right: isCheckedIn ? PADDING : 'auto',
                transform: `translateX(${
                  isCheckedIn ? -dragX : dragX
                }px) scale(${isDragging ? 1.06 : 1})`,
                transition: isDragging ? 'none' : 'transform 220ms ease'
              }}
            >
              {isBusy ? (
                <LoaderCircle size={20} className='animate-spin' />
              ) : isCheckedIn ? (
                <ChevronsLeft size={22} />
              ) : (
                <ChevronsRight size={22} />
              )}
            </div>
          )}
        </div>

        {/* Helper text */}
        {!actionError && !isCompleted && (
          <p className='mt-2 flex items-center justify-center gap-1 text-[11px] text-gray-400'>
            <MapPin size={12} />
            Your location is used to verify{' '}
            {isCheckedIn ? 'check out' : 'check in'}
          </p>
        )}

        {/* Error message */}
        {actionError && (
          <div
            role='alert'
            className='mt-2 flex items-start gap-2 rounded-2xl bg-red-50 px-3 py-2.5 text-xs text-red-700'
          >
            <AlertCircle size={16} className='mt-px shrink-0' />
            <p className='flex-1 leading-relaxed'>{actionError}</p>
            <button
              type='button'
              onClick={() => setActionError('')}
              aria-label='Dismiss message'
              className='shrink-0 rounded-full p-0.5 text-red-500 hover:bg-red-100'
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AttendanceTimer
