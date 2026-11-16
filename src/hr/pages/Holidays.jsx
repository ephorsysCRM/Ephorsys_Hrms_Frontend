
import { useMemo, useState } from 'react'
import {
    Search,
    MoreVertical,
    CalendarDays,

    FileText,
    Clock3,
    CheckCircle2,
    Plus,
    Pencil,
    Trash2,
    X
} from 'lucide-react'

import Pagination from '../../UI/Pagination'
import Modal from '../../UI/Modal'

const INITIAL_HOLIDAYS = [
    {
        _id: 'holiday-001',
        name: 'Independence Day',
        date: '2027-08-15',
        description: 'National Holiday'
    },
    {
        _id: 'holiday-002',
        name: 'Republic Day',
        date: '2027-01-26',
        description: 'National Holiday'
    },
    {
        _id: 'holiday-003',
        name: 'Holi',
        date: '2027-03-22',
        description: 'Festival Holiday'
    },
    {
        _id: 'holiday-004',
        name: 'Gandhi Jayanti',
        date: '2027-10-02',
        description: 'National Holiday'
    },
    {
        _id: 'holiday-005',
        name: 'Christmas',
        date: '2027-12-25',
        description: 'Festival Holiday'
    },
    {
        _id: 'holiday-006',
        name: 'Labour Day',
        date: '2027-05-01',
        description: 'Public Holiday'
    },
    {
        _id: 'holiday-007',
        name: 'Diwali',
        date: '2027-11-08',
        description: 'Festival Holiday'
    }
]

const PAGE_SIZE = 6

