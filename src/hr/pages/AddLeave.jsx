
import { useMemo, useState } from 'react'
import { Search, Plus, Pencil } from 'lucide-react'

import Modal from '../../UI/Modal.jsx'
import Pagination from '../../UI/Pagination.jsx'

const PAGE_SIZE = 4

// Employee Data
const initialEmployees = [
    {
        id: 'EMP-1024',
        name: 'Rahul Kumar',
        department: 'Engineering',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        leaveYear: 2026,
        leave: {
            cl: { total: 12, left: 4, used: 8 },
            sl: { total: 8, left: 1, used: 7 },
            wfh: { total: 10, left: 4, used: 6 },
        },
    },
    {
        id: 'EMP-1025',
        name: 'Priya Sharma',
        department: 'Sales',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
        leaveYear: 2026,
        leave: {
            cl: { total: 14, left: 4, used: 10 },
            sl: { total: 10, left: 2, used: 8 },
            wfh: { total: 12, left: 3, used: 9 },
        },
    },
    {
        id: 'EMP-1026',
        name: 'Amit Singh',
        department: 'Product',
        image: 'https://randomuser.me/api/portraits/men/46.jpg',
        leaveYear: 2026,
        leave: {
            cl: { total: 15, left: 4, used: 11 },
            sl: { total: 10, left: 2, used: 8 },
            wfh: { total: 28, left: 4, used: 24 },
        },
    },
    {
        id: 'EMP-1027',
        name: 'Neha Gupta',
        department: 'HR',
        image: 'https://randomuser.me/api/portraits/women/68.jpg',
        leaveYear: 2026,
        leave: {
            cl: { total: 14, left: 4, used: 10 },
            sl: { total: 10, left: 2, used: 8 },
            wfh: { total: 30, left: 4, used: 26 },
        },
    },
    {
        id: 'EMP-1026',
        name: 'Amit Singh',
        department: 'Product',
        image: 'https://randomuser.me/api/portraits/men/46.jpg',
        leaveYear: 2026,
        leave: {
            cl: { total: 15, left: 4, used: 11 },
            sl: { total: 10, left: 2, used: 8 },
            wfh: { total: 28, left: 4, used: 24 },
        },
    },
    {
        id: 'EMP-1026',
        name: 'Amit Singh',
        department: 'Product',
        image: 'https://randomuser.me/api/portraits/men/46.jpg',
        leaveYear: 2026,
        leave: {
            cl: { total: 15, left: 4, used: 11 },
            sl: { total: 10, left: 2, used: 8 },
            wfh: { total: 28, left: 4, used: 24 },
        },
    },
    {
        id: 'EMP-1026',
        name: 'Amit Singh',
        department: 'Product',
        image: 'https://randomuser.me/api/portraits/men/46.jpg',
        leaveYear: 2026,
        leave: {
            cl: { total: 15, left: 4, used: 11 },
            sl: { total: 10, left: 2, used: 8 },
            wfh: { total: 28, left: 4, used: 24 },
        },
    },
    {
        id: 'EMP-1026',
        name: 'Amit Singh',
        department: 'Product',
        image: 'https://randomuser.me/api/portraits/men/46.jpg',
        leaveYear: 2026,
        leave: {
            cl: { total: 15, left: 4, used: 11 },
            sl: { total: 10, left: 2, used: 8 },
            wfh: { total: 28, left: 4, used: 24 },
        },
    },
    {
        id: 'EMP-1026',
        name: 'Amit Singh',
        department: 'Product',
        image: 'https://randomuser.me/api/portraits/men/46.jpg',
        leaveYear: 2026,
        leave: {
            cl: { total: 15, left: 4, used: 11 },
            sl: { total: 10, left: 2, used: 8 },
            wfh: { total: 28, left: 4, used: 24 },
        },
    },
    {
        id: 'EMP-1026',
        name: 'Amit Singh',
        department: 'Product',
        image: 'https://randomuser.me/api/portraits/men/46.jpg',
        leaveYear: 2026,
        leave: {
            cl: { total: 15, left: 4, used: 11 },
            sl: { total: 10, left: 2, used: 8 },
            wfh: { total: 28, left: 4, used: 24 },
        },
    },
    
]

// Leave Balance Cell

