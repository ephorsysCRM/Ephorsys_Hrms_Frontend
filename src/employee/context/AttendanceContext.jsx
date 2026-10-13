
import { createContext, useContext, useState, useEffect } from 'react'

const AttendanceContext = createContext()

export const AttendanceProvider = ({ children }) => {
  const [checkIn, setCheckIn] = useState(null)
  const [checkOut, setCheckOut] = useState(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    if (!checkIn || checkOut) return

    const updateTimer = () => {
      const seconds = Math.floor(
        (Date.now() - new Date(checkIn).getTime()) / 1000
      )

      setElapsedSeconds(Math.max(0, seconds))
    }

    updateTimer()

    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [checkIn, checkOut])

 const startAttendance = (time = new Date()) => {
  const selectedTime = new Date(time)

  if (
    Number.isNaN(selectedTime.getTime()) ||
    selectedTime.getTime() > Date.now()
  ) {
    return false
  }

  setCheckIn(selectedTime.toISOString())
  setCheckOut(null)

  return true
}

  const stopAttendance = () => {
    if (!checkIn) return

    setCheckOut(new Date().toISOString())
  }

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return [hours, minutes, seconds]
      .map(value => String(value).padStart(2, '0'))
      .join(':')
  }

  return (
    <AttendanceContext.Provider
      value={{
        checkIn,
        checkOut,
        elapsedSeconds,
        formattedTime: formatTime(elapsedSeconds),
        startAttendance,
        stopAttendance
      }}
    >
      {children}
    </AttendanceContext.Provider>
  )
}

export const useAttendance = () => {
  return useContext(AttendanceContext)
}
