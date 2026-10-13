import { useRef, useState } from 'react'
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2
} from 'lucide-react'

import { useAttendance } from '../../context/AttendanceContext'

const AttendanceTimer = () => {
  const {
    checkIn,
    checkOut,
    formattedTime,
    startAttendance,
    stopAttendance
  } = useAttendance()

  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const trackRef = useRef(null)
  const startXRef = useRef(0)
  const dragXRef = useRef(0)
  const pointerIdRef = useRef(null)

  const isCheckedIn = Boolean(checkIn && !checkOut)
  const isCompleted = Boolean(checkIn && checkOut)

  const handlePointerDown = e => {
    if (isCompleted || pointerIdRef.current !== null) return

    const track = trackRef.current
    if (!track) return

    const rect = track.getBoundingClientRect()
    const knobWidth = 48

    // Start Check In from the left handle.
    // Start Check Out from the right handle.
    const handleStart = isCheckedIn
      ? e.clientX >= rect.right - knobWidth - 8
      : e.clientX <= rect.left + knobWidth + 8

    if (!handleStart) return

    e.preventDefault()

    pointerIdRef.current = e.pointerId
    startXRef.current = e.clientX
    dragXRef.current = 0

    track.setPointerCapture(e.pointerId)
    setIsDragging(true)
  }

  const handlePointerMove = e => {
    if (
      pointerIdRef.current !== e.pointerId ||
      !trackRef.current
    ) {
      return
    }

    const width = trackRef.current.getBoundingClientRect().width
    const maxDrag = Math.max(0, width - 56)

    const movement = e.clientX - startXRef.current

    // Check In moves right; Check Out moves left.
    const distance = isCheckedIn ? -movement : movement

    const nextX = Math.max(0, Math.min(maxDrag, distance))

    dragXRef.current = nextX
    setDragX(nextX)
  }

  const resetSwipe = () => {
    pointerIdRef.current = null
    dragXRef.current = 0
    setDragX(0)
    setIsDragging(false)
  }

  const handlePointerUp = e => {
    if (pointerIdRef.current !== e.pointerId) return

    const width =
      trackRef.current?.getBoundingClientRect().width || 0

    const maxDrag = Math.max(0, width - 56)
    const completedSwipe =
      maxDrag > 0 && dragXRef.current >= maxDrag * 0.8

    resetSwipe()

    if (!completedSwipe) return

    if (isCheckedIn) {
      stopAttendance()
    } else {
      startAttendance(new Date())
    }
  }

  const handlePointerCancel = e => {
    if (pointerIdRef.current !== e.pointerId) return
    resetSwipe()
  }

  const knobPosition = isCheckedIn
    ? Math.max(0, (trackRef.current?.getBoundingClientRect().width || 56) - 56 - dragX)
    : dragX

  return (
    <div className='fixed bottom-3 left-3 right-3 z-50 sm:bottom-5 sm:left-auto sm:right-5 sm:w-[320px]'>
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className={`relative h-14 select-none overflow-hidden rounded-full border ${
          isCheckedIn
            ? 'border-red-200 bg-red-50 shadow-md shadow-red-400'
            : isCompleted
              ? 'border-gray-800 bg-black'
              : 'border-gray-800 bg-black'
        }`}
        style={{ touchAction: 'none' }}
      >
        {/* Swipe progress */}
        <div
          className={`absolute inset-y-0 ${
            isCheckedIn ? 'right-0' : 'left-0'
          } ${
            isCheckedIn ? 'bg-red-600' : 'bg-black'
          }`}
          style={{
            width: `${Math.min(
              100,
              ((dragX + 48) /
                Math.max(
                  48,
                  (trackRef.current?.getBoundingClientRect().width || 320) - 8
                )) *
                100
            )}%`,
            opacity: isDragging ? 0.12 : 0
          }}
        />

        {/* Text and timer inside the same button */}
        <div
          className={`pointer-events-none absolute inset-0 flex items-center justify-center gap-2 px-14 text-xs font-semibold ${
            isCheckedIn
              ? 'text-red-700'
              : isCompleted
                ? 'text-gray-200'
                : 'text-gray-200'
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 size={16} />
              <span>Completed · {formattedTime}</span>
            </>
          ) : isCheckedIn ? (
            <span className='whitespace-nowrap'>
              {formattedTime} · Swipe left to check out
            </span>
          ) : (
            <span>Swipe right to check in</span>
          )}
        </div>

        {/* Draggable handle */}
        {!isCompleted && (
          <div
            className={`pointer-events-none absolute top-1 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-sm ${
              isCheckedIn ? 'bg-red-600' : 'bg-white'
            }`}
            style={{
              left: isCheckedIn ? 'auto' : '4px',
              right: isCheckedIn ? '4px' : 'auto',
              transform: `translateX(${
                isCheckedIn ? -dragX : dragX
              }px)`,
              transition: isDragging
                ? 'none'
                : 'transform 200ms ease'
            }}
          >
            {isCheckedIn ? (
              <ChevronLeft size={23}  />
            ) : (
              <ChevronRight size={23} className='text-black' />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AttendanceTimer
