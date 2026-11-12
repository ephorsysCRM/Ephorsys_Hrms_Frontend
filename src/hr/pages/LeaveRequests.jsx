import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
    Search,
    Eye,
    MoreVertical,
    CheckCircle2,
    XCircle,
    CalendarDays,
    RefreshCw,
    FileText,
    Clock3
} from 'lucide-react'

import Pagination from '../../UI/Pagination'
import Modal from '../../UI/Modal'

// Frontend-only preview data. Replace this array with your leave request data
// when you connect the page to your existing Redux/API flow.
const INITIAL_LEAVE_REQUESTS = [
    {
        _id: 'leave-001',
        employee: {
            firstName: 'Aarav',
            lastName: 'Sharma',
            employeeId: 'EMP-1001',
            department: 'Engineering'
        },
        leaveType: 'Casual Leave',
        startDate: '2026-11-16',
        endDate: '2026-11-17',
        days: 2,
        reason: 'Family function at my hometown.',
        status: 'pending',
        createdAt: '2026-11-10T09:30:00'
    },
    {
        _id: 'leave-002',
        employee: {
            firstName: 'Priya',
            lastName: 'Patel',
            employeeId: 'EMP-1002',
            department: 'Human Resources'
        },
        leaveType: 'Sick Leave',
        startDate: '2026-11-11',
        endDate: '2026-11-12',
        days: 2,
        reason: 'Not feeling well and advised to take rest.',
        status: 'approved',
        createdAt: '2026-11-09T11:15:00'
    },
    {
        _id: 'leave-003',
        employee: {
            firstName: 'Rohan',
            lastName: 'Das',
            employeeId: 'EMP-1003',
            department: 'Finance'
        },
        leaveType: 'Earned Leave',
        startDate: '2026-11-20',
        endDate: '2026-11-24',
        days: 5,
        reason: 'Planned personal vacation.',
        status: 'pending',
        createdAt: '2026-11-08T14:20:00'
    },
    {
        _id: 'leave-004',
        employee: {
            firstName: 'Ananya',
            lastName: 'Rao',
            employeeId: 'EMP-1004',
            department: 'Design'
        },
        leaveType: 'Casual Leave',
        startDate: '2026-11-06',
        endDate: '2026-11-06',
        days: 1,
        reason: 'Personal work.',
        status: 'rejected',
        createdAt: '2026-11-04T10:05:00'
    },
    {
        _id: 'leave-005',
        employee: {
            firstName: 'Vikram',
            lastName: 'Singh',
            employeeId: 'EMP-1005',
            department: 'Operations'
        },
        leaveType: 'Sick Leave',
        startDate: '2026-11-18',
        endDate: '2026-11-19',
        days: 2,
        reason: 'Medical appointment and recovery.',
        status: 'pending',
        createdAt: '2026-11-12T08:45:00'
    },
    {
        _id: 'leave-006',
        employee: {
            firstName: 'Meera',
            lastName: 'Nair',
            employeeId: 'EMP-1006',
            department: 'Marketing'
        },
        leaveType: 'Earned Leave',
        startDate: '2026-12-01',
        endDate: '2026-12-03',
        days: 3,
        reason: 'Travelling out of station.',
        status: 'approved',
        createdAt: '2026-11-07T16:10:00'
    },
    {
        _id: 'leave-007',
        employee: {
            firstName: 'Kabir',
            lastName: 'Verma',
            employeeId: 'EMP-1007',
            department: 'Engineering'
        },
        leaveType: 'Casual Leave',
        startDate: '2026-11-25',
        endDate: '2026-11-25',
        days: 1,
        reason: 'Urgent personal commitment.',
        status: 'pending',
        createdAt: '2026-11-11T12:00:00'
    },
    {
        _id: 'leave-008',
        employee: {
            firstName: 'Ishita',
            lastName: 'Gupta',
            employeeId: 'EMP-1008',
            department: 'Sales'
        },
        leaveType: 'Sick Leave',
        startDate: '2026-11-02',
        endDate: '2026-11-03',
        days: 2,
        reason: 'Fever and seasonal infection.',
        status: 'approved',
        createdAt: '2026-10-31T09:10:00'
    }
]

const PAGE_SIZE = 6

const getEmployeeName = employee => {
    if (!employee) return 'Unknown Employee'
    if (typeof employee === 'string') return employee

    return (
        [employee.firstName, employee.middleName, employee.lastName]
            .filter(Boolean)
            .join(' ') ||
        employee.name ||
        employee.fullName ||
        'Unknown Employee'
    )
}

