import React from 'react'
import {
  CalendarCheck,
  CalendarOff,
  LogIn,
  Clock3,
  LoaderCircle
} from 'lucide-react'

const formatDate = value => {
  if (!value) return '--'

  const dateString = String(value).slice(0, 10)

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata'
  }).format(new Date(`${dateString}T12:00:00+05:30`))
}

const formatTime = value => {
  if (!value) return '--'

  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  }).format(new Date(value))
}

const formatDuration = minutes => {
  const total = Math.max(0, Math.round(Number(minutes) || 0))

  return `${Math.floor(total / 60)}h ${total % 60}m`
}

const getRecordTimes = record => {
  const halves = [record?.firstHalf, record?.secondHalf]

  const checkIns = halves
    .map(half => half?.checkIn?.time)
    .filter(Boolean)
    .sort((a, b) => new Date(a) - new Date(b))

  const checkOuts = halves
    .map(half => half?.checkOut?.time)
    .filter(Boolean)
    .sort((a, b) => new Date(a) - new Date(b))

  return {
    checkIn: checkIns[0] || null,
    checkOut: checkOuts.at(-1) || null
  }
}

const getRecordMinutes = record =>
  Math.max(
    0,
    Number(record?.totalWorkDuration || 0) ||
      Number(record?.creditedDuration || 0)
  )

const getStatus = record => {
  const status = String(record?.status || 'pending').toLowerCase()

  const labels = {
    present: 'Present',
    absent: 'Absent',
    leave: 'On Leave',
    half_day: 'Half Day',
    holiday: 'Holiday',
    weekly_off: 'Weekly Off',
    pending: 'Pending'
  }

  return labels[status] || status.replaceAll('_', ' ')
}

const statusClasses = {
  Present: 'bg-emerald-50 text-emerald-700',
  'Half Day': 'bg-amber-50 text-amber-700',
  Absent: 'bg-red-50 text-red-700',
  'On Leave': 'bg-blue-50 text-blue-700',
  Pending: 'bg-amber-50 text-amber-700',
  Holiday: 'bg-purple-50 text-purple-700',
  'Weekly Off': 'bg-gray-100 text-gray-600'
}

const SummaryItem = ({ icon: Icon, label, value }) => (
  <div className='rounded-xl border border-gray-100 bg-gray-50 p-3'>
    <div className='flex items-center gap-1.5 text-gray-500'>
      <Icon size={15} />
      <span className='text-xs'>{label}</span>
    </div>

    <p className='mt-2 break-words text-lg font-semibold text-gray-900'>
      {value}
    </p>
  </div>
)

const AttendanceHistoryModal = ({ month, records = [], summary, error }) => {
  const sortedRecords = [...records].sort((a, b) =>
    String(b.date).localeCompare(String(a.date))
  )

  return (
    <div className='space-y-5'>
      <div>
        <h3 className='text-lg font-semibold text-gray-900'>
          {month} Attendance
        </h3>

        <p className='mt-1 text-sm text-gray-500'>
          Daily attendance records and working hours.
        </p>
      </div>

      {error ? (
        <div className='rounded-xl bg-red-50 p-4 text-sm text-red-700'>
          {error}
        </div>
      ) : (
        <>
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
            <SummaryItem
              icon={CalendarCheck}
              label='Present'
              value={summary?.present ?? 0}
            />

            <SummaryItem
              icon={CalendarOff}
              label='Absent'
              value={summary?.absent ?? 0}
            />

            <SummaryItem
              icon={LogIn}
              label='Avg. Check-in'
              value={summary?.checkIn ?? '--'}
            />

            <SummaryItem
              icon={Clock3}
              label='Total Work'
              value={summary?.hours ?? '0h 0m'}
            />
          </div>

          <div className='overflow-x-auto rounded-xl border border-gray-200'>
            <table className='w-full min-w-[650px] text-left text-sm'>
              <thead className='bg-gray-50 text-xs text-gray-500'>
                <tr>
                  <th className='px-4 py-3 font-medium'>Date</th>
                  <th className='px-4 py-3 font-medium'>Check-in</th>
                  <th className='px-4 py-3 font-medium'>Check-out</th>
                  <th className='px-4 py-3 font-medium'>Work Duration</th>
                  <th className='px-4 py-3 font-medium'>Status</th>
                </tr>
              </thead>

              <tbody className='divide-y divide-gray-100'>
                {sortedRecords.map(record => {
                  const times = getRecordTimes(record)

                  const isOpen = [record?.firstHalf, record?.secondHalf].some(
                    half => half?.checkIn?.time && !half?.checkOut?.time
                  )

                  const status = getStatus(record)

                  return (
                    <tr
                      key={record._id || record.date}
                      className='transition hover:bg-gray-50'
                    >
                      <td className='whitespace-nowrap px-4 py-3 text-gray-800'>
                        {formatDate(record.date)}
                      </td>

                      <td className='whitespace-nowrap px-4 py-3 text-gray-600'>
                        {formatTime(times.checkIn)}
                      </td>

                      <td className='whitespace-nowrap px-4 py-3 text-gray-600'>
                        {times.checkOut ? formatTime(times.checkOut) : '--'}
                      </td>

                      <td className='whitespace-nowrap px-4 py-3 text-gray-600'>
                        {isOpen
                          ? 'In progress'
                          : formatDuration(getRecordMinutes(record))}
                      </td>

                      <td className='whitespace-nowrap px-4 py-3'>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            statusClasses[status] || 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  )
                })}

                {!sortedRecords.length && (
                  <tr>
                    <td
                      colSpan={5}
                      className='px-4 py-8 text-center text-sm text-gray-500'
                    >
                      No attendance records found for this month.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default AttendanceHistoryModal
