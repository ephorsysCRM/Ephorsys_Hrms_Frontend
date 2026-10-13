import { useMemo, useState } from 'react'
import {
  Megaphone,
  Search,
  CalendarDays,
  Clock3,
  ChevronRight,
  Bell,
  Pin,
  Users,
  CalendarCheck,
  PartyPopper,
  FileText,
  X,
  ArrowUpRight,
  CircleAlert,
  CheckCircle2,
  SlidersHorizontal,
  Building2,
  RotateCcw,
} from 'lucide-react'

import Modal from '../../UI/Modal'
import AnnouncementModal from '../employeeModal/AnnouncementModal'

const announcements = [
  {
    id: 1,
    title: 'Team Meeting Today at 5:30 PM',
    description:
      'All team members are requested to attend the team meeting to discuss current project progress, pending tasks, and upcoming deadlines.',
    category: 'Meeting',
    priority: 'Important',
    date: '2026-10-13',
    time: '05:30 PM',
    location: 'Conference Room A',
    author: 'HR Department',
    pinned: true,
    audience: 'All Employees',
  },
  {
    id: 2,
    title: 'Upcoming Holiday Announcement',
    description:
      'The office will remain closed on the announced holiday. Please plan your work accordingly and coordinate any pending tasks with your reporting manager.',
    category: 'Holiday',
    priority: 'Important',
    date: '2026-10-13',
    time: '10:00 AM',
    location: 'Company-wide',
    author: 'HR Department',
    pinned: true,
    audience: 'All Employees',
  },
  {
    id: 3,
    title: 'Monthly Performance Review',
    description:
      'The monthly performance review meetings will be conducted by respective team leads. Please ensure your task updates and progress reports are ready.',
    category: 'Meeting',
    priority: 'Normal',
    date: '2026-10-15',
    time: '11:00 AM',
    location: 'Meeting Room B',
    author: 'Management',
    pinned: false,
    audience: 'All Employees',
  },
  {
    id: 4,
    title: 'Salary Processing Completed',
    description:
      'Salary processing for this month has been completed. Employees can visit the Salary section to check their payslip and salary details.',
    category: 'Payroll',
    priority: 'Normal',
    date: '2026-10-12',
    time: '02:30 PM',
    location: 'Employee Portal',
    author: 'HR Department',
    pinned: false,
    audience: 'All Employees',
  },
  {
    id: 5,
    title: 'New Employee Welcome Session',
    description:
      'A welcome and orientation session has been arranged for new employees. Team members are encouraged to join and welcome our new colleagues.',
    category: 'Company News',
    priority: 'Normal',
    date: '2026-10-10',
    time: '03:00 PM',
    location: 'Conference Room A',
    author: 'HR Department',
    pinned: false,
    audience: 'All Employees',
  },
  {
    id: 6,
    title: 'Office Maintenance Update',
    description:
      'Scheduled office maintenance has been completed. All employees can resume using the regular office facilities.',
    category: 'General',
    priority: 'Normal',
    date: '2026-10-08',
    time: '09:00 AM',
    location: 'Office Premises',
    author: 'Admin Department',
    pinned: false,
    audience: 'All Employees',
  },
]

const categories = [
  'All',
  'Meeting',
  'Holiday',
  'Payroll',
  'Company News',
  'General',
]

const periods = ['All', 'Today', 'Upcoming', 'Past']

const formatDate = (date) =>
  new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

const getDayLabel = (date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const target = new Date(`${date}T00:00:00`)
  target.setHours(0, 0, 0, 0)

  const diff = Math.round((target - today) / 86400000)

  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff > 1) return `In ${diff} days`

  return formatDate(date)
}

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Meeting':
      return Users
    case 'Holiday':
      return PartyPopper
    case 'Payroll':
      return FileText
    case 'Company News':
      return Building2
    default:
      return Megaphone
  }
}