const LeaveCell = ({ balance }) => {
    return (
        <div className="flex w-full flex-col items-center justify-center gap-1">
            <p className="text-base font-semibold leading-5 text-slate-900">
                {balance.total}
            </p>

            <p className="whitespace-nowrap text-xs leading-4 text-slate-500">
                {balance.left} left • {balance.used} used
            </p>
        </div>
    )
}

// Reusable Leave Form
const LeaveForm = ({
    employee,
    form,
    setForm,
    onSubmit,
    onCancel,
    mode,
}) => {
    return (
        <form onSubmit={onSubmit} className="space-y-5">

            {/* Employee Details */}
            <div className="rounded-xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">

                    <img
                        src={employee.image}
                        alt={employee.name}
                        className="h-12 w-12 rounded-full object-cover"
                    />

                    <div>
                        <p className="font-semibold text-slate-900">
                            {employee.name}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            {employee.id} · {employee.department}
                        </p>
                    </div>

                </div>
            </div>

            {/* Year */}
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Year
                </label>

                <input
                    type="number"
                    min="2000"
                    max="2100"
                    required
                    value={form.year}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            year: e.target.value,
                        })
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-slate-800 outline-none transition focus:border-gray-500"
                />
            </div>

            {/* Sick Leave */}
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Sick Leave
                </label>

                <input
                    type="number"
                    min="0"
                    required
                    value={form.sickLeave}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            sickLeave: e.target.value,
                        })
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-slate-800 outline-none transition focus:border-gray-500"
                />
            </div>

            {/* Casual Leave */}
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Casual Leave
                </label>

                <input
                    type="number"
                    min="0"
                    required
                    value={form.casualLeave}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            casualLeave: e.target.value,
                        })
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-slate-800 outline-none transition focus:border-gray-500"
                />
            </div>

            {/* Work From Home */}
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Work From Home
                </label>

                <input
                    type="number"
                    min="0"
                    required
                    value={form.workFromHome}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            workFromHome: e.target.value,
                        })
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-slate-800 outline-none transition focus:border-gray-500"
                />
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">

                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                    {mode === 'add' ? 'Add Leave' : 'Save Changes'}
                </button>

            </div>

        </form>
    )
}


