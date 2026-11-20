import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  Search,
  MoreVertical,
  CalendarDays,
  FileText,
  Clock3,
  CheckCircle2,
  Plus,
  Pencil,
  Trash2
} from 'lucide-react'

import Pagination from '../../UI/Pagination'
import Modal from '../../UI/Modal'

import AddHoliDayModal from '../hrModals/AddHoliDayModal'
import EditHoliDayModal from '../hrModals/EditHoliDayModal'
import DeleteHolidayModal from '../hrModals/DeleteHolidayModal'

import {
  createHoliday,
  getAllHolidays,
  updateHoliday,
  deleteHoliday
} from '../../redux/features/holiday/holidayThunk'

const PAGE_SIZE = 6

// FORMAT DATE
const formatDate = value => {
  if (!value) return '-'

  const dateValue = String(value).slice(0, 10)
  const date = new Date(`${dateValue}T00:00:00`)

  if (Number.isNaN(date.getTime())) return '-'

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// GET TODAY
const getToday = () => {
  const date = new Date()

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// GET DATE ONLY
const getDateOnly = value => {
  if (!value) return ''

  return String(value).slice(0, 10)
}

// HOLIDAY STATUS
const getHolidayStatus = date => {
  const holidayDate = getDateOnly(date)
  const today = getToday()

  if (holidayDate < today) return 'Past'
  if (holidayDate === today) return 'Today'

  return 'Upcoming'
}

const Holiday = () => {
  const dispatch = useDispatch()

  // REDUX STATE
  const {
    holidays = [],
    loading,
    creating,
    updating,
    deleting,
    error
  } = useSelector(state => state.holiday)

  // FILTER STATES
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [holidayDate, setHolidayDate] = useState('')

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1)

  // SELECTED YEAR
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // ACTION MENU
  const [openActionId, setOpenActionId] = useState(null)

  // SEPARATE MODAL STATES
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // SELECTED HOLIDAYS
  const [editingHoliday, setEditingHoliday] = useState(null)
  const [deleteHolidayId, setDeleteHolidayId] = useState(null)

  // FORM DATA
  const initialFormData = {
    name: '',
    date: '',
    description: ''
  }

  const [formData, setFormData] = useState(initialFormData)

  const today = getToday()

  // FETCH HOLIDAYS
  useEffect(() => {
    dispatch(getAllHolidays(selectedYear, 1, 100))
  }, [dispatch, selectedYear])

  // KPI COUNTS
  const totalHolidays = holidays.length

  const goneHolidays = holidays.filter(
    item => getDateOnly(item.date) < today
  ).length

  const remainingHolidays = holidays.filter(
    item => getDateOnly(item.date) >= today
  ).length

  // FILTER HOLIDAYS
  const filteredHolidays = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    return holidays
      .filter(holiday => {
        const name = holiday.name || ''
        const description = holiday.description || ''
        const date = getDateOnly(holiday.date)

        const matchesSearch =
          !search ||
          name.toLowerCase().includes(search) ||
          description.toLowerCase().includes(search)

        const status = getHolidayStatus(date)

        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'upcoming' &&
            (status === 'Upcoming' || status === 'Today')) ||
          (statusFilter === 'past' && status === 'Past')

        const matchesDate = !holidayDate || date === holidayDate

        return matchesSearch && matchesStatus && matchesDate
      })
      .sort((a, b) => getDateOnly(a.date).localeCompare(getDateOnly(b.date)))
  }, [holidays, searchTerm, statusFilter, holidayDate])

  // PAGINATION
  const totalPages = Math.max(1, Math.ceil(filteredHolidays.length / PAGE_SIZE))

  const safePage = Math.min(currentPage, totalPages)

  const paginatedHolidays = filteredHolidays.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  )

  // CLOSE ACTION MENU
  const closeActionMenu = () => {
    setOpenActionId(null)
  }

  // SEARCH
  const handleSearchChange = value => {
    setSearchTerm(value)
    setCurrentPage(1)
    closeActionMenu()
  }

  // DATE FILTER
  const handleDateChange = value => {
    setHolidayDate(value)
    setCurrentPage(1)
    closeActionMenu()

    if (value) {
      setSelectedYear(Number(value.slice(0, 4)))
    } else {
      setSelectedYear(new Date().getFullYear())
    }
  }

  // ACTION MENU
  const toggleActionMenu = (event, holiday) => {
    event.preventDefault()
    event.stopPropagation()

    setOpenActionId(previous => (previous === holiday._id ? null : holiday._id))
  }

  // RESET FORM
  const resetForm = () => {
    setFormData(initialFormData)
    setEditingHoliday(null)
  }

  // ==========================================
  // ADD HOLIDAY MODAL
  // ==========================================

  // OPEN ADD MODAL
  const openAddModal = () => {
    closeActionMenu()
    resetForm()
    setShowAddModal(true)
  }

  // CLOSE ADD MODAL
  const closeAddModal = () => {
    setShowAddModal(false)
    resetForm()
  }

  // CREATE HOLIDAY API
  const handleCreateHoliday = async () => {
    if (
      !formData.name.trim() ||
      !formData.date ||
      !formData.description.trim()
    ) {
      return
    }

    const holidayData = {
      name: formData.name.trim(),
      date: formData.date,
      description: formData.description.trim()
    }

    const result = await dispatch(createHoliday(holidayData))

    if (result?.success) {
      const year = Number(formData.date.slice(0, 4))

      closeAddModal()

      setCurrentPage(1)
      setHolidayDate('')

      if (year === selectedYear) {
        dispatch(getAllHolidays(year, 1, 100))
      } else {
        setSelectedYear(year)
      }
    }
  }

  // ==========================================
  // EDIT HOLIDAY MODAL
  // ==========================================

  // OPEN EDIT MODAL
  const openEditModal = holiday => {
    closeActionMenu()

    setEditingHoliday(holiday)

    setFormData({
      name: holiday.name || '',
      date: getDateOnly(holiday.date),
      description: holiday.description || ''
    })

    setShowEditModal(true)
  }

  // CLOSE EDIT MODAL
  const closeEditModal = () => {
    setShowEditModal(false)
    resetForm()
  }

  // UPDATE HOLIDAY API
  const handleUpdateHoliday = async () => {
    if (!editingHoliday?._id) return

    if (
      !formData.name.trim() ||
      !formData.date ||
      !formData.description.trim()
    ) {
      return
    }

    const holidayData = {
      name: formData.name.trim(),
      date: formData.date,
      description: formData.description.trim()
    }

    const result = await dispatch(
      updateHoliday(editingHoliday._id, holidayData)
    )

    if (result?.success) {
      const year = Number(formData.date.slice(0, 4))

      closeEditModal()

      setCurrentPage(1)
      setHolidayDate('')

      if (year === selectedYear) {
        dispatch(getAllHolidays(year, 1, 100))
      } else {
        setSelectedYear(year)
      }
    }
  }

  // ==========================================
  // DELETE HOLIDAY MODAL
  // ==========================================

  // OPEN DELETE MODAL
  const openDeleteModal = holiday => {
    closeActionMenu()

    setDeleteHolidayId(holiday._id)
    setShowDeleteModal(true)
  }

  // CLOSE DELETE MODAL
  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setDeleteHolidayId(null)
  }

  // GET ACTIVE DELETE HOLIDAY
  const activeDeleteHoliday = holidays.find(
    item => item._id === deleteHolidayId
  )

  // DELETE HOLIDAY API
  const handleDeleteHoliday = async () => {
    if (!deleteHolidayId) return

    const result = await dispatch(deleteHoliday(deleteHolidayId))

    if (result?.success) {
      closeDeleteModal()
      setCurrentPage(1)

      dispatch(getAllHolidays(selectedYear, 1, 100))
    }
  }

  return (
    <div className='mx-auto w-full max-w-375 space-y-5 py-2'>
      {/* HEADER */}
      <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
        <div>
          <h1 className='text-2xl sm:text-3xl  font-bold text-gray-900'>
            Holiday Management
          </h1>

          <p className='mt-1 text-sm text-gray-500'>
            Manage and organize your organization's holidays.
          </p>
        </div>

        <button
          type='button'
          onClick={openAddModal}
          className='inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-900'
        >
          <Plus size={18} />
          Add Holiday
        </button>
      </div>

      {/* KPI CARDS */}
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3'>
        {/* TOTAL */}
        <div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-gray-500'>
                Total Holidays
              </p>

              <p className='mt-1 text-2xl font-bold text-gray-900'>
                {totalHolidays}
              </p>
            </div>

            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-black'>
              <CalendarDays size={21} />
            </div>
          </div>
        </div>

        {/* AVAILED */}
        <div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-gray-500'>
                Holidays Availed
              </p>

              <p className='mt-1 text-2xl font-bold text-gray-900'>
                {goneHolidays}
              </p>
            </div>

            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-600'>
              <Clock3 size={21} />
            </div>
          </div>
        </div>

        {/* REMAINING */}
        <div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-medium text-gray-500'>
                Remaining Holidays
              </p>

              <p className='mt-1 text-2xl font-bold text-gray-900'>
                {remainingHolidays}
              </p>
            </div>

            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-black'>
              <CheckCircle2 size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* FILTER SECTION */}
      <div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5'>
        <div className='grid w-full grid-cols-1 gap-4 md:grid-flow-col md:auto-cols-max md:justify-between'>
          {/* SEARCH */}
          <div className='relative lg:col-span-6'>
            <Search
              size={18}
              className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'
            />

            <input
              type='text'
              value={searchTerm}
              onChange={event => handleSearchChange(event.target.value)}
              placeholder='Search holiday name or description...'
              className='h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
            />
          </div>

          {/* DATE FILTER */}
          <div className='relative lg:col-span-3'>
            <CalendarDays
              size={18}
              className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'
            />

            <input
              type='date'
              value={holidayDate}
              onChange={event => handleDateChange(event.target.value)}
              className='h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
              title='Filter by holiday date'
            />
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'>
          {error}
        </div>
      )}

      {/* HOLIDAY TABLE */}
      <div className='rounded-2xl border border-gray-200 bg-white shadow-sm'>
        {/* TABLE HEADER */}
        <div className='flex flex-col justify-between gap-2 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center'>
          <div>
            <h2 className='font-semibold text-gray-900'>Holiday Lists</h2>

            <p className='mt-1 text-xs text-gray-500'>
              Showing holidays for {selectedYear}
            </p>
          </div>

          {holidayDate && (
            <span className='inline-flex w-fit items-center rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-black'>
              {formatDate(holidayDate)}
            </span>
          )}
        </div>

        {/* TABLE CONTENT */}
        <div className='w-full overflow-x-auto'>
          <table className='w-full min-w-175 text-left'>
            <thead className='bg-gray-50'>
              <tr className='border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500'>
                <th className='px-5 py-4'>Holiday Name</th>
                <th className='px-5 py-4'>Date</th>
                <th className='px-5 py-4'>Description</th>
                <th className='px-5 py-4 text-center'>Action</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-gray-100'>
              {loading ? (
                <tr>
                  <td colSpan={4} className='px-5 py-16 text-center'>
                    <div className='flex flex-col items-center gap-3'>
                      <div className='h-7 w-7 animate-spin rounded-full border-2 border-gray-300 border-t-black' />

                      <p className='text-sm text-gray-500'>
                        Loading holidays...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : paginatedHolidays.length === 0 ? (
                <tr>
                  <td colSpan={4} className='px-5 py-16 text-center'>
                    <FileText size={36} className='mx-auto text-gray-300' />

                    <p className='mt-3 font-medium text-gray-700'>
                      No holidays found
                    </p>

                    <p className='mt-1 text-sm text-gray-500'>
                      Try changing your search or filter criteria.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedHolidays.map(holiday => (
                  <tr key={holiday._id} className='transition hover:bg-gray-50'>
                    {/* NAME */}
                    <td className='px-5 py-4'>
                      <div className='flex min-w-0 items-center gap-3'>
                        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-black'>
                          <CalendarDays size={19} />
                        </div>

                        <p className='truncate text-sm font-semibold text-gray-800'>
                          {holiday.name}
                        </p>
                      </div>
                    </td>

                    {/* DATE */}
                    <td className='whitespace-nowrap px-5 py-4'>
                      <p className='text-sm font-medium text-gray-700'>
                        {formatDate(holiday.date)}
                      </p>
                    </td>

                    {/* DESCRIPTION */}
                    <td className='px-5 py-4'>
                      <p className='max-w-xs truncate text-sm text-gray-600'>
                        {holiday.description || '-'}
                      </p>
                    </td>

                    {/* ACTION */}
                    <td className='px-5 py-4 text-center'>
                      <button
                        type='button'
                        onClick={event => toggleActionMenu(event, holiday)}
                        className='inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800'
                        aria-label='Open holiday actions'
                      >
                        <MoreVertical size={20} />
                      </button>

                      {openActionId === holiday._id && (
                        <div className='relative'>
                          <div
                            className='absolute right-24 -top-20 z-20 w-30 overflow-hidden rounded-xl border border-gray-200 bg-white py-1.5 text-left shadow-xl'
                            onClick={event => event.stopPropagation()}
                          >
                            {/* EDIT */}
                            <button
                              type='button'
                              onClick={() => openEditModal(holiday)}
                              className='flex w-full items-center gap-3 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50'
                            >
                              <Pencil size={16} />
                              Edit
                            </button>

                            {/* DELETE */}
                            <button
                              type='button'
                              onClick={() => openDeleteModal(holiday)}
                              className='flex w-full items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50'
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {!loading && filteredHolidays.length > 0 && (
          <div className='flex flex-col justify-center gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center'>
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={page => {
                setCurrentPage(page)
                closeActionMenu()
              }}
            />
          </div>
        )}
      </div>

      {/* ================================== */}
      {/* ADD HOLIDAY MODAL */}
      {/* ================================== */}
      <Modal
        isOpen={showAddModal}
        onClose={closeAddModal}
        title='Add Holiday'
        size='md'
      >
        <AddHoliDayModal
          formData={formData}
          setFormData={setFormData}
          closeFormModal={closeAddModal}
          handleSaveHoliday={handleCreateHoliday}
          creating={creating}
          updating={false}
        />
      </Modal>

      {/* ================================== */}
      {/* EDIT HOLIDAY MODAL */}
      {/* ================================== */}
      <Modal
        isOpen={showEditModal}
        onClose={closeEditModal}
        title='Edit Holiday'
        size='md'
      >
        <EditHoliDayModal
          formData={formData}
          setFormData={setFormData}
          closeEditModal={closeEditModal}
          handleUpdateHoliday={handleUpdateHoliday}
          updating={updating}
        />
      </Modal>

      {/* ================================== */}
      {/* DELETE HOLIDAY MODAL */}
      {/* ================================== */}
      <Modal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        title='Delete Holiday'
        size='sm'
      >
        <DeleteHolidayModal
          activeDeleteHoliday={activeDeleteHoliday}
          closeDeleteModal={closeDeleteModal}
          handleDeleteHoliday={handleDeleteHoliday}
          deleting={deleting}
        />
      </Modal>
    </div>
  )
}

export default Holiday
