import { Search, MoreHorizontal, Eye, Pencil, Users, Plus } from 'lucide-react'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Pagination from '../../UI/Pagination'
import { getAllEmployees } from '../../redux/features/employee/employeeThunk'

const ManageHR = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Redux
  const {
    employees = [],
    pagination = {},
    getAllEmployeesLoading,
    getAllEmployeesError
  } = useSelector(state => state.employee || {})

  // Local states
  const [search, setSearch] = useState('')
  const [openMenu, setOpenMenu] = useState(null)
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0
  })

  // Pagination
  const currentPage = pagination?.currentPage || 1
  const limit = pagination?.limit || 10
  const totalPages = pagination?.totalPages || 0
  const totalHR = pagination?.totalEmployees || 0

  // Fetch ONLY HR accounts
  useEffect(() => {
    dispatch(getAllEmployees(currentPage, limit, 'hr'))
  }, [dispatch, currentPage, limit])

  // Close dropdown on scroll or resize
  useEffect(() => {
    if (!openMenu) return

    const closeMenu = () => setOpenMenu(null)

    window.addEventListener('scroll', closeMenu, true)
    window.addEventListener('resize', closeMenu)

    return () => {
      window.removeEventListener('scroll', closeMenu, true)
      window.removeEventListener('resize', closeMenu)
    }
  }, [openMenu])

  // Open action dropdown using viewport coordinates
  const handleMenuClick = (event, employeeId) => {
    if (openMenu === employeeId) {
      setOpenMenu(null)
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()

    const menuWidth = 128
    const menuHeight = 88
    const gap = 6

    let left = rect.right - menuWidth
    let top = rect.bottom + gap

    // Prevent dropdown from going outside the viewport
    left = Math.max(8, Math.min(left, window.innerWidth - menuWidth - 8))

    if (top + menuHeight > window.innerHeight - 8) {
      top = rect.top - menuHeight - gap
    }

    setMenuPosition({ top, left })
    setOpenMenu(employeeId)
  }

  // Pagination
  const handlePageChange = page => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return
    }

    setOpenMenu(null)
    dispatch(getAllEmployees(page, limit, 'hr'))
  }

  // Employee name
  const getEmployeeName = employee => {
    return (
      [employee.firstName, employee.middleName, employee.lastName]
        .filter(Boolean)
        .join(' ') || 'Unknown HR'
    )
  }

  // Initials
  const getInitials = employee => {
    return getEmployeeName(employee)
      .split(' ')
      .filter(Boolean)
      .map(word => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  // Employment status
  const getStatusLabel = status => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'notice_period':
        return 'Notice Period'
      case 'resigned':
        return 'Resigned'
      case 'terminated':
        return 'Terminated'
      default:
        return status || 'Unknown'
    }
  }

  // Search HR
  const filteredHR = employees.filter(employee => {
    if (employee.role !== 'hr') return false

    const searchValue = search.toLowerCase().trim()

    if (!searchValue) return true

    const name = getEmployeeName(employee).toLowerCase()

    const email = (
      employee.officialEmail ||
      employee.personalEmail ||
      ''
    ).toLowerCase()

    const department = (employee.department?.name || '').toLowerCase()
    const employeeId = (employee.employeeId || '').toLowerCase()

    return (
      name.includes(searchValue) ||
      email.includes(searchValue) ||
      department.includes(searchValue) ||
      employeeId.includes(searchValue)
    )
  })

  // Action dropdown portal
  const renderActionMenu = employee => {
    if (openMenu !== employee._id) return null

    return createPortal(
      <>
        {/* Outside click overlay */}
        <button
          type='button'
          className='fixed inset-0 z-[9998] cursor-default'
          aria-label='Close menu'
          onClick={() => setOpenMenu(null)}
        />

        {/* Dropdown */}
        <div
          className='fixed z-[9999] w-32 rounded-lg border border-gray-200 bg-white p-1 shadow-xl'
          style={{
            top: menuPosition.top,
            left: menuPosition.left
          }}
        >
          <button
            type='button'
            onClick={() => {
              setOpenMenu(null)
              navigate(`/admin/employees/${employee._id}`)
            }}
            className='flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100'
          >
            <Eye size={16} />
            View
          </button>

          <button
            type='button'
            onClick={() => {
              setOpenMenu(null)
              navigate(`/admin/edit-employees/${employee._id}`)
            }}
            className='flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100'
          >
            <Pencil size={16} />
            Edit
          </button>
        </div>
      </>,
      document.body
    )
  }

  return (
    <div className='min-h-screen text-black'>
      {/* HEADER */}
      <div className='flex flex-col gap-4 py-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-xl font-semibold sm:text-2xl'>Manage HR</h1>

          <p className='mt-1 text-sm text-gray-500'>
            View and manage your Human Resource team members.
          </p>
        </div>

        <div
          className='flex cursor-pointer items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white'
          onClick={() => navigate('/admin/add-employee')}
        >
          <Plus size={17} />
          Add Hr
        </div>
      </div>

      {/* SEARCH */}
      <div className='rounded-xl border border-gray-200 p-1'>
        <div className='relative'>
          <Search
            size={18}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
          />

          <input
            type='text'
            value={search}
            placeholder='Search HR by name, email, ID or department...'
            onChange={e => setSearch(e.target.value)}
            className='w-full rounded-lg bg-gray-100 py-3 pl-10 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-black/10'
          />
        </div>
      </div>

      {/* HR COUNT */}
      <p className='mt-4 text-sm text-gray-500'>
        {totalHR} {totalHR === 1 ? 'HR Member' : 'HR Members'}
      </p>

      {/* ERROR */}
      {getAllEmployeesError && (
        <div className='mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600'>
          {getAllEmployeesError}
        </div>
      )}

      {/* HR TABLE */}
      <div className='mt-5 pb-6'>
        <div className='w-full overflow-x-auto rounded-xl border border-gray-200'>
          <div className='min-w-[900px] bg-white'>
            {/* TABLE HEADER */}
            <div className='grid grid-cols-5 gap-4 border-b border-gray-200 bg-gray-50 p-4 text-sm font-medium text-gray-500'>
              <div>Name & Role</div>
              <div>Email</div>
              <div>Department</div>
              <div>Status</div>
              <div>Action</div>
            </div>

            {/* LOADING */}
            {getAllEmployeesLoading ? (
              <div className='p-10 text-center text-sm text-gray-500'>
                Loading HR members...
              </div>
            ) : filteredHR.length === 0 ? (
              <div className='p-10 text-center text-sm text-gray-500'>
                No HR members found.
              </div>
            ) : (
              filteredHR.map(employee => (
                <div
                  key={employee._id}
                  className='grid grid-cols-5 items-center gap-4 border-b border-gray-200 p-4 last:border-b-0'
                >
                  {/* NAME + ROLE */}
                  <div className='flex min-w-0 items-center gap-3'>
                    {employee.profilePhoto ? (
                      <img
                        src={employee.profilePhoto}
                        alt={getEmployeeName(employee)}
                        className='h-10 w-10 shrink-0 rounded-full object-cover'
                      />
                    ) : (
                      <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white'>
                        {getInitials(employee)}
                      </div>
                    )}

                    <div className='min-w-0'>
                      <h3 className='truncate text-sm font-semibold text-gray-900'>
                        {getEmployeeName(employee)}
                      </h3>

                      <p className='mt-0.5 text-xs font-medium text-blue-600'>
                        HR
                      </p>

                      <p className='text-xs text-gray-400'>
                        {employee.employeeId || '-'}
                      </p>
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div className='min-w-0'>
                    <p className='truncate text-sm'>
                      {employee.officialEmail || employee.personalEmail || '-'}
                    </p>
                  </div>

                  {/* DEPARTMENT */}
                  <div className='min-w-0'>
                    <p className='truncate text-sm'>
                      {employee.department?.name || '-'}
                    </p>
                  </div>

                  {/* STATUS */}
                  <div>
                    <span
                      className={`text-sm ${
                        employee.employmentStatus === 'active'
                          ? 'font-medium text-green-700'
                          : 'text-gray-500'
                      }`}
                    >
                      {getStatusLabel(employee.employmentStatus)}
                    </span>
                  </div>

                  {/* ACTION */}
                  <div>
                    <button
                      type='button'
                      onClick={event => handleMenuClick(event, employee._id)}
                      className='rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black'
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {renderActionMenu(employee)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* PAGINATION */}
      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

export default ManageHR