// Main Add Leave Page
const AddLeave = ({ onManageLeave }) => {

    const [employees, setEmployees] = useState(initialEmployees)

    // Search and Filter
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedDepartment, setSelectedDepartment] =
        useState('All Departments')

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)

    // Modal States
    const [addModalOpen, setAddModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)

    const [selectedEmployee, setSelectedEmployee] = useState(null)

    // Form State
    const [leaveForm, setLeaveForm] = useState({
        year: new Date().getFullYear(),
        sickLeave: 10,
        casualLeave: 12,
        workFromHome: 12,
    })


    // Department Options
    const departments = useMemo(() => {
        return [
            'All Departments',
            ...new Set(employees.map((emp) => emp.department)),
        ]
    }, [employees])


    // Search and Department Filter
    const filteredEmployees = useMemo(() => {

        return employees.filter((employee) => {

            const query = searchTerm.toLowerCase().trim()

            const matchesSearch =
                employee.name.toLowerCase().includes(query) ||
                employee.id.toLowerCase().includes(query) ||
                employee.department.toLowerCase().includes(query)

            const matchesDepartment =
                selectedDepartment === 'All Departments' ||
                employee.department === selectedDepartment

            return matchesSearch && matchesDepartment

        })

    }, [employees, searchTerm, selectedDepartment])


    // Pagination
    const totalPages = Math.ceil(
        filteredEmployees.length / PAGE_SIZE
    )

    const startIndex = (currentPage - 1) * PAGE_SIZE

    const paginatedEmployees = filteredEmployees.slice(
        startIndex,
        startIndex + PAGE_SIZE
    )

    const showingFrom =
        filteredEmployees.length === 0 ? 0 : startIndex + 1

    const showingTo = Math.min(
        startIndex + PAGE_SIZE,
        filteredEmployees.length
    )


    // Handle Search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1)
    }


    // Handle Department Filter
    const handleDepartmentFilter = (e) => {
        setSelectedDepartment(e.target.value)
        setCurrentPage(1)
    }


    // Open Add Leave Modal
    const handleAddLeave = (employee) => {

        setSelectedEmployee(employee)

        setLeaveForm({
            year: new Date().getFullYear(),
            sickLeave: 10,
            casualLeave: 12,
            workFromHome: 12,
        })

        setAddModalOpen(true)
    }


    // Open Edit Leave Modal
    const handleEditLeave = (employee) => {

        setSelectedEmployee(employee)

        setLeaveForm({
            year: employee.leaveYear,
            sickLeave: employee.leave.sl.total,
            casualLeave: employee.leave.cl.total,
            workFromHome: employee.leave.wfh.total,
        })

        setEditModalOpen(true)
    }


    // Close Both Modals
    const closeModals = () => {
        setAddModalOpen(false)
        setEditModalOpen(false)
        setSelectedEmployee(null)
    }


    // Handle Add and Edit Submission
    const handleLeaveSubmit = (e, mode) => {

        e.preventDefault()

        if (!selectedEmployee) return

        const payload = {
            year: Number(leaveForm.year),
            sickLeave: Number(leaveForm.sickLeave),
            casualLeave: Number(leaveForm.casualLeave),
            workFromHome: Number(leaveForm.workFromHome),
        }

        // Update employee leave allocation
        setEmployees((prev) =>
            prev.map((employee) => {

                if (employee.id !== selectedEmployee.id) {
                    return employee
                }

                const isNewYear =
                    mode === 'add' &&
                    payload.year !== employee.leaveYear

                const updateBalance = (type, total) => {

                    const current = employee.leave[type]

                    const used = isNewYear ? 0 : current.used

                    return {
                        total,
                        used,
                        left: Math.max(0, total - used),
                    }
                }

                return {
                    ...employee,

                    leaveYear: payload.year,

                    leave: {
                        cl: updateBalance(
                            'cl',
                            payload.casualLeave
                        ),

                        sl: updateBalance(
                            'sl',
                            payload.sickLeave
                        ),

                        wfh: updateBalance(
                            'wfh',
                            payload.workFromHome
                        ),
                    },
                }

            })
        )

        // Exact payload for backend API
        console.log('Employee ID:', selectedEmployee.id)
        console.log('Leave Payload:', payload)

        closeModals()
    }


    return (

        <div className="min-h-screen bg-[#f7f9fc] px-4 sm:px-8">

            <div className="mx-auto max-w-375">

                {/* Page Header */}
                <div className="mb-7 flex flex-wrap items-center justify-between gap-4">

                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">
                            Add Leave
                        </h1>

                        <p className="text-slate-500">
                            Create leave for employees or manage leave balance
                        </p>
                    </div>

                    {onManageLeave && (
                        <button
                            onClick={onManageLeave}
                            className="flex items-center gap-2 rounded-2xl bg-black px-6 py-4 font-medium text-white transition hover:bg-gray-800"
                        >
                            <Plus size={20} />
                            Manage Leave
                        </button>
                    )}

                </div>


                {/* Search and Filter */}
                <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-5">

                    <div className="flex flex-col gap-4 md:flex-row">

                        {/* Search */}
                        <div className="relative w-full md:max-w-195">

                            <Search
                                size={22}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                placeholder="Search by employee name or department name..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-14 pr-4 text-base text-slate-800 outline-none transition focus:border-slate-400"
                            />

                        </div>

                        {/* Department Filter */}
                        <select
                            value={selectedDepartment}
                            onChange={handleDepartmentFilter}
                            className="w-full cursor-pointer rounded-2xl border border-gray-200 bg-white px-5 py-4 text-base text-slate-800 outline-none focus:border-slate-400 md:w-[320px]"
                        >
                            {departments.map((department) => (
                                <option
                                    key={department}
                                    value={department}
                                >
                                    {department === 'All Departments'
                                        ? 'Filter by Departments'
                                        : department}
                                </option>
                            ))}
                        </select>

                    </div>

                </div>

                {/* Employee Table */}
                <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                    {/* Scrollable Table Wrapper */}
                    <div className="w-full overflow-x-auto overscroll-x-contain touch-pan-x">

                        <table className="w-full min-w-[900px] table-fixed border-collapse lg:min-w-full">

                            {/* Column Widths */}
                            <colgroup>
                                <col className="w-[30%]" />
                                <col className="w-[14%]" />
                                <col className="w-[14%]" />
                                <col className="w-[20%]" />
                                <col className="w-[22%]" />
                            </colgroup>

                            {/* Table Header */}
                            <thead>
                                <tr className="h-[58px] border-b border-gray-200 bg-gray-50/70">

                                    <th className="px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Employee
                                    </th>

                                    <th className="px-1 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Casual Leave
                                    </th>

                                    <th className="px-1 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Sick Leave
                                    </th>

                                    <th className="px-1 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Work From Home
                                    </th>

                                    <th className="px-1 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Action
                                    </th>

                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody>
                                {paginatedEmployees.length > 0 ? (
                                    paginatedEmployees.map((employee) => (
                                        <tr
                                            key={employee.id}
                                            className="h-[88px] border-b border-gray-100 transition-colors last:border-0 hover:bg-slate-50/70"
                                        >

                                            {/* Employee */}
                                            <td className="px-4 py-3 align-middle">
                                                <div className="flex min-w-0 items-center gap-3">

                                                    <img
                                                        src={employee.image}
                                                        alt={employee.name}
                                                        className="h-10 w-10 shrink-0 rounded-full border border-gray-100 object-cover"
                                                    />

                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold leading-5 text-slate-900">
                                                            {employee.name}
                                                        </p>

                                                        <p className="mt-1 truncate text-xs leading-5 text-slate-500">
                                                            {employee.id}
                                                        </p>
                                                    </div>

                                                </div>
                                            </td>

                                            {/* Casual Leave */}
                                            <td className="px-1 py-3 align-middle">
                                                <LeaveCell balance={employee.leave.cl} />
                                            </td>

                                            {/* Sick Leave */}
                                            <td className="px-1 py-3 align-middle">
                                                <LeaveCell balance={employee.leave.sl} />
                                            </td>

                                            {/* Work From Home */}
                                            <td className="px-1 py-3 align-middle">
                                                <LeaveCell balance={employee.leave.wfh} />
                                            </td>

                                            {/* Actions */}
                                            <td className="px-1 py-3 align-middle">
                                                <div className="flex items-center justify-center gap-1.5">

                                                    <button
                                                        onClick={() => handleAddLeave(employee)}
                                                        className="flex px-5 py-2 shrink-0 items-center justify-center gap-1 rounded-full bg-[#e9efff] text-[10px] font-semibold text-slate-900 transition hover:bg-[#d4ddf6]"
                                                    >
                                                        <Plus size={12} />
                                                        Add
                                                    </button>

                                                    <button
                                                        onClick={() => handleEditLeave(employee)}
                                                        className="flex px-5 py-2 shrink-0 items-center justify-center gap-1 rounded-full border border-gray-300 text-[10px] font-medium text-slate-800 transition hover:border-black hover:bg-black hover:text-white"
                                                    >
                                                        <Pencil size={12} />
                                                        Edit
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="py-16 text-center text-sm text-slate-500"
                                        >
                                            No employees found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="flex items-center justify-center border-t border-gray-100 px-3 py-3 sm:px-5">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>

                </div>


            </div>


            {/* ================================= */}
            {/* ADD LEAVE MODAL */}
            {/* ================================= */}

            <Modal
                isOpen={addModalOpen}
                onClose={closeModals}
                title="Add Leave"
                size="md"
            >

                {selectedEmployee && (

                    <LeaveForm
                        employee={selectedEmployee}
                        form={leaveForm}
                        setForm={setLeaveForm}
                        mode="add"
                        onCancel={closeModals}
                        onSubmit={(e) => handleLeaveSubmit(e, 'add')}
                    />

                )}

            </Modal>


            {/* ================================= */}
            {/* EDIT LEAVE MODAL */}
            {/* ================================= */}

            <Modal
                isOpen={editModalOpen}
                onClose={closeModals}
                title="Edit Leave"
                size="md"
            >

                {selectedEmployee && (

                    <LeaveForm
                        employee={selectedEmployee}
                        form={leaveForm}
                        setForm={setLeaveForm}
                        mode="edit"
                        onCancel={closeModals}
                        onSubmit={(e) => handleLeaveSubmit(e, 'edit')}
                    />

                )}

            </Modal>

        </div>

    )
}

export default AddLeave