const formatDate = value => {
    if (!value) return '-'

    const date = new Date(`${value}T00:00:00`)

    if (Number.isNaN(date.getTime())) return '-'

    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

const getToday = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

const getHolidayStatus = date => {
    if (date < getToday()) return 'Past'
    if (date === getToday()) return 'Today'
    return 'Upcoming'
}

const getStatusClass = status => {
    switch (status) {
        case 'Past':
            return 'bg-gray-100 text-gray-600'
        case 'Today':
            return 'bg-green-100 text-green-700'
        default:
            return 'bg-blue-100 text-blue-700'
    }
}

const Holiday = () => {
    const [holidays, setHolidays] = useState(INITIAL_HOLIDAYS)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [holidayDate, setHolidayDate] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    const [openActionId, setOpenActionId] = useState(null)
    const [selectedHoliday, setSelectedHoliday] = useState(null)

    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [showFormModal, setShowFormModal] = useState(false)
    const [editingHoliday, setEditingHoliday] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteHolidayId, setDeleteHolidayId] = useState(null)

    const [formData, setFormData] = useState({
        name: '',
        date: '',
        description: ''
    })

    const today = getToday()

    // KPI COUNTS
    const totalHolidays = holidays.length

    const goneHolidays = holidays.filter(
        item => item.date < today
    ).length

    const remainingHolidays = holidays.filter(
        item => item.date >= today
    ).length

    // FILTER HOLIDAYS
    const filteredHolidays = useMemo(() => {
        const search = searchTerm.trim().toLowerCase()

        return holidays.filter(holiday => {
            const matchesSearch =
                !search ||
                holiday.name.toLowerCase().includes(search) ||
                holiday.description.toLowerCase().includes(search)

            const status = getHolidayStatus(holiday.date)

            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'upcoming' &&
                    (status === 'Upcoming' || status === 'Today')) ||
                (statusFilter === 'past' && status === 'Past')

            const matchesDate =
                !holidayDate || holiday.date === holidayDate

            return matchesSearch && matchesStatus && matchesDate
        }).sort((a, b) => a.date.localeCompare(b.date))
    }, [holidays, searchTerm, statusFilter, holidayDate])

    // PAGINATION
    const totalPages = Math.max(
        1,
        Math.ceil(filteredHolidays.length / PAGE_SIZE)
    )

    const safePage = Math.min(currentPage, totalPages)

    const paginatedHolidays = filteredHolidays.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE
    )

    const closeActionMenu = () => {
        setOpenActionId(null)
    }

    const handleSearchChange = value => {
        setSearchTerm(value)
        setCurrentPage(1)
        closeActionMenu()
    }


    const handleDateChange = value => {
        setHolidayDate(value)
        setCurrentPage(1)
        closeActionMenu()
    }

    // ACTION MENU
    const toggleActionMenu = (event, holiday) => {
        event.preventDefault()
        event.stopPropagation()

        setOpenActionId(previous =>
            previous === holiday._id ? null : holiday._id
        )
    }


    const closeDetailsModal = () => {
        setShowDetailsModal(false)
        setSelectedHoliday(null)
    }

    // OPEN ADD MODAL
    const openAddModal = () => {
        setEditingHoliday(null)

        setFormData({
            name: '',
            date: '',
            description: ''
        })

        setShowFormModal(true)
    }

    // OPEN EDIT MODAL
    const openEditModal = holiday => {
        closeActionMenu()
        setEditingHoliday(holiday)

        setFormData({
            name: holiday.name,
            date: holiday.date,
            description: holiday.description
        })

        setShowFormModal(true)
    }

    const closeFormModal = () => {
        setShowFormModal(false)
        setEditingHoliday(null)
        setFormData({
            name: '',
            date: '',
            description: ''
        })
    }

    // SAVE HOLIDAY
    const handleSaveHoliday = () => {
        if (
            !formData.name.trim() ||
            !formData.date ||
            !formData.description.trim()
        ) return

        if (editingHoliday) {
            setHolidays(previous =>
                previous.map(item =>
                    item._id === editingHoliday._id
                        ? {
                            ...item,
                            ...formData,
                            name: formData.name.trim(),
                            description: formData.description.trim()
                        }
                        : item
                )
            )
        } else {
            const newHoliday = {
                _id: `holiday-${Date.now()}`,
                name: formData.name.trim(),
                date: formData.date,
                description: formData.description.trim()
            }

            setHolidays(previous => [...previous, newHoliday])
        }

        closeFormModal()
        setCurrentPage(1)
    }

    // DELETE HOLIDAY
    const openDeleteModal = holiday => {
        closeActionMenu()
        setDeleteHolidayId(holiday._id)
        setShowDeleteModal(true)
    }

    const closeDeleteModal = () => {
        setShowDeleteModal(false)
        setDeleteHolidayId(null)
    }

    const handleDeleteHoliday = () => {
        setHolidays(previous =>
            previous.filter(item => item._id !== deleteHolidayId)
        )

        closeDeleteModal()
        setSelectedHoliday(null)
        setCurrentPage(1)
    }

    const activeDeleteHoliday = holidays.find(
        item => item._id === deleteHolidayId
    )

    return (
        <div className='mx-auto w-full max-w-375 space-y-5 py-2'>

            {/* HEADER */}
            <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-900'>
                        Holiday Management
                    </h1>
                    <p className='mt-1 text-sm text-gray-500'>
                        Manage and organize your organization's holidays.
                    </p>
                </div>

                <div className='flex flex-wrap items-center gap-2'>
                    <button
                        type='button'
                        onClick={openAddModal}
                        className='inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-gray-900'
                    >
                        <Plus size={18} />
                        Add Holiday
                    </button>
                </div>
            </div>

            {/* KPI CARDS */}
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3'>

                {/* TOTAL HOLIDAYS */}
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

                {/* HOLIDAYS GONE */}
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

                {/* REMAINING HOLIDAYS */}
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
                <div className="grid grid-cols-1 gap-4 md:grid-flow-col md:auto-cols-max md:justify-between w-full">

                    <div className='relative lg:col-span-6'>
                        <Search
                            size={18}
                            className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'
                        />

                        <input
                            type='text'
                            value={searchTerm}
                            onChange={event =>
                                handleSearchChange(event.target.value)
                            }
                            placeholder='Search holiday name or description...'
                            className='h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                        />
                    </div>

                   

                    <div className='relative lg:col-span-3'>
                        <CalendarDays
                            size={18}
                            className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'
                        />

                        <input
                            type='date'
                            value={holidayDate}
                            onChange={event =>
                                handleDateChange(event.target.value)
                            }
                            className='h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                            title='Filter by holiday date'
                        />
                    </div>
                </div>
            </div>

            {/* HOLIDAY TABLE */}
            <div className='rounded-2xl border border-gray-200 bg-white shadow-sm'>

                <div className='flex flex-col justify-between gap-2 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center'>
                    <div>
                        <h2 className='font-semibold text-gray-900'>
                            Holiday Lists
                        </h2>
                    </div>

                    {holidayDate && (
                        <span className='inline-flex w-fit items-center rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-black'>
                            {formatDate(holidayDate)}
                        </span>
                    )}
                </div>

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
                            {paginatedHolidays.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className='px-5 py-16 text-center'>
                                        <FileText
                                            size={36}
                                            className='mx-auto text-gray-300'
                                        />

                                        <p className='mt-3 font-medium text-gray-700'>
                                            No holidays found
                                        </p>

                                        <p className='mt-1 text-sm text-gray-500'>
                                            Try changing your search or filter criteria.
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedHolidays.map(holiday => {
                                    return (
                                        <tr
                                            key={holiday._id}
                                            className='transition hover:bg-gray-50'
                                        >
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

                                            <td className='whitespace-nowrap px-5 py-4'>
                                                <p className='text-sm font-medium text-gray-700'>
                                                    {formatDate(holiday.date)}
                                                </p>
                                            </td>

                                            <td className='px-5 py-4'>
                                                <p className='max-w-xs truncate text-sm text-gray-600'>
                                                    {holiday.description || '-'}
                                                </p>
                                            </td>


                                            <td className='px-5 py-4 text-center'>
                                                <button
                                                    type='button'
                                                    onClick={event =>
                                                        toggleActionMenu(event, holiday)
                                                    }
                                                    className='inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800'
                                                    aria-label='Open holiday actions'
                                                >
                                                    <MoreVertical size={20} />
                                                </button>

                                                {openActionId === holiday._id && (<div className='relative'>
                                                    <div
                                                        className='absolute right-24 -top-20 z-20 w-30 overflow-hidden rounded-xl border border-gray-200 bg-white py-1.5 text-left shadow-xl'
                                                        onClick={event => event.stopPropagation()}
                                                    >

                                                        <button
                                                            type='button'
                                                            onClick={() =>
                                                                openEditModal(holiday)
                                                            }
                                                            className='flex w-full items-center gap-3 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50'
                                                        >
                                                            <Pencil size={16} />
                                                            Edit
                                                        </button>

                                                        <button
                                                            type='button'
                                                            onClick={() =>
                                                                openDeleteModal(holiday)
                                                            }
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
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                {filteredHolidays.length > 0 && (
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

            {/* ADD / EDIT HOLIDAY MODAL */}
            <Modal
                isOpen={showFormModal}
                onClose={closeFormModal}
                title={editingHoliday ? 'Edit Holiday' : 'Add Holiday'}
                size='md'
            >
                <div className='space-y-4'>

                    <div>
                        <label className='mb-2 block text-sm font-medium text-gray-700'>
                            Holiday Name <span className='text-red-500'>*</span>
                        </label>

                        <input
                            type='text'
                            value={formData.name}
                            onChange={event =>
                                setFormData(previous => ({
                                    ...previous,
                                    name: event.target.value
                                }))
                            }
                            placeholder='Enter holiday name'
                            className='h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-black focus:ring-2 focus:ring-blue-100'
                        />
                    </div>

                    <div>
                        <label className='mb-2 block text-sm font-medium text-gray-700'>
                            Holiday Date <span className='text-red-500'>*</span>
                        </label>

                        <input
                            type='date'
                            value={formData.date}
                            onChange={event =>
                                setFormData(previous => ({
                                    ...previous,
                                    date: event.target.value
                                }))
                            }
                            className='h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-black focus:ring-2 focus:ring-blue-100'
                        />
                    </div>

                    <div>
                        <label className='mb-2 block text-sm font-medium text-gray-700'>
                            Description <span className='text-red-500'>*</span>
                        </label>

                        <textarea
                            rows={4}
                            value={formData.description}
                            onChange={event =>
                                setFormData(previous => ({
                                    ...previous,
                                    description: event.target.value
                                }))
                            }
                            placeholder='Enter holiday description'
                            className='w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-blue-100'
                        />
                    </div>

                    <div className='flex justify-end gap-2 border-t border-gray-100 pt-4'>
                        <button
                            type='button'
                            onClick={closeFormModal}
                            className='rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50'
                        >
                            Cancel
                        </button>

                        <button
                            type='button'
                            onClick={handleSaveHoliday}
                            disabled={
                                !formData.name.trim() ||
                                !formData.date ||
                                !formData.description.trim()
                            }
                            className='rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50'
                        >
                            {editingHoliday ? 'Update Holiday' : 'Save Holiday'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* DELETE CONFIRMATION MODAL */}
            <Modal
                isOpen={showDeleteModal}
                onClose={closeDeleteModal}
                title='Delete Holiday'
                size='sm'
            >
                <div className='space-y-4'>
                    <div className='rounded-xl border border-red-100 bg-red-50 p-4'>
                        <p className='text-sm font-semibold text-black'>
                            Are you sure you want to delete this holiday?
                        </p>

                        <p className='mt-1 text-xs text-black'>
                            {activeDeleteHoliday?.name || 'This holiday'} will be permanently removed from this preview.
                        </p>
                    </div>

                    <div className='flex justify-end gap-2 border-t border-gray-100 pt-4'>
                        <button
                            type='button'
                            onClick={closeDeleteModal}
                            className='rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50'
                        >
                            Cancel
                        </button>

                        <button
                            type='button'
                            onClick={handleDeleteHoliday}
                            className='rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-900'
                        >
                            Delete Holiday
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Holiday