const getEmployeeId = employee => {
    if (!employee) return '-'
    if (typeof employee === 'string') return employee
    return employee.employeeId || employee.empId || employee._id || '-'
}

const getDepartmentName = employee => {
    if (!employee || typeof employee === 'string') return '-'
    if (typeof employee.department === 'object') {
        return employee.department?.name || '-'
    }
    return employee.department || '-'
}

const formatDate = value => {
    if (!value) return '-'

    const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
        ? new Date(`${value}T00:00:00`)
        : new Date(value)

    if (Number.isNaN(date.getTime())) return '-'

    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

const formatDateTime = value => {
    if (!value) return '-'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '-'

    return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const getInitials = employee => {
    const name = getEmployeeName(employee)
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0])
        .join('')
        .toUpperCase()
}

const getStatusClass = status => {
    switch (status?.toLowerCase()) {
        case 'approved':
            return 'bg-green-100 text-green-700'
        case 'rejected':
            return 'bg-red-100 text-red-700'
        case 'pending':
            return 'bg-amber-100 text-amber-700'
        default:
            return 'bg-amber-100 text-amber-700'
    }
}

const getLeaveTypeClass = type => {
    const value = type?.toLowerCase() || ''

    if (value.includes('sick')) return 'bg-rose-50 text-rose-700'
    if (value.includes('earned')) return 'bg-violet-50 text-violet-700'
    return 'bg-blue-50 text-blue-700'
}

