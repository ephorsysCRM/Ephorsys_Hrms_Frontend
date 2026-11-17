import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CalendarDays,
  Search,
  RefreshCw,
  LoaderCircle,
  CalendarCheck,
  CalendarX,
  ChevronDown
} from 'lucide-react'

import { getAllHolidays } from '../../redux/features/holiday/holidayThunk'

// ======================================================
// HELPERS
// ======================================================

const formatDate = dateValue => {
  if (!dateValue) return '--'

  const dateString = String(dateValue).slice(0, 10)

  const date = new Date(`${dateString}T12:00:00`)

  if (Number.isNaN(date.getTime())) return '--'

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

const getDay = dateValue => {
  if (!dateValue) return '--'

  const dateString = String(dateValue).slice(0, 10)
  const date = new Date(`${dateString}T12:00:00`)

  if (Number.isNaN(date.getTime())) return '--'

  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long'
  }).format(date)
}

// ======================================================
// MAIN COMPONENT
// ======================================================

const Holidays = () => {
  const dispatch = useDispatch()

  const {
    holidays = [],
    loading = false,
    error = null
  } = useSelector(state => state.holiday || {})

  const [search, setSearch] = useState('')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // ======================================================
  // FETCH HOLIDAYS
  // ======================================================

  const fetchHolidays = () => {
    dispatch(getAllHolidays(selectedYear, 1, 100))
  }

  useEffect(() => {
    fetchHolidays()
  }, [dispatch, selectedYear])

  // ======================================================
  // YEAR OPTIONS
  // ======================================================

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear()

    return Array.from({ length: 5 }, (_, index) => currentYear - 2 + index)
  }, [])

  // ======================================================
  // FILTER HOLIDAYS
  // ======================================================

  const filteredHolidays = useMemo(() => {
    const query = search.trim().toLowerCase()

    return [...holidays]
      .filter(holiday => holiday.isActive !== false)
      .filter(holiday => {
        const name = holiday.name || holiday.title || ''
        const description = holiday.description || ''
        const type = holiday.type || holiday.holidayType || ''

        return (
          !query ||
          name.toLowerCase().includes(query) ||
          description.toLowerCase().includes(query) ||
          type.toLowerCase().includes(query)
        )
      })
      .sort((a, b) => {
        return new Date(a.date) - new Date(b.date)
      })
  }, [holidays, search])

  // ======================================================
  // SUMMARY
  // ======================================================

  const totalHolidays = filteredHolidays.length

  const upcomingHolidays = filteredHolidays.filter(
    holiday =>
      String(holiday.date).slice(0, 10) >=
      new Date().toLocaleDateString('en-CA', {
        timeZone: 'Asia/Kolkata'
      })
  ).length

  const pastHolidays = totalHolidays - upcomingHolidays

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className='min-h-screen space-y-6 py-2 sm:py-4'>
      {/* HEADER */}
      <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <div className='flex items-center gap-2'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#104a17]/10 text-[#104a17]'>
              <CalendarDays size={21} />
            </div>

            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                Holiday Management
              </h1>

              <p className='mt-0.5 text-sm text-gray-500'>
                View and manage your organization's holidays.
              </p>
            </div>
          </div>
        </div>

        <button
          type='button'
          onClick={fetchHolidays}
          disabled={loading}
          className='flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50'
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        <div className='rounded-2xl border border-gray-200 bg-white p-5'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-500'>Total Holidays</p>
              <h2 className='mt-2 text-2xl font-bold text-gray-900'>
                {totalHolidays}
              </h2>
            </div>

            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-[#104a17]/10 text-[#104a17]'>
              <CalendarDays size={21} />
            </div>
          </div>
        </div>

        <div className='rounded-2xl border border-gray-200 bg-white p-5'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-500'>Upcoming Holidays</p>
              <h2 className='mt-2 text-2xl font-bold text-blue-600'>
                {upcomingHolidays}
              </h2>
            </div>

            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600'>
              <CalendarCheck size={21} />
            </div>
          </div>
        </div>

        <div className='rounded-2xl border border-gray-200 bg-white p-5'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-500'>Completed Holidays</p>
              <h2 className='mt-2 text-2xl font-bold text-gray-700'>
                {pastHolidays}
              </h2>
            </div>

            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-600'>
              <CalendarX size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <section className='overflow-hidden rounded-2xl border border-gray-200 bg-white'>
        {/* TABLE HEADER */}
        <div className='flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5'>
          <div>
            <h2 className='font-semibold text-gray-900'>Holiday List</h2>

            <p className='mt-1 text-xs text-gray-500'>
              All scheduled holidays for the selected year.
            </p>
          </div>

          <div className='flex flex-col gap-2 sm:flex-row'>
            {/* SEARCH */}
            <div className='relative'>
              <Search
                size={16}
                className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
              />

              <input
                type='text'
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder='Search holidays...'
                className='w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#104a17] sm:w-56'
              />
            </div>

            {/* YEAR FILTER */}
            <div className='relative'>
              <select
                value={selectedYear}
                onChange={event => setSelectedYear(Number(event.target.value))}
                className='w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-9 text-sm font-medium text-gray-700 outline-none focus:border-[#104a17] sm:w-32'
              >
                {yearOptions.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={15}
                className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
              />
            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className='m-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700'>
            {typeof error === 'string'
              ? error
              : 'Something went wrong while loading holidays.'}
          </div>
        )}

        {/* TABLE */}
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[750px] text-left'>
            <thead className='bg-gray-50'>
              <tr className='border-b border-gray-100'>
                <th className='px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500'>
                  #
                </th>

                <th className='px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500'>
                  Holiday Name
                </th>

                <th className='px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500'>
                  Date
                </th>

                <th className='px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500'>
                  Day
                </th>

                <th className='px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500'>
                  Description
                </th>

                <th className='px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500'>
                  Status
                </th>
              </tr>
            </thead>

            <tbody className='divide-y divide-gray-100'>
              {loading ? (
                <tr>
                  <td colSpan='7' className='px-5 py-16 text-center'>
                    <div className='flex flex-col items-center gap-3 text-gray-500'>
                      <LoaderCircle
                        size={25}
                        className='animate-spin text-[#104a17]'
                      />

                      <p className='text-sm'>Loading holidays...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredHolidays.length === 0 ? (
                <tr>
                  <td colSpan='7' className='px-5 py-16 text-center'>
                    <div className='flex flex-col items-center gap-2 text-gray-400'>
                      <CalendarDays size={35} />

                      <p className='text-sm font-medium text-gray-600'>
                        No holidays found
                      </p>

                      <p className='text-xs'>
                        No holidays available for {selectedYear}.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredHolidays.map((holiday, index) => {
                  const holidayDate = String(holiday.date || '').slice(0, 10)

                  const today = new Date().toLocaleDateString('en-CA', {
                    timeZone: 'Asia/Kolkata'
                  })

                  const isUpcoming = holidayDate >= today

                  return (
                    <tr
                      key={holiday._id || holiday.id || index}
                      className='transition hover:bg-gray-50/80'
                    >
                      <td className='px-5 py-4 text-sm text-gray-400'>
                        {index + 1}
                      </td>

                      <td className='px-5 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#104a17]/10 text-[#104a17]'>
                            <CalendarDays size={17} />
                          </div>

                          <div>
                            <p className='text-sm font-semibold text-gray-900'>
                              {holiday.name || holiday.title || '--'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className='px-5 py-4 text-sm font-medium text-gray-700'>
                        {formatDate(holiday.date)}
                      </td>

                      <td className='px-5 py-4 text-sm text-gray-600'>
                        {getDay(holiday.date)}
                      </td>

                      <td className='max-w-xs px-5 py-4 text-sm text-gray-500'>
                        <p className='line-clamp-2'>
                          {holiday.description || '--'}
                        </p>
                      </td>

                      <td className='px-5 py-4'>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                            isUpcoming
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isUpcoming ? 'bg-blue-500' : 'bg-gray-400'
                            }`}
                          />

                          {isUpcoming ? 'Upcoming' : 'Completed'}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        {!loading && filteredHolidays.length > 0 && (
          <div className='flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 px-5 py-4'>
            <p className='text-xs text-gray-500'>
              Showing {filteredHolidays.length} holidays
            </p>

            <p className='text-xs font-medium text-gray-500'>
              Year: {selectedYear}
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

export default Holidays
