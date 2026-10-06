import { Search, Plus, MoreHorizontal, Eye, Pencil } from 'lucide-react'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Pagination from '../../UI/Pagination'
import { getAllEmployees } from '../../Redux/features/employee/employeeThunk'

const AllEmployee = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // =====================================================
  // REDUX
  // =====================================================

  const {
    employees,
    pagination,
    getAllEmployeesLoading,
    getAllEmployeesError
  } = useSelector(state => state.employee)

  // =====================================================
  // LOCAL STATE
  // =====================================================

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [openMenu, setOpenMenu] = useState(null)

  // =====================================================
  // PAGINATION
  // =====================================================

  const currentPage = pagination?.currentPage || 1
  const limit = pagination?.limit || 10
  const totalPages = pagination?.totalPages || 0
  const totalEmployees = pagination?.totalEmployees || 0

  // =====================================================
  // GET ALL EMPLOYEES
  // =====================================================

  useEffect(() => {
    dispatch(getAllEmployees(currentPage, limit))
  }, [dispatch, currentPage, limit])

  // =====================================================
  // PAGE CHANGE
  // =====================================================

  const handlePageChange = page => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return
    }

    dispatch(getAllEmployees(page, limit))
  }

  // =====================================================
  // STATUS LABEL
  // =====================================================

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

  // =====================================================
  // ROLE LABEL
  // =====================================================

  const getRoleLabel = role => {
    switch (role) {
      case 'employee':
        return 'Employee'

      case 'hr':
        return 'HR'

      case 'manager':
        return 'Manager'

      default:
        return role || 'Employee'
    }
  }

  // =====================================================
  // FILTER
  // =====================================================

  const filteredEmployees =
    employees?.filter(employee => {
      const searchValue = search.toLowerCase().trim()

      if (!searchValue) {
        return true
      }

      const name = [employee.firstName, employee.middleName, employee.lastName]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const email = (
        employee.officialEmail ||
        employee.personalEmail ||
        ''
      ).toLowerCase()

      const role = (employee.role || '').toLowerCase()

      const department = (employee.department?.name || '').toLowerCase()

      return (
        name.includes(searchValue) ||
        email.includes(searchValue) ||
        role.includes(searchValue) ||
        department.includes(searchValue) ||
        employee.employeeId?.toLowerCase().includes(searchValue)
      )
    }) || []

  const finalEmployees =
    filter === 'All'
      ? filteredEmployees
      : filter === 'Employee'
      ? filteredEmployees.filter(employee => employee.role === 'employee')
      : filteredEmployees.filter(
          employee => employee.role === 'manager' || employee.role === 'hr'
        )

  // =====================================================
  // EMPLOYEE NAME
  // =====================================================

  const getEmployeeName = employee => {
    return [employee.firstName, employee.middleName, employee.lastName]
      .filter(Boolean)
      .join(' ')
  }

  // =====================================================
  // INITIALS
  // =====================================================

  const getInitials = employee => {
    const name = getEmployeeName(employee)

    return name
      .split(' ')
      .filter(Boolean)
      .map(word => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className='min-h-screen text-black'>
      {/* =================================================
          HEADER
      ================================================= */}

      <div className='flex flex-col gap-4 py-3 sm:px-1 sm:py-3 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-xl font-semibold sm:text-2xl'>All Employees</h1>

          <p className='mt-1 text-sm text-gray-500'>
            Manage your employees and organization members
          </p>
        </div>

        <button
          className='
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-black
            px-4
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:bg-gray-800
            sm:w-auto
          '
          onClick={() => navigate('/admin/add-employee')}
        >
          <Plus size={17} />
          Add Employee
        </button>
      </div>

      {/* =================================================
          SEARCH
      ================================================= */}

      <div>
        <div className='rounded-xl border border-gray-200 p-1'>
          <div className='relative'>
            <Search
              size={18}
              className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
            />

            <input
              type='text'
              value={search}
              placeholder='Search employees...'
              onChange={e => setSearch(e.target.value)}
              className='
                w-full
                rounded-lg
                bg-gray-100
                py-2
                pl-10
                pr-4
                text-sm
                outline-none
                transition
                focus:ring-2
                focus:ring-black/10
                sm:py-3
              '
            />
          </div>
        </div>
      </div>

      {/* =================================================
          FILTER TYPE
      ================================================= */}

      <div className='mt-5'>
        <div
          className='
            flex
            w-full
            gap-2
            overflow-x-auto
            rounded-lg
            border
            border-gray-200
            p-1
            sm:w-fit
          '
        >
          <button
            className={`shrink-0 rounded-md px-4 py-1 text-sm sm:py-2 ${
              filter === 'All'
                ? 'bg-black text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            onClick={() => setFilter('All')}
          >
            All
          </button>

          <button
            className={`shrink-0 rounded-md px-4 py-1 text-sm sm:py-2 ${
              filter === 'Employee'
                ? 'bg-black text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            onClick={() => setFilter('Employee')}
          >
            Employee
          </button>

          <button
            className={`shrink-0 rounded-md px-4 py-1 text-sm sm:py-2 ${
              filter === 'Manager & HR'
                ? 'bg-black text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            onClick={() => setFilter('Manager & HR')}
          >
            Manager & HR
          </button>
        </div>
      </div>

      {/* =================================================
          EMPLOYEE COUNT
      ================================================= */}

      <p className='mt-3 text-sm text-gray-500'>
        {totalEmployees} {totalEmployees === 1 ? 'Employee' : 'Employees'}
      </p>

      {/* =================================================
          ERROR
      ================================================= */}

      {getAllEmployeesError && (
        <div className='mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600'>
          {getAllEmployeesError}
        </div>
      )}

      {/* =================================================
          EMPLOYEE TABLE
      ================================================= */}

      <div className='mt-5 pb-6'>
        <div className='w-full overflow-x-auto rounded-xl border border-gray-200'>
          <div className='min-w-212.5 bg-white'>
            {/* TABLE HEADING */}

            <div
              className='
                grid
                grid-cols-5
                gap-4
                border-b
                border-gray-200
                bg-gray-50
                p-4
                text-sm
                font-medium
                text-gray-500
              '
            >
              <div>Name & Role</div>
              <div>Email</div>
              <div>Department</div>
              <div>Status</div>
              <div>Action</div>
            </div>

            {/* =================================================
                LOADING
            ================================================= */}

            {getAllEmployeesLoading ? (
              <div className='p-10 text-center text-sm text-gray-500'>
                Loading employees...
              </div>
            ) : finalEmployees.length === 0 ? (
              <div className='p-10 text-center text-sm text-gray-500'>
                No employees found.
              </div>
            ) : (
              finalEmployees.map(employee => (
                <div
                  key={employee._id}
                  className='
                    grid
                    grid-cols-5
                    gap-4
                    border-b
                    border-gray-200
                    p-4
                    last:border-b-0
                  '
                >
                  {/* =================================================
                      NAME + ROLE
                  ================================================= */}

                  <div className='flex items-center gap-3'>
                    {employee.profilePhoto ? (
                      <img
                        src={employee.profilePhoto}
                        alt={getEmployeeName(employee)}
                        className='
                          h-10
                          w-10
                          shrink-0
                          rounded-full
                          object-cover
                        '
                      />
                    ) : (
                      <div
                        className='
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-black
                          text-xs
                          font-bold
                          text-white
                        '
                      >
                        {getInitials(employee)}
                      </div>
                    )}

                    <div className='min-w-0'>
                      <h3 className='truncate text-sm font-semibold text-gray-900'>
                        {getEmployeeName(employee)}
                      </h3>

                      <p className='mt-0.5 text-xs text-gray-500'>
                        {getRoleLabel(employee.role)}
                      </p>
                    </div>
                  </div>

                  {/* =================================================
                      EMAIL
                  ================================================= */}

                  <div className='min-w-0'>
                    <p className='truncate text-sm'>
                      {employee.officialEmail || employee.personalEmail || '-'}
                    </p>
                  </div>

                  {/* =================================================
                      DEPARTMENT
                  ================================================= */}

                  <div className='min-w-0'>
                    <p className='truncate text-sm'>
                      {employee.department?.name || '-'}
                    </p>
                  </div>

                  {/* =================================================
                      STATUS
                  ================================================= */}

                  <div className='flex items-center gap-2'>
                    <span
                      className={`text-sm ${
                        employee.employmentStatus === 'active'
                          ? 'text-black'
                          : 'text-gray-500'
                      }`}
                    >
                      {getStatusLabel(employee.employmentStatus)}
                    </span>
                  </div>

                  {/* =================================================
                      ACTION
                  ================================================= */}

                  <div className='relative'>
                    <button
                      onClick={() =>
                        setOpenMenu(
                          openMenu === employee._id ? null : employee._id
                        )
                      }
                      className='rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black'
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {openMenu === employee._id && (
                      <div className='absolute right-0 top-10 z-20 w-28 rounded-lg border border-gray-200 bg-white p-1 shadow-lg'>
                        <button
                          onClick={() => navigate(`/admin/employees/${employee._id}`)}
                          className='flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100'
                        >
                          <Eye size={16} />
                          View
                        </button>

                        <button className='flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100'>
                          <Pencil size={16} />
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* =================================================
          PAGINATION
      ================================================= */}

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

export default AllEmployee
