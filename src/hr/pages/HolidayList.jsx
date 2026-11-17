
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CalendarDays,
  Search,
  RefreshCw,
  LoaderCircle,
  CalendarCheck,
  CalendarX,
  ChevronDown,
  Flag,
  Heart,
  Gift,
  Palette,
  PartyPopper,
  Lamp,
  Moon,
  Star,
  Church,
  Sun,
  Flower2,
  Music,
  Users,
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
    year: 'numeric',
  }).format(date)
}

const getDay = dateValue => {
  if (!dateValue) return '--'

  const dateString = String(dateValue).slice(0, 10)
  const date = new Date(`${dateString}T12:00:00`)

  if (Number.isNaN(date.getTime())) return '--'

  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
  }).format(date)
}

// ======================================================
// HOLIDAY ICON MAPPING
// ======================================================

const holidayIconMap = [
  {
    keywords: ['republic day', 'independence day', 'national day'],
    icon: Flag,
    style: 'bg-blue-50 text-blue-700',
  },
  {
    keywords: ['gandhi jayanti', 'peace'],
    icon: Heart,
    style: 'bg-gray-100 text-gray-700',
  },
  {
    keywords: ['christmas'],
    icon: Gift,
    style: 'bg-gray-100 text-gray-800',
  },
  {
    keywords: ['diwali', 'deepavali', 'dipawali'],
    icon: Lamp,
    style: 'bg-amber-50 text-amber-700',
  },
  {
    keywords: ['holi'],
    icon: Palette,
    style: 'bg-blue-50 text-blue-700',
  },
  {
    keywords: ['new year'],
    icon: PartyPopper,
    style: 'bg-gray-100 text-gray-800',
  },
  {
    keywords: ['eid', 'ramadan', 'bakrid', 'milad'],
    icon: Moon,
    style: 'bg-gray-100 text-gray-700',
  },
  {
    keywords: ['durga puja', 'dussehra', 'navratri'],
    icon: Flower2,
    style: 'bg-blue-50 text-blue-700',
  },
  {
    keywords: ['raksha bandhan', 'rakhi'],
    icon: Heart,
    style: 'bg-gray-100 text-gray-700',
  },
  {
    keywords: ['janmashtami'],
    icon: Star,
    style: 'bg-blue-50 text-blue-700',
  },
  {
    keywords: ['buddha purnima', 'buddha jayanti'],
    icon: Sun,
    style: 'bg-gray-100 text-gray-700',
  },
  {
    keywords: ['good friday', 'easter', 'christian'],
    icon: Church,
    style: 'bg-gray-100 text-gray-700',
  },
  {
    keywords: ['onam', 'pongal', 'makar sankranti', 'bihu'],
    icon: Flower2,
    style: 'bg-blue-50 text-blue-700',
  },
  {
    keywords: ['ambedkar jayanti'],
    icon: Users,
    style: 'bg-gray-100 text-gray-800',
  },
  {
    keywords: ['music', 'cultural'],
    icon: Music,
    style: 'bg-gray-100 text-gray-700',
  },
]

const getHolidayIcon = holiday => {
  const name = (
    holiday.name ||
    holiday.title ||
    ''
  ).toLowerCase()

  const matched = holidayIconMap.find(item =>
    item.keywords.some(keyword => name.includes(keyword))
  )

  return matched || {
    icon: CalendarDays,
    style: 'bg-gray-100 text-gray-700',
  }
}

// ======================================================
// MAIN COMPONENT
// ======================================================