const EmpAnnouncement = () => {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activePeriod, setActivePeriod] = useState('All')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null)

  const handleCloseAnnouncement = () => {
    setSelectedAnnouncement(null)
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const activeFilterCount =
    Number(activePeriod !== 'All') +
    Number(activeCategory !== 'All')

  const filteredAnnouncements = useMemo(() => {
    return announcements
      .filter((item) => {
        const searchText = [
          item.title,
          item.description,
          item.author,
          item.category,
          item.location,
        ]
          .join(' ')
          .toLowerCase()

        const matchesSearch = searchText.includes(
          search.trim().toLowerCase()
        )

        const matchesCategory =
          activeCategory === 'All' ||
          item.category === activeCategory

        const itemDate = new Date(`${item.date}T00:00:00`)

        let matchesPeriod = true

        if (activePeriod === 'Today') {
          matchesPeriod = itemDate.getTime() === today.getTime()
        } else if (activePeriod === 'Upcoming') {
          matchesPeriod = itemDate > today
        } else if (activePeriod === 'Past') {
          matchesPeriod = itemDate < today
        }

        return matchesSearch && matchesCategory && matchesPeriod
      })
      .sort((a, b) => {
        const dateDifference =
          new Date(`${b.date}T00:00:00`) -
          new Date(`${a.date}T00:00:00`)

        if (dateDifference !== 0) return dateDifference

        return Number(b.pinned) - Number(a.pinned)
      })
  }, [search, activeCategory, activePeriod, today.getTime()])

  const todayCount = announcements.filter(
    (item) =>
      new Date(`${item.date}T00:00:00`).getTime() === today.getTime()
  ).length

  const upcomingCount = announcements.filter(
    (item) => new Date(`${item.date}T00:00:00`) > today
  ).length

  const pinnedCount = announcements.filter(
    (item) => item.pinned
  ).length

  const clearFilters = () => {
    setSearch('')
    setActiveCategory('All')
    setActivePeriod('All')
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] px-4 py-0 text-black sm:px-6 lg:px-1">
      <div className="mx-auto max-w-[1400px] space-y-6">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Company Announcements
            </h1>

            <div className="flex items-center gap-1">
              <ChevronRight size={14} className="mt-2 text-gray-500" />
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Stay updated with company important notices.
              </p>
            </div>
          </div>

          <div className="flex w-fit items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2">
            <div className="rounded-lg bg-gray-100 p-2">
              <Bell size={19} />
            </div>
            <div>
              <p className="text-xs text-gray-500">
                Total announcements
              </p>
              <p className="text-lg font-semibold">
                {announcements.length}
              </p>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={Megaphone}
            label="Total Announcements"
            value={announcements.length}
            note="Company-wide updates"
          />

          <SummaryCard
            icon={CalendarCheck}
            label="Today's Updates"
            value={todayCount}
            note="Published for today"
          />

          <SummaryCard
            icon={Pin}
            label="Pinned Notices"
            value={pinnedCount}
            note={`${upcomingCount} upcoming announcements`}
          />
        </div>

        {/* Search and floating filter panel */}
        <section className="relative z-30 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <div className="relative min-w-0 flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search announcements..."
                aria-label="Search announcements"
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-10 text-sm outline-none transition placeholder:text-gray-400 focus:border-black focus:bg-white"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 hover:bg-gray-200 hover:text-black"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Filter button and floating popover */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setShowFilters((prev) => !prev)}
                aria-expanded={showFilters}
                aria-label="Toggle announcement filters"
                className={`relative flex h-12 items-center justify-center gap-2 rounded-xl border px-3 transition sm:px-4 ${
                  showFilters || activeFilterCount > 0
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <SlidersHorizontal size={18} />

                <span className="hidden text-sm font-medium sm:inline">
                  Filters
                </span>

                {activeFilterCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-semibold text-black">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {showFilters && (
                <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-[360px] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl sm:p-5">

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">
                        Filter announcements
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        Narrow down your results
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowFilters(false)}
                      aria-label="Close filters"
                      className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Date */}
                  <div className="mt-5">
                    <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Date
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      {periods.map((period) => (
                        <button
                          key={period}
                          type="button"
                          onClick={() => setActivePeriod(period)}
                          aria-pressed={activePeriod === period}
                          className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                            activePeriod === period
                              ? 'border-black bg-black text-white'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-black'
                          }`}
                        >
                          {period === 'All' ? 'All dates' : period}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="mt-5">
                    <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Category
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => setActiveCategory(category)}
                          aria-pressed={activeCategory === category}
                          className={`rounded-full border px-3 py-2 text-xs transition sm:text-sm ${
                            activeCategory === category
                              ? 'border-black bg-black text-white'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-black'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-500 transition hover:text-black"
                    >
                      <RotateCcw size={13} />
                      Reset all
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowFilters(false)}
                      className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Result count and active filter chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500">
              {filteredAnnouncements.length} results
            </span>

            {activePeriod !== 'All' && (
              <button
                type="button"
                onClick={() => setActivePeriod('All')}
                className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
              >
                {activePeriod}
                <X size={12} />
              </button>
            )}

            {activeCategory !== 'All' && (
              <button
                type="button"
                onClick={() => setActiveCategory('All')}
                className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
              >
                {activeCategory}
                <X size={12} />
              </button>
            )}

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="ml-auto text-xs font-medium text-gray-500 underline underline-offset-2 hover:text-black"
              >
                Clear all
              </button>
            )}
          </div>
        </section>

        {/* Announcement list and sidebar */}
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_310px]">

          <section className="min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">
                  {activePeriod === 'All'
                    ? 'All Announcements'
                    : `${activePeriod} Announcements`}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {filteredAnnouncements.length} notices found
                </p>
              </div>
            </div>

            {filteredAnnouncements.length > 0 ? (
              <div className="space-y-4">
                {filteredAnnouncements.map((item) => {
                  const CategoryIcon = getCategoryIcon(item.category)

                  return (
                    <article
                      key={item.id}
                      onClick={() => setSelectedAnnouncement(item)}
                      className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-400 hover:shadow-md sm:p-6"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 transition group-hover:bg-black group-hover:text-white sm:h-12 sm:w-12">
                          <CategoryIcon size={21} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                              {item.category}
                            </span>

                            {item.priority === 'Important' && (
                              <span className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-black">
                                <CircleAlert size={12} />
                                Important
                              </span>
                            )}

                            {item.pinned && (
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <Pin size={12} />
                                Pinned
                              </span>
                            )}
                          </div>

                          <h3 className="mt-3 text-base font-semibold leading-6 transition group-hover:underline sm:text-lg">
                            {item.title}
                          </h3>

                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                            {item.description}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 sm:gap-x-5">
                            <span className="flex items-center gap-1.5">
                              <CalendarDays size={14} />
                              {formatDate(item.date)}
                            </span>

                            <span className="flex items-center gap-1.5">
                              <Clock3 size={14} />
                              {item.time}
                            </span>

                            <span className="flex items-center gap-1.5">
                              <Building2 size={14} />
                              {item.author}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          aria-label={`View ${item.title}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedAnnouncement(item)
                          }}
                          className="hidden rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:border-black hover:text-black sm:block"
                        >
                          <ArrowUpRight size={18} />
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                  <Search size={23} className="text-gray-500" />
                </div>

                <h3 className="mt-4 font-semibold">
                  No announcements found
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Try another search term or change your filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>

          {/* Right sidebar */}
          <aside className="space-y-5">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gray-100 p-2.5">
                  <CalendarDays size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Coming Up</h3>
                  <p className="text-xs text-gray-500">
                    Upcoming company events
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {announcements
                  .filter(
                    (item) =>
                      new Date(`${item.date}T00:00:00`) > today
                  )
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .slice(0, 3)
                  .map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setSelectedAnnouncement(item)}
                      className="flex w-full gap-3 text-left"
                    >
                      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                        <span className="text-[10px] font-medium uppercase text-gray-500">
                          {new Date(
                            `${item.date}T12:00:00`
                          ).toLocaleDateString('en-IN', {
                            month: 'short',
                          })}
                        </span>
                        <span className="text-lg font-semibold leading-5">
                          {new Date(
                            `${item.date}T12:00:00`
                          ).getDate()}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-5">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {getDayLabel(item.date)} · {item.time}
                        </p>
                      </div>
                    </button>
                  ))}

                {upcomingCount === 0 && (
                  <p className="text-sm text-gray-500">
                    No upcoming events.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-2xl bg-black p-5 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Bell size={20} />
              </div>

              <h3 className="mt-4 text-lg font-semibold">
                Stay in the loop
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-300">
                Check announcements regularly so you don't miss important company updates and meetings.
              </p>

              <div className="mt-5 flex items-center gap-2 border-t border-white/15 pt-4 text-xs text-gray-300">
                <CheckCircle2 size={15} />
                Keep yourself informed
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <Megaphone size={18} />
                <h3 className="font-semibold">Announcement Guide</h3>
              </div>

              <div className="mt-4 space-y-3 text-sm text-gray-600">
                {[
                  'Meetings and schedules',
                  'Holidays and office closures',
                  'Payroll and HR updates',
                  'Important company notices',
                ].map((guide) => (
                  <p key={guide} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-black" />
                    {guide}
                  </p>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* Announcement details modal */}
      <Modal
        isOpen={!!selectedAnnouncement}
        onClose={handleCloseAnnouncement}
        title='Announcement Details'
        size='md'
      >
        <AnnouncementModal
          announcement={selectedAnnouncement}
          onClose={handleCloseAnnouncement}
        />
      </Modal>
    </div>
  )
}

const SummaryCard = ({ icon: Icon, label, value, note }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="text-sm text-gray-700">{label}</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight">
          {value}
        </p>
      </div>
      <div className="rounded-xl bg-gray-100 p-3">
        <Icon size={21} />
      </div>
    </div>
    <p className="mt-2 text-xs text-gray-500">{note}</p>
  </div>
)

export default EmpAnnouncement