const LeaveRequests = () => {
    const [requests, setRequests] = useState(INITIAL_LEAVE_REQUESTS)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [leaveDate, setLeaveDate] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    const [openActionId, setOpenActionId] = useState(null)
    const [menuPosition, setMenuPosition] = useState(null)

    const [selectedRequest, setSelectedRequest] = useState(null)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [rejectRequestId, setRejectRequestId] = useState(null)
    const [rejectionReason, setRejectionReason] = useState('')

    const closeActionMenu = () => {
        setOpenActionId(null)
        setMenuPosition(null)
    }

    const filteredRequests = useMemo(() => {
        const search = searchTerm.trim().toLowerCase()

        return requests.filter(request => {
            const employeeName = getEmployeeName(request.employee).toLowerCase()
            const employeeId = String(getEmployeeId(request.employee)).toLowerCase()
            const reason = String(request.reason || '').toLowerCase()
            const leaveType = String(request.leaveType || '').toLowerCase()

            const matchesSearch =
                !search ||
                employeeName.includes(search) ||
                employeeId.includes(search) ||
                reason.includes(search) ||
                leaveType.includes(search)

            const matchesStatus =
                statusFilter === 'all' || request.status === statusFilter

            const matchesDate =
                !leaveDate ||
                (request.startDate <= leaveDate && request.endDate >= leaveDate)

            return matchesSearch && matchesStatus && matchesDate
        })
    }, [requests, searchTerm, statusFilter, leaveDate])

    const totalPages = Math.max(1, Math.ceil(filteredRequests.length / PAGE_SIZE))
    const safePage = Math.min(currentPage, totalPages)
    const paginatedRequests = filteredRequests.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE
    )

    const pendingCount = requests.filter(item => item.status === 'pending').length
    const approvedCount = requests.filter(item => item.status === 'approved').length
    const rejectedCount = requests.filter(item => item.status === 'rejected').length

    const handleResetFilters = () => {
        setSearchTerm('')
        setStatusFilter('all')
        setLeaveDate('')
        setCurrentPage(1)
        closeActionMenu()
    }

    const handleRefreshPreview = () => {
        setRequests(INITIAL_LEAVE_REQUESTS)
        handleResetFilters()
    }

    const handleSearchChange = value => {
        setSearchTerm(value)
        setCurrentPage(1)
        closeActionMenu()
    }

    const handleStatusChange = value => {
        setStatusFilter(value)
        setCurrentPage(1)
        closeActionMenu()
    }

    const handleDateChange = value => {
        setLeaveDate(value)
        setCurrentPage(1)
        closeActionMenu()
    }

    const toggleActionMenu = (event, request) => {
        event.preventDefault()
        event.stopPropagation()

        if (openActionId === request._id) {
            closeActionMenu()
            return
        }

        const rect = event.currentTarget.getBoundingClientRect()
        const menuWidth = 190
        const menuHeight = request.status === 'pending' ? 145 : 55

        let left = rect.right - menuWidth
        let top = rect.bottom + 6

        left = Math.max(8, Math.min(left, window.innerWidth - menuWidth - 8))

        if (top + menuHeight > window.innerHeight - 8) {
            top = rect.top - menuHeight - 6
        }

        top = Math.max(8, top)
        setMenuPosition({ top, left })
        setOpenActionId(request._id)
    }

    const handleViewDetails = request => {
        closeActionMenu()
        setSelectedRequest(request)
        setShowDetailsModal(true)
    }

    const closeDetailsModal = () => {
        setShowDetailsModal(false)
        setSelectedRequest(null)
    }

    // UI preview only: this updates local component state and does not call an API.
    const handleApprove = request => {
        setRequests(previous =>
            previous.map(item =>
                item._id === request._id
                    ? { ...item, status: 'approved' }
                    : item
            )
        )

        setSelectedRequest(previous =>
            previous?._id === request._id
                ? { ...previous, status: 'approved' }
                : previous
        )

        closeActionMenu()
    }
    const openRejectModal = request => {
        closeActionMenu()
        setRejectRequestId(request._id)
        setRejectionReason('')
        setShowRejectModal(true)
    }

    const closeRejectModal = () => {
        setShowRejectModal(false)
        setRejectRequestId(null)
        setRejectionReason('')
    }

    // UI preview only: rejection is stored locally for this page preview.
    const handleReject = () => {
        if (!rejectionReason.trim()) return

        const reason = rejectionReason.trim()

        setRequests(previous =>
            previous.map(item =>
                item._id === rejectRequestId
                    ? {
                        ...item,
                        status: 'rejected',
                        rejectionReason: reason
                    }
                    : item
            )
        )

        setSelectedRequest(previous =>
            previous?._id === rejectRequestId
                ? {
                    ...previous,
                    status: 'rejected',
                    rejectionReason: reason
                }
                : previous
        )

        closeRejectModal()
    }

    const activeRejectRequest = requests.find(
        request => request._id === rejectRequestId
    )

    return (
        <div className='mx-auto w-full max-w-[1500px] space-y-5 py-2'>
            {/* HEADER */}
            <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-900'>Leave Requests</h1>
                    <p className='mt-1 text-sm text-gray-500'>
                        Review and manage employee leave applications.
                    </p>
                </div>

                <button
                    type='button'
                    onClick={handleRefreshPreview}
                    className='inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50'
                >
                    <RefreshCw size={17} />
                    Reset Preview
                </button>
            </div>

            {/* SUMMARY */}
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
                <div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-xs font-medium text-gray-500'>Pending</p>
                            <p className='mt-1 text-2xl font-bold text-gray-900'>
                                {pendingCount}
                            </p>
                        </div>
                        <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600'>
                            <Clock3 size={21} />
                        </div>
                    </div>
                </div>

                <div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-xs font-medium text-gray-500'>Approved</p>
                            <p className='mt-1 text-2xl font-bold text-gray-900'>
                                {approvedCount}
                            </p>
                        </div>
                        <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600'>
                            <CheckCircle2 size={21} />
                        </div>
                    </div>
                </div>

                <div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-xs font-medium text-gray-500'>Rejected</p>
                            <p className='mt-1 text-2xl font-bold text-gray-900'>
                                {rejectedCount}
                            </p>
                        </div>
                        <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600'>
                            <XCircle size={21} />
                        </div>
                    </div>
                </div>
            </div>

            {/* FILTER SECTION */}
            <div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5'>
                <div className='grid grid-cols-1 gap-3 lg:grid-cols-12'>
                    <div className='relative lg:col-span-6'>
                        <Search
                            size={18}
                            className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'
                        />
                        <input
                            type='text'
                            value={searchTerm}
                            onChange={event => handleSearchChange(event.target.value)}
                            placeholder='Search employee, ID or leave type...'
                            className='h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                        />
                    </div>

                    <div className='lg:col-span-3'>
                        <select
                            value={statusFilter}
                            onChange={event => handleStatusChange(event.target.value)}
                            className='h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                        >
                            <option value='all'>All Status</option>
                            <option value='pending'>Pending</option>
                            <option value='approved'>Approved</option>
                            <option value='rejected'>Rejected</option>
                        </select>
                    </div>

                    <div className='relative lg:col-span-3'>
                        <CalendarDays
                            size={18}
                            className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'
                        />
                        <input
                            type='date'
                            value={leaveDate}
                            onChange={event => handleDateChange(event.target.value)}
                            className='h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                            title='Filter by leave date'
                        />
                    </div>
                </div>

                <div className='mt-4 flex flex-col justify-between gap-2 border-t border-gray-100 pt-3 sm:flex-row sm:items-center'>
                    <p className='text-xs text-gray-500'>
                        {leaveDate
                            ? `Showing leave requests that include ${formatDate(leaveDate)}.`
                            : 'Filter requests by employee, status or leave date.'}
                    </p>
                    <button
                        type='button'
                        onClick={handleResetFilters}
                        className='text-left text-sm font-medium text-blue-600 transition hover:text-blue-800 sm:text-right'
                    >
                        Reset Filters
                    </button>
                </div>
            </div>

            {/* TABLE */}
            <div className='rounded-2xl border border-gray-200 bg-white shadow-sm'>
                <div className='flex flex-col justify-between gap-2 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center'>
                    <div>
                        <h2 className='font-semibold text-gray-900'>Employee Leave Applications</h2>
                        <p className='mt-1 text-xs text-gray-500'>
                            {filteredRequests.length} leave request
                            {filteredRequests.length === 1 ? '' : 's'} found
                        </p>
                    </div>

                    {leaveDate && (
                        <span className='inline-flex w-fit items-center rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700'>
                            {formatDate(leaveDate)}
                        </span>
                    )}
                </div>

                <div className='w-full overflow-x-auto'>
                    <table className='w-full min-w-[1100px] table-fixed text-left'>
                        <colgroup>
                            <col className='w-[21%]' />
                            <col className='w-[14%]' />
                            <col className='w-[19%]' />
                            <col className='w-[8%]' />
                            <col className='w-[15%]' />
                            <col className='w-[15%]' />
                            <col className='w-[8%]' />
                        </colgroup>

                        <thead className='bg-gray-50'>
                            <tr className='border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500'>
                                <th className='px-5 py-4'>Employee</th>
                                <th className='px-5 py-4'>Leave Type</th>
                                <th className='px-5 py-4'>Leave Duration</th>
                                <th className='px-5 py-4'>Days</th>
                                <th className='px-5 py-4'>Reason</th>
                                <th className='px-5 py-4'>Request Status</th>
                                <th className='px-5 py-4 text-center'>Action</th>
                            </tr>
                        </thead>

                        <tbody className='divide-y divide-gray-100'>
                            {paginatedRequests.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className='px-5 py-16 text-center'>
                                        <FileText size={36} className='mx-auto text-gray-300' />
                                        <p className='mt-3 font-medium text-gray-700'>
                                            No leave requests found
                                        </p>
                                        <p className='mt-1 text-sm text-gray-500'>
                                            Try changing your search or filter criteria.
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedRequests.map(request => (
                                    <tr key={request._id} className='transition hover:bg-gray-50'>
                                        <td className='px-5 py-4'>
                                            <div className='flex min-w-0 items-center gap-3'>

                                                <div className='h-11 w-11 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-blue-50'>
                                                    {(
                                                        request.employee?.profileImage ||
                                                        request.employee?.profilePicture ||
                                                        request.employee?.avatar ||
                                                        request.employee?.image
                                                    ) ? (
                                                        <img
                                                            src={
                                                                request.employee?.profileImage ||
                                                                request.employee?.profilePicture ||
                                                                request.employee?.avatar ||
                                                                request.employee?.image
                                                            }
                                                            alt={getEmployeeName(request.employee)}
                                                            className='h-full w-full rounded-full object-cover'
                                                        />
                                                    ) : (
                                                        <div className='flex h-full w-full items-center justify-center text-sm font-semibold text-blue-600'>
                                                            {getInitials(request.employee)}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className='min-w-0'>
                                                    <p
                                                        className='truncate text-sm font-semibold text-gray-800'
                                                        title={getEmployeeName(request.employee)}
                                                    >
                                                        {getEmployeeName(request.employee)}
                                                    </p>
                                                    <p className='mt-1 truncate text-xs text-gray-500'>
                                                        ID: {getEmployeeId(request.employee)}
                                                    </p>
                                                    <p className='mt-0.5 truncate text-xs text-gray-400'>
                                                        {getDepartmentName(request.employee)}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className='px-5 py-4'>
                                            <span
                                                className={`inline-flex whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium ${getLeaveTypeClass(
                                                    request.leaveType
                                                )}`}
                                            >
                                                {request.leaveType || '-'}
                                            </span>
                                        </td>

                                        <td className='px-5 py-4'>
                                            <p className='text-sm font-medium text-gray-700'>
                                                {formatDate(request.startDate)}
                                            </p>
                                            <p className='mt-1 text-xs text-gray-500'>
                                                to {formatDate(request.endDate)}
                                            </p>
                                        </td>

                                        <td className='px-5 py-4 text-sm font-semibold text-gray-700'>
                                            {request.days || '-'}
                                        </td>

                                        <td className='px-5 py-4'>
                                            <p
                                                className='truncate text-sm text-gray-600'
                                                title={request.reason || ''}
                                            >
                                                {request.reason || '-'}
                                            </p>
                                        </td>

                                        <td className='px-5 py-4'>
                                            <span
                                                className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusClass(
                                                    request.status
                                                )}`}
                                            >
                                                {request.status || 'Pending'}
                                            </span>
                                        </td>

                                        <td className='px-5 py-4 text-center'>
                                            <button
                                                type='button'
                                                onClick={event => toggleActionMenu(event, request)}
                                                className='inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800'
                                                aria-label='Open leave request actions'
                                            >
                                                <MoreVertical size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {filteredRequests.length > 0 && (
                    <div className='flex flex-col justify-between gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center'>
                        <p className='text-xs text-gray-500'>
                            Showing {(safePage - 1) * PAGE_SIZE + 1}–
                            {Math.min(safePage * PAGE_SIZE, filteredRequests.length)} of{' '}
                            {filteredRequests.length} requests
                        </p>
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


            {/* ACTION MENU */}
            {openActionId &&
                menuPosition &&
                createPortal(
                    <>
                        <button
                            type='button'
                            aria-label='Close action menu'
                            className='fixed inset-0 z-[9998] cursor-default'
                            onClick={closeActionMenu}
                        />

                        <div
                            className='fixed z-[9999] w-30 overflow-hidden rounded-xl border border-gray-200 bg-white py-1.5 shadow-2xl'
                            style={{
                                top: menuPosition.top,
                                left: menuPosition.left
                            }}
                        >
                            {(() => {
                                const request = requests.find(
                                    item => item._id === openActionId
                                )

                                if (!request) return null

                                const isPending =
                                    String(request.status || 'pending').toLowerCase() === 'pending'

                                return (
                                    <>
                                        {/* VIEW - Always visible */}
                                        <button
                                            type='button'
                                            onClick={() => {
                                                handleViewDetails(request)
                                                closeActionMenu()
                                            }}
                                            className='flex w-full items-center gap-3 px-3 py-1 text-sm text-gray-700 transition hover:bg-gray-50'
                                        >
                                            <Eye size={17} />
                                            View
                                        </button>

                                        {/* APPROVE AND REJECT - Only for pending requests */}
                                        {isPending && (
                                            <>
                                                <button
                                                    type='button'
                                                    onClick={() => handleApprove(request)}
                                                    className='flex w-full items-center gap-3 px-3 py-1 text-sm text-green-700 transition hover:bg-green-50'
                                                >
                                                    <CheckCircle2 size={17} />
                                                    Approve
                                                </button>

                                                <button
                                                    type='button'
                                                    onClick={() => openRejectModal(request)}
                                                    className='flex w-full items-center gap-3 px-3 py-1 text-sm text-red-600 transition hover:bg-red-50'
                                                >
                                                    <XCircle size={17} />
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </>
                                )
                            })()}
                        </div>
                    </>,
                    document.body
                )}


            {/* DETAILS MODAL */}
            <Modal
                isOpen={showDetailsModal}
                onClose={closeDetailsModal}
                title='Leave Request Details'
                size='lg'
            >
                {selectedRequest && (
                    <div className='space-y-5'>
                        <div className='flex items-center gap-3 rounded-xl bg-gray-50 p-4'>
                            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700'>
                                {getInitials(selectedRequest.employee)}
                            </div>
                            <div className='min-w-0'>
                                <p className='font-semibold text-gray-900'>
                                    {getEmployeeName(selectedRequest.employee)}
                                </p>
                                <p className='mt-1 text-xs text-gray-500'>
                                    {getEmployeeId(selectedRequest.employee)} ·{' '}
                                    {getDepartmentName(selectedRequest.employee)}
                                </p>
                            </div>
                            <span
                                className={`ml-auto inline-flex rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusClass(
                                    selectedRequest.status
                                )}`}
                            >
                                {selectedRequest.status}
                            </span>
                        </div>

                        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                            <div className='rounded-xl border border-gray-100 p-4'>
                                <p className='text-xs text-gray-500'>Leave Type</p>
                                <p className='mt-1 text-sm font-semibold text-gray-800'>
                                    {selectedRequest.leaveType}
                                </p>
                            </div>
                            <div className='rounded-xl border border-gray-100 p-4'>
                                <p className='text-xs text-gray-500'>Total Days</p>
                                <p className='mt-1 text-sm font-semibold text-gray-800'>
                                    {selectedRequest.days}
                                </p>
                            </div>
                            <div className='rounded-xl border border-gray-100 p-4'>
                                <p className='text-xs text-gray-500'>From Date</p>
                                <p className='mt-1 text-sm font-semibold text-gray-800'>
                                    {formatDate(selectedRequest.startDate)}
                                </p>
                            </div>
                            <div className='rounded-xl border border-gray-100 p-4'>
                                <p className='text-xs text-gray-500'>To Date</p>
                                <p className='mt-1 text-sm font-semibold text-gray-800'>
                                    {formatDate(selectedRequest.endDate)}
                                </p>
                            </div>
                            <div className='rounded-xl border border-gray-100 p-4 sm:col-span-2'>
                                <p className='text-xs text-gray-500'>Reason for Leave</p>
                                <p className='mt-1 text-sm leading-6 text-gray-700'>
                                    {selectedRequest.reason || '-'}
                                </p>
                            </div>
                            <div className='rounded-xl border border-gray-100 p-4 sm:col-span-2'>
                                <p className='text-xs text-gray-500'>Submitted On</p>
                                <p className='mt-1 text-sm font-semibold text-gray-800'>
                                    {formatDateTime(selectedRequest.createdAt)}
                                </p>
                            </div>
                            {selectedRequest.rejectionReason && (
                                <div className='rounded-xl border border-red-100 bg-red-50 p-4 sm:col-span-2'>
                                    <p className='text-xs font-medium text-red-600'>
                                        Rejection Reason
                                    </p>
                                    <p className='mt-1 text-sm text-red-700'>
                                        {selectedRequest.rejectionReason}
                                    </p>
                                </div>
                            )}
                        </div>


                        <div className='flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4'>

                            {/* APPROVE AND REJECT - Only for pending requests */}
                            {String(selectedRequest.status || 'pending').toLowerCase() === 'pending' && (
                                <>
                                    <button
                                        type='button'
                                        onClick={() => handleApprove(selectedRequest)}
                                        className='inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700'
                                    >
                                        <CheckCircle2 size={17} />
                                        Approve
                                    </button>

                                    <button
                                        type='button'
                                        onClick={() => openRejectModal(selectedRequest)}
                                        className='inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700'
                                    >
                                        <XCircle size={17} />
                                        Reject
                                    </button>
                                </>
                            )}

                            <button
                                type='button'
                                onClick={closeDetailsModal}
                                className='rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50'
                            >
                                Close
                            </button>
                        </div>

                    </div>
                )}
            </Modal>

            {/* REJECT MODAL */}
            <Modal
                isOpen={showRejectModal}
                onClose={closeRejectModal}
                title='Reject Leave Request'
                size='md'
            >
                <div className='space-y-4'>
                    <div className='rounded-xl border border-red-100 bg-red-50 p-4'>
                        <p className='text-sm font-semibold text-red-800'>
                            Reject leave application
                        </p>
                        <p className='mt-1 text-xs leading-5 text-red-700'>
                            {activeRejectRequest
                                ? `${getEmployeeName(activeRejectRequest.employee)} · ${activeRejectRequest.leaveType}`
                                : 'Please provide a reason for rejecting this request.'}
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor='leave-rejection-reason'
                            className='mb-2 block text-sm font-medium text-gray-700'
                        >
                            Rejection Reason <span className='text-red-500'>*</span>
                        </label>
                        <textarea
                            id='leave-rejection-reason'
                            rows={4}
                            value={rejectionReason}
                            onChange={event => setRejectionReason(event.target.value)}
                            placeholder='Enter the reason for rejection...'
                            className='w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                        />
                    </div>

                    <div className='flex justify-end gap-2 border-t border-gray-100 pt-4'>
                        <button
                            type='button'
                            onClick={closeRejectModal}
                            className='rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50'
                        >
                            Cancel
                        </button>
                        <button
                            type='button'
                            onClick={handleReject}
                            disabled={!rejectionReason.trim()}
                            className='rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50'
                        >
                            Confirm Rejection
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default LeaveRequests