const HolidayList = () => {
  const dispatch = useDispatch()

  const {
    holidays = [],
    loading = false,
    error = null,
  } = useSelector(state => state.holiday || {})

  const [search, setSearch] = useState('')
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  )

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

    return Array.from(
      { length: 5 },
      (_, index) => currentYear - 2 + index
    )
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
        timeZone: 'Asia/Kolkata',
      })
  ).length

  const pastHolidays = totalHolidays - upcomingHolidays

  // ======================================================
  // SUMMARY CARD DATA
  // ======================================================

  const summaryCards = [
    {
      title: 'Total Holidays',
      value: totalHolidays,
      description: 'Total scheduled holidays',
      icon: CalendarDays,
      iconStyle: 'bg-gray-200/20 text-gray-200',
      accent: 'bg-gray-500',
    },
    {
      title: 'Upcoming Holidays',
      value: upcomingHolidays,
      description: 'Holidays yet to come',
      icon: CalendarCheck,
      iconStyle: 'bg-blue-200/20 text-blue-700',
      accent: 'bg-blue-600',
    },
    {
      title: 'Completed Holidays',
      value: pastHolidays,
      description: 'Previously observed holidays',
      icon: CalendarX,
      iconStyle: 'bg-green-200/20 text-green-600',
      accent: 'bg-green-600',
    },
  ]

  // ======================================================
  // DECORATIVE CIRCLE COLORS
  // ======================================================

  const circleColors = [
    {
      first: 'bg-gray-400/50',
      second: 'bg-gray-300/50',
      third: 'bg-gray-500/60',
    },
    {
      first: 'bg-blue-400/60',
      second: 'bg-blue-300/50',
      third: 'bg-blue-500/60',
    },
    {
      first: 'bg-green-400/60',
      second: 'bg-green-300/50',
      third: 'bg-green-500/60',
    },
  ]

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="min-h-screen space-y-6 py-2 sm:py-4">

      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div className="flex items-center gap-3">

          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-950 sm:text-2xl">
              Holiday Management
            </h1>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              View and manage your organization's holidays.
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={fetchHolidays}
          disabled={loading}
          className="flex items-center justify-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white active:scale-95 disabled:opacity-50 sm:self-auto"
        >
          <RefreshCw
            size={16}
            className={loading ? 'animate-spin' : ''}
          />
          Refresh
        </button>

      </div>

      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        {summaryCards.map((card, index) => {
          const Icon = card.icon
          const dots = circleColors[index]

          return (
            <div
              key={card.title}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-200/60 sm:p-4"
            >

              {/* ORIGINAL BIG CIRCLE */}

              <div className="pointer-events-none absolute -right-8 -top-8 z-0 h-28 w-28 rounded-full border-[18px] border-gray-200/70 transition-transform duration-500 group-hover:scale-125" />

              {/* SMALL DECORATIVE CIRCLES */}

              <div className={`pointer-events-none absolute right-24 top-8 z-0 h-3 w-3 rounded-full ${dots.first}`} />

              <div className={`pointer-events-none absolute right-11 top-10 z-0 h-2 w-2 rounded-full ${dots.second}`} />

              <div className={`pointer-events-none absolute right-32 top-20 z-0 h-1.5 w-1.5 rounded-full ${dots.third}`} />

              {/* CARD CONTENT */}

              <div className="relative z-10">

                <div className="flex items-center justify-between">

                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconStyle} transition-all duration-300 group-hover:scale-105`}>
                    <Icon size={21} strokeWidth={1.8} />
                  </div>

                </div>

                <div className="mt-3 flex items-end justify-between">

                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {card.title}
                    </p>

                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
                      {card.value.toString().padStart(2, '0')}
                    </h2>
                  </div>

                  <span className="mb-1 text-xs font-medium text-gray-400">
                    {selectedYear}
                  </span>

                </div>

                <p className="mt-2 text-xs text-gray-500">
                  {card.description}
                </p>

                <div className="mt-3 h-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full w-1/4 rounded-full ${card.accent} transition-all duration-500 group-hover:w-1/2`}
                  />
                </div>

              </div>
            </div>
          )
        })}

      </div>

      {/* HOLIDAY LIST */}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* TABLE HEADER */}

        <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">

          <div>
            <h2 className="text-base font-bold text-gray-900">
              Holiday List
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              All scheduled holidays for the selected year.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">

            {/* SEARCH */}

            <div className="group relative">

              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-600"
              />

              <input
                type="text"
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search holidays..."
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-800 outline-none transition-all duration-300 placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 sm:w-56"
              />

            </div>

            {/* YEAR FILTER */}

            <div className="group relative">

              <select
                value={selectedYear}
                onChange={event => setSelectedYear(Number(event.target.value))}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-9 text-sm font-semibold text-gray-700 outline-none transition-all duration-300 hover:border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 sm:w-32"
              >
                {yearOptions.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

            </div>

          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="m-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
            {typeof error === 'string'
              ? error
              : 'Something went wrong while loading holidays.'}
          </div>
        )}

        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[750px] text-left">

            <thead className="bg-gray-50/80">
              <tr className="border-b border-gray-100">

                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  #
                </th>

                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Holiday Name
                </th>

                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Date
                </th>

                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Day
                </th>

                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Description
                </th>

                <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Status
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {/* LOADING */}

              {loading ? (

                <tr>
                  <td colSpan="7" className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-500">
                      <LoaderCircle
                        size={26}
                        className="animate-spin text-gray-900"
                      />

                      <p className="text-sm font-medium">
                        Loading holidays...
                      </p>
                    </div>
                  </td>
                </tr>

              ) : filteredHolidays.length === 0 ? (

                /* EMPTY STATE */

                <tr>
                  <td colSpan="7" className="px-5 py-16 text-center">

                    <div className="flex flex-col items-center gap-3">

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                        <CalendarDays size={28} strokeWidth={1.5} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          No holidays found
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          No holidays available for {selectedYear}.
                        </p>
                      </div>

                    </div>

                  </td>
                </tr>

              ) : (

                filteredHolidays.map((holiday, index) => {

                  const holidayDate = String(holiday.date || '').slice(0, 10)

                  const today = new Date().toLocaleDateString('en-CA', {
                    timeZone: 'Asia/Kolkata',
                  })

                  const isUpcoming = holidayDate >= today

                  const holidayIcon = getHolidayIcon(holiday)
                  const HolidayIcon = holidayIcon.icon

                  return (

                    <tr
                      key={holiday._id || holiday.id || index}
                      className="group transition-colors duration-200 hover:bg-gray-50"
                    >

                      {/* NUMBER */}

                      <td className="px-5 py-4 text-sm text-gray-400">
                        {String(index + 1).padStart(2, '0')}
                      </td>

                      {/* HOLIDAY NAME + DYNAMIC ICON */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${holidayIcon.style} transition-all duration-300 group-hover:scale-110`}
                          >
                            <HolidayIcon size={19} strokeWidth={1.8} />
                          </div>

                          <p className="text-sm font-semibold text-gray-800 transition-colors group-hover:text-black">
                            {holiday.name || holiday.title || '--'}
                          </p>

                        </div>

                      </td>

                      {/* DATE */}

                      <td className="px-5 py-4 text-sm font-medium text-gray-700">
                        {formatDate(holiday.date)}
                      </td>

                      {/* DAY */}

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {getDay(holiday.date)}
                      </td>

                      {/* DESCRIPTION */}

                      <td className="max-w-xs px-5 py-4 text-sm text-gray-500">
                        <p className="line-clamp-2">
                          {holiday.description || '--'}
                        </p>
                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                            isUpcoming
                              ? 'border border-blue-100 bg-blue-50 text-blue-700'
                              : 'border border-gray-200 bg-gray-100 text-gray-600'
                          }`}
                        >

                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isUpcoming
                                ? 'bg-blue-600'
                                : 'bg-gray-400'
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

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/50 px-5 py-4">

            <p className="text-xs text-gray-500">
              Showing{' '}
              <span className="font-semibold text-gray-900">
                {filteredHolidays.length}
              </span>{' '}
              holidays
            </p>

            <p className="text-xs font-semibold text-gray-500">
              Year:{' '}
              <span className="text-gray-900">
                {selectedYear}
              </span>
            </p>

          </div>
        )}

      </section>

    </div>
  )
}

export default HolidayList
