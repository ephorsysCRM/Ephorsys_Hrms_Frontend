import { useEffect, useMemo, useState } from 'react'
import { Search, Plus, Pencil } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

import Modal from '../../UI/Modal'
import Pagination from '../../UI/Pagination'

import { getAllEmployees } from '../../redux/features/employee/employeeThunk'

import AddLeaveModal from '../hrModals/AddLeaveModal'
import EditLeaveModal from '../hrModals/EditLeaveModal'

const AddLeave = ({ onManageLeave }) => {
  const dispatch = useDispatch()

  // =====================================================
  // REDUX STATE
  // =====================================================

  const {
    employees,
    pagination,
    getAllEmployeesLoading,
    getAllEmployeesError
  } = useSelector(state => state.employee)

  // =====================================================
  // LOCAL STATES
  // =====================================================

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] =
    useState('All Departments')

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const [selectedEmployee, setSelectedEmployee] = useState(null)

  // =====================================================
  // PAGINATION
  // =====================================================

  const currentPage = pagination?.currentPage || 1
  const limit = pagination?.limit || 10
  const totalPages = pagination?.totalPages || 0

  // =====================================================
  // FETCH EMPLOYEES
  // =====================================================

  useEffect(() => {
    dispatch(getAllEmployees(currentPage, limit))
  }, [dispatch, currentPage, limit])

  // =====================================================
  // FILTER HR DEPARTMENT EMPLOYEES
  // =====================================================

  const employeeList = useMemo(() => {
    return (employees || []).filter(employee => {
      const departmentName = String(employee.department?.name || '')
        .trim()
        .toLowerCase()

      // Do not show employees belonging to HR department
      return departmentName !== 'hr'
    })
  }, [employees])

  // =====================================================
  // EMPLOYEE NAME
  // =====================================================

  const getEmployeeName = employee => {
    return [employee.firstName, employee.middleName, employee.lastName]
      .filter(Boolean)
      .join(' ')
  }

  // =====================================================
  // EMPLOYEE INITIALS
  // =====================================================

  const getInitials = employee => {
    return getEmployeeName(employee)
      .split(' ')
      .filter(Boolean)
      .map(word => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  // =====================================================
  // DEPARTMENT OPTIONS
  // =====================================================

  const departments = useMemo(() => {
    const departmentNames = employeeList
      .map(employee => employee.department?.name)
      .filter(Boolean)

    return ['All Departments', ...new Set(departmentNames)]
  }, [employeeList])

  // =====================================================
  // GET EMPLOYEE LEAVE DETAILS
  // =====================================================

  const getEmployeeLeave = employee => {
    return (
      employee.leaveDetails?.find(
        leave => Number(leave.year) === Number(selectedYear)
      ) || null
    )
  }

  // =====================================================
  // SEARCH AND DEPARTMENT FILTER
  // =====================================================

  const filteredEmployees = useMemo(() => {
    return employeeList.filter(employee => {
      const query = searchTerm.toLowerCase().trim()

      const name = getEmployeeName(employee).toLowerCase()

      const employeeId = (employee.employeeId || '').toLowerCase()

      const department = (employee.department?.name || '').toLowerCase()

      const email = (
        employee.officialEmail ||
        employee.personalEmail ||
        ''
      ).toLowerCase()

      const matchesSearch =
        name.includes(query) ||
        employeeId.includes(query) ||
        department.includes(query) ||
        email.includes(query)

      const matchesDepartment =
        selectedDepartment === 'All Departments' ||
        employee.department?.name === selectedDepartment

      return matchesSearch && matchesDepartment
    })
  }, [employeeList, searchTerm, selectedDepartment])

  // =====================================================
  // OPEN ADD LEAVE MODAL
  // =====================================================

  const handleAddLeave = employee => {
    setSelectedEmployee(employee)
    setAddModalOpen(true)
  }

  // =====================================================
  // OPEN EDIT LEAVE MODAL
  // =====================================================

  const handleEditLeave = employee => {
    setSelectedEmployee(employee)
    setEditModalOpen(true)
  }

  // =====================================================
  // CLOSE MODALS
  // =====================================================

  const closeModals = () => {
    setAddModalOpen(false)
    setEditModalOpen(false)
    setSelectedEmployee(null)
  }

  // =====================================================
  // REFRESH EMPLOYEES
  // =====================================================

  const refreshEmployees = async () => {
    await dispatch(getAllEmployees(currentPage, limit))
  }

  // =====================================================
  // LEAVE CELL
  // =====================================================

  const LeaveCell = ({ balance }) => {
    if (!balance) {
      return (
        <div className='flex flex-col items-center justify-center gap-1'>
          <p className='text-base font-semibold text-slate-400'>-</p>

          <p className='whitespace-nowrap text-xs text-slate-400'>
            Not assigned
          </p>
        </div>
      )
    }

    return (
      <div className='flex w-full flex-col items-center justify-center gap-1'>
        <p className='text-base font-semibold leading-5 text-slate-900'>
          {balance.total ?? 0}
        </p>

        <p className='whitespace-nowrap text-xs leading-4 text-slate-500'>
          {balance.remaining ?? 0} left • {balance.used ?? 0} used
        </p>
      </div>
    )
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className='min-h-screen text-black'>
      {/* PAGE HEADER */}

      <div className='mb-7 flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h1 className='text-xl font-semibold sm:text-2xl'>Add Leave</h1>

          <p className='mt-1 text-sm text-gray-500'>
            Create leave for employees or manage leave balance
          </p>
        </div>

        {onManageLeave && (
          <button
            onClick={onManageLeave}
            className='flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800'
          >
            <Plus size={18} />
            Manage Leave
          </button>
        )}
      </div>

      {/* SEARCH AND FILTERS */}

      <div className='mb-4 rounded-xl border border-gray-200 bg-white p-2'>
        <div className='flex flex-col gap-2 md:flex-row md:items-center'>
          {/* SEARCH */}

          <div className='relative w-full flex-1'>
            <Search
              size={18}
              className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
            />

            <input
              type='text'
              placeholder='Search employee or department...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-gray-400 focus:bg-white'
            />
          </div>

          {/* DEPARTMENT */}

          <select
            value={selectedDepartment}
            onChange={e => setSelectedDepartment(e.target.value)}
            className='w-full cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none md:w-[220px]'
          >
            {departments.map(department => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>

          {/* YEAR */}

          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className='w-full cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none md:w-[120px]'
          >
            {[2025, 2026, 2027, 2028].map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* EMPLOYEE COUNT */}

      <p className='mb-3 text-sm text-gray-500'>
        {filteredEmployees.length}{' '}
        {filteredEmployees.length === 1 ? 'Employee' : 'Employees'}
      </p>

      {/* ERROR */}

      {getAllEmployeesError && (
        <div className='mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600'>
          {getAllEmployeesError}
        </div>
      )}

      {/* EMPLOYEE TABLE */}

      <div className='w-full overflow-hidden rounded-xl border border-gray-200 bg-white'>
        <div className='w-full overflow-x-auto'>
          <table className='w-full min-w-[900px] table-fixed border-collapse'>
            <colgroup>
              <col className='w-[30%]' />
              <col className='w-[14%]' />
              <col className='w-[14%]' />
              <col className='w-[20%]' />
              <col className='w-[22%]' />
            </colgroup>

            {/* TABLE HEADER */}

            <thead>
              <tr className='h-[58px] border-b border-gray-200 bg-gray-50'>
                <th className='px-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500'>
                  Employee
                </th>

                <th className='px-1 text-center text-xs font-semibold uppercase tracking-wide text-gray-500'>
                  Casual Leave
                </th>

                <th className='px-1 text-center text-xs font-semibold uppercase tracking-wide text-gray-500'>
                  Sick Leave
                </th>

                <th className='px-1 text-center text-xs font-semibold uppercase tracking-wide text-gray-500'>
                  Work From Home
                </th>

                <th className='px-1 text-center text-xs font-semibold uppercase tracking-wide text-gray-500'>
                  Action
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}

            <tbody>
              {getAllEmployeesLoading ? (
                <tr>
                  <td
                    colSpan='5'
                    className='py-16 text-center text-sm text-gray-500'
                  >
                    Loading employees...
                  </td>
                </tr>
              ) : filteredEmployees.length > 0 ? (
                filteredEmployees.map(employee => {
                  const leave = getEmployeeLeave(employee)

                  return (
                    <tr
                      key={employee._id}
                      className='h-[88px] border-b border-gray-100 transition-colors last:border-0 hover:bg-gray-50'
                    >
                      {/* EMPLOYEE */}

                      <td className='px-4 py-3 align-middle'>
                        <div className='flex min-w-0 items-center gap-3'>
                          {employee.profilePhoto ? (
                            <img
                              src={employee.profilePhoto}
                              alt={getEmployeeName(employee)}
                              className='h-10 w-10 shrink-0 rounded-full border border-gray-100 object-cover'
                            />
                          ) : (
                            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-xs font-semibold text-white'>
                              {getInitials(employee)}
                            </div>
                          )}

                          <div className='min-w-0'>
                            <p className='truncate text-sm font-semibold text-gray-900'>
                              {getEmployeeName(employee)}
                            </p>

                            <p className='mt-1 truncate text-xs text-gray-500'>
                              {employee.employeeId || '-'}
                            </p>

                            <p className='truncate text-xs text-gray-400'>
                              {employee.department?.name || '-'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CASUAL LEAVE */}

                      <td className='px-1 py-3 align-middle'>
                        <LeaveCell balance={leave?.casualLeave} />
                      </td>

                      {/* SICK LEAVE */}

                      <td className='px-1 py-3 align-middle'>
                        <LeaveCell balance={leave?.sickLeave} />
                      </td>

                      {/* WORK FROM HOME */}

                      <td className='px-1 py-3 align-middle'>
                        <LeaveCell balance={leave?.workFromHome} />
                      </td>

                      {/* ACTION */}

                      <td className='px-1 py-3 align-middle'>
                        <div className='flex items-center justify-center gap-2'>
                          {!leave ? (
                            <button
                              onClick={() => handleAddLeave(employee)}
                              className='flex shrink-0 items-center justify-center gap-1 rounded-full bg-[#e9efff] px-5 py-1.5 text-xs font-semibold text-slate-900 transition hover:bg-[#d4ddf6]'
                            >
                              <Plus size={13} />
                              Add
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEditLeave(employee)}
                              className='flex shrink-0 items-center justify-center gap-1 rounded-full border border-gray-300 px-5 py-1.5 text-xs font-medium text-slate-800 transition hover:border-black hover:bg-black hover:text-white'
                            >
                              <Pencil size={13} />
                              Edit
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td
                    colSpan='5'
                    className='py-16 text-center text-sm text-gray-500'
                  >
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}

      {totalPages > 0 && (
        <div className='mt-4'>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={page => {
              if (page >= 1 && page <= totalPages) {
                dispatch(getAllEmployees(page, limit))
              }
            }}
          />
        </div>
      )}

      {/* ADD LEAVE MODAL */}

      <Modal
        isOpen={addModalOpen}
        onClose={closeModals}
        title='Add Leave'
        size='md'
      >
        <AddLeaveModal
          employee={selectedEmployee}
          onClose={closeModals}
          onSubmit={refreshEmployees}
        />
      </Modal>

      {/* EDIT LEAVE MODAL */}

      <Modal
        isOpen={editModalOpen}
        onClose={closeModals}
        title='Edit Leave'
        size='md'
      >
        <EditLeaveModal
          employee={selectedEmployee}
          year={selectedYear}
          onClose={closeModals}
          onSubmit={refreshEmployees}
        />
      </Modal>
    </div>
  )
}

export default AddLeave
