import {
  Eye,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2
} from 'lucide-react'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Modal from '../../UI/Modal'
import Pagination from '../../UI/Pagination'

import AddDepartment from '../adminModals/AddDepartment'
import DepartmentEditModal from '../adminModals/DepartmentEditModal'
import DeleteDepartmentModal from '../adminModals/DeleteDepartmentModal'

import {
  deleteDepartment,
  getAllDepartments,
  updateDepartment
} from '../../Redux/features/department/departmentThunk'

const Department = () => {
  // =====================================================
  // REDUX
  // =====================================================

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    departments = [],
    pagination = {},
    loading,
    error
  } = useSelector(state => state.department)

  // =====================================================
  // LOCAL STATES
  // =====================================================

  const [search, setSearch] = useState('')
  const [openMenu, setOpenMenu] = useState(null)

  const [addDepartmentOpen, setAddDepartmentOpen] = useState(false)
  const [addDepartmentEdit, setAddDepartmentEdit] = useState(false)

  const [selectedDepartment, setSelectedDepartment] = useState(null)

  const [departmentStatus, setDepartmentStatus] = useState({})
  const [statusUpdating, setStatusUpdating] = useState(null)

  const [deleteLoading, setDeleteLoading] = useState(null)
  const [deleteDepartmentOpen, setDeleteDepartmentOpen] = useState(false)
  const [departmentToDelete, setDepartmentToDelete] = useState(null)

  // =====================================================
  // PAGINATION SETTINGS
  // =====================================================

  const LIMIT = 5

  // =====================================================
  // DEPARTMENT HEAD FULL NAME
  // Supports populated Employee objects from API
  // =====================================================

  const getDepartmentHeadName = departmentHead => {
    if (!departmentHead) return 'Not Assigned'

    // Handle an API response that contains a string instead
    // of a populated Employee object.
    if (typeof departmentHead === 'string') {
      return departmentHead.trim() || 'Not Assigned'
    }

    const fullName = [
      departmentHead.firstName,
      departmentHead.middleName,
      departmentHead.lastName
    ]
      .filter(Boolean)
      .join(' ')
      .trim()

    // Fallback for older API response formats.
    return fullName || departmentHead.name || 'Not Assigned'
  }

  // =====================================================
  // GET DEPARTMENTS
  // =====================================================

  useEffect(() => {
    dispatch(getAllDepartments(1, LIMIT))
  }, [dispatch])

  // =====================================================
  // UPDATE STATUS MAP
  // =====================================================

  useEffect(() => {
    if (!departments.length) {
      setDepartmentStatus({})
      return
    }

    const statusMap = departments.reduce((status, department) => {
      status[department._id] =
        department.status?.toLowerCase() === 'active'
          ? 'Active'
          : 'Inactive'

      return status
    }, {})

    setDepartmentStatus(statusMap)
  }, [departments])

  // =====================================================
  // SEARCH DEPARTMENTS
  // =====================================================

  const searchText = search.toLowerCase().trim()

  const filteredDepartments = departments.filter(department => {
    const managerName = getDepartmentHeadName(
      department.departmentHead
    )

    const departmentStatusText =
      department.status?.toLowerCase() === 'active'
        ? 'active'
        : 'inactive'

    return (
      department._id?.toLowerCase().includes(searchText) ||
      department.name?.toLowerCase().includes(searchText) ||
      department.code?.toLowerCase().includes(searchText) ||
      managerName.toLowerCase().includes(searchText) ||
      departmentStatusText.includes(searchText)
    )
  })

  // =====================================================
  // PAGINATION DATA
  // =====================================================

  const currentPage = pagination?.currentPage || 1
  const totalPages = pagination?.totalPages || 1

  const totalDepartments =
    pagination?.totalDepartments ?? departments.length

  // =====================================================
  // PAGE CHANGE
  // =====================================================

  const handlePageChange = page => {
    dispatch(getAllDepartments(page, LIMIT))
    setOpenMenu(null)
  }

  // =====================================================
  // DEPARTMENT STATS
  // =====================================================

  const activeDepartments = departments.filter(
    department => department.status?.toLowerCase() === 'active'
  ).length

  // =====================================================
  // STATUS TOGGLE
  // =====================================================

  const handleStatusToggle = async department => {
    const departmentId = department._id

    const currentStatus =
      department.status?.toLowerCase() === 'active'
        ? 'active'
        : 'inactive'

    const newStatus =
      currentStatus === 'active' ? 'inactive' : 'active'

    if (statusUpdating === departmentId) return

    try {
      setStatusUpdating(departmentId)

      const result = await dispatch(
        updateDepartment(departmentId, {
          status: newStatus
        })
      )

      if (result.success) {
        setDepartmentStatus(prev => ({
          ...prev,
          [departmentId]:
            newStatus === 'active' ? 'Active' : 'Inactive'
        }))

        await dispatch(getAllDepartments(currentPage, LIMIT))
      }
    } finally {
      setStatusUpdating(null)
    }
  }

  // =====================================================
  // DELETE DEPARTMENT
  // =====================================================

  const handleDeleteDepartment = department => {
    setDepartmentToDelete(department)
    setDeleteDepartmentOpen(true)
    setOpenMenu(null)
  }

  const confirmDeleteDepartment = async () => {
    if (!departmentToDelete?._id) return

    const departmentId = departmentToDelete._id

    if (deleteLoading === departmentId) return

    try {
      setDeleteLoading(departmentId)

      const result = await dispatch(
        deleteDepartment(departmentId)
      )

      if (result.success) {
        setDeleteDepartmentOpen(false)
        setDepartmentToDelete(null)

        await dispatch(
          getAllDepartments(currentPage, LIMIT)
        )
      }
    } finally {
      setDeleteLoading(null)
    }
  }

  // =====================================================
  // REFRESH DEPARTMENTS
  // =====================================================

  const refreshDepartments = () => {
    dispatch(getAllDepartments(currentPage, LIMIT))
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className='min-h-screen bg-gray-50 px-1 py-0 text-black sm:px-6 lg:px-1'>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className='flex flex-col gap-4 py-3 sm:py-3 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-xl font-semibold sm:text-2xl'>
            All Department
          </h1>

          <p className='mt-1 text-sm text-gray-500'>
            Manage your department and organization members
          </p>
        </div>

        <button
          className='flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 sm:w-auto'
          onClick={() => setAddDepartmentOpen(true)}
        >
          <Plus size={17} />
          Add Department
        </button>

        {/* ADD DEPARTMENT MODAL */}

        <Modal
          isOpen={addDepartmentOpen}
          onClose={() => setAddDepartmentOpen(false)}
          title='Add Department'
          size='md'
        >
          <AddDepartment
            onClose={() => {
              setAddDepartmentOpen(false)
              refreshDepartments()
            }}
          />
        </Modal>
      </div>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className='mt-1'>
        <div className='rounded-xl border border-gray-200 p-1'>
          <div className='relative'>
            <Search
              size={18}
              className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
            />

            <input
              type='text'
              value={search}
              placeholder='Search departments...'
              onChange={e => setSearch(e.target.value)}
              className='w-full rounded-lg bg-gray-100 py-2 pl-10 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-black/10 sm:py-3'
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          DEPARTMENT STATS
      ===================================================== */}

      <div className='mt-5 grid grid-cols-2 gap-1 sm:flex sm:flex-row sm:overflow-x-auto'>

        {/* TOTAL */}

        <div className='shrink-0 rounded-lg border border-gray-200 bg-black px-3 py-2 text-center text-white'>
          <p className='text-xs text-gray-300'>
            Total Departments
          </p>

          <p className='mt-1 text-lg font-semibold'>
            {totalDepartments}
          </p>
        </div>

        {/* ACTIVE */}

        <div className='shrink-0 rounded-lg border border-gray-200 bg-black px-3 py-2 text-center text-white'>
          <p className='text-xs text-gray-300'>
            Active Departments
          </p>

          <p className='mt-1 text-lg font-semibold'>
            {activeDepartments}
          </p>
        </div>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className='mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'>
          {error}
        </div>
      )}

      {/* =====================================================
          DEPARTMENT TABLE
      ===================================================== */}

      <div className='mt-5 pb-6'>
        <div className='w-full overflow-x-auto rounded-xl border border-gray-200'>

          <div className='min-w-[800px] bg-white'>

            {/* TABLE HEADER */}

            <div className='grid grid-cols-5 gap-4 border-b border-gray-200 bg-gray-50 p-4 text-sm font-medium text-gray-500'>
              <div>Department</div>
              <div>Head / Manager</div>
              <div>Code</div>
              <div>Status</div>
              <div>Action</div>
            </div>

            {/* LOADING */}

            {loading ? (
              <div className='flex items-center justify-center py-16'>
                <div className='h-7 w-7 animate-spin rounded-full border-2 border-gray-300 border-t-black' />
              </div>
            ) : filteredDepartments.length === 0 ? (

              /* EMPTY STATE */

              <div className='py-16 text-center'>
                <p className='text-sm font-medium text-gray-500'>
                  No departments found
                </p>

                <p className='mt-1 text-xs text-gray-400'>
                  Try changing your search
                </p>
              </div>
            ) : (

              /* DEPARTMENT LIST */

              filteredDepartments.map(department => {
                // FIX: Build the full Department Head name.
                const managerName = getDepartmentHeadName(
                  department.departmentHead
                )

                const currentStatus =
                  departmentStatus[department._id] ||
                  (
                    department.status?.toLowerCase() === 'active'
                      ? 'Active'
                      : 'Inactive'
                  )

                const isStatusUpdating =
                  statusUpdating === department._id

                const isDeleting =
                  deleteLoading === department._id

                return (
                  <div
                    key={department._id}
                    className='grid grid-cols-5 gap-4 border-b border-gray-200 p-4 last:border-b-0'
                  >

                    {/* DEPARTMENT */}

                    <div className='min-w-0'>
                      <p className='truncate font-semibold'>
                        {department.name}
                      </p>

                      <p className='text-xs text-gray-500'>
                        {department._id}
                      </p>
                    </div>

                    {/* DEPARTMENT HEAD */}

                    <div className='min-w-0'>
                      <p
                        className='truncate text-sm'
                        title={managerName}
                      >
                        {managerName}
                      </p>
                    </div>

                    {/* CODE */}

                    <div>
                      <p className='text-sm font-medium'>
                        {department.code || '-'}
                      </p>
                    </div>

                    {/* STATUS */}

                    <div className='flex items-center gap-2'>
                      <button
                        disabled={isStatusUpdating}
                        onClick={() => handleStatusToggle(department)}
                        aria-label={`Change ${department.name} status`}
                        className={`relative h-6 w-11 rounded-full transition disabled:cursor-not-allowed disabled:opacity-60 ${
                          currentStatus === 'Active'
                            ? 'bg-black'
                            : 'bg-gray-300'
                        }`}
                      >
                        {isStatusUpdating ? (
                          <span className='absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-white border-t-transparent' />
                        ) : (
                          <span
                            className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                              currentStatus === 'Active'
                                ? 'left-6'
                                : 'left-1'
                            }`}
                          />
                        )}
                      </button>

                      <span className='text-sm'>
                        {currentStatus}
                      </span>
                    </div>

                    {/* ACTION */}

                    <div className='relative'>
                      <button
                        disabled={isDeleting || isStatusUpdating}
                        aria-label={`Actions for ${department.name}`}
                        className='rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black disabled:cursor-not-allowed disabled:opacity-50'
                        onClick={() =>
                          setOpenMenu(
                            openMenu === department._id
                              ? null
                              : department._id
                          )
                        }
                      >
                        <MoreHorizontal size={20} />
                      </button>

                      {/* ACTION MENU */}

                      {openMenu === department._id && (
                        <div className='absolute right-10 bottom-[-25px] z-50 w-32 rounded-lg border border-gray-200 bg-white p-1 shadow-lg'>

                          {/* VIEW */}

                          <button
                            onClick={() => {
                              setOpenMenu(null)

                              navigate(
                                `/admin/departments/${department._id}`
                              )
                            }}
                            className='flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100'
                          >
                            <Eye size={16} />
                            View
                          </button>

                          {/* EDIT */}

                          <button
                            className='flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100'
                            onClick={() => {
                              setSelectedDepartment(department)
                              setAddDepartmentEdit(true)
                              setOpenMenu(null)
                            }}
                          >
                            <Pencil size={16} />
                            Edit
                          </button>

                          {/* DELETE */}

                          <button
                            disabled={isDeleting}
                            className='flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50'
                            onClick={() => handleDeleteDepartment(department)}
                          >
                            {isDeleting ? (
                              <span className='h-4 w-4 animate-spin rounded-full border-2 border-red-300 border-t-red-600' />
                            ) : (
                              <Trash2 size={16} />
                            )}

                            {isDeleting ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}

            {/* =====================================================
                EDIT DEPARTMENT MODAL
            ===================================================== */}

            <Modal
              isOpen={addDepartmentEdit}
              onClose={() => setAddDepartmentEdit(false)}
              title='Edit Department'
              size='md'
            >
              <DepartmentEditModal
                department={selectedDepartment}
                onClose={() => {
                  setAddDepartmentEdit(false)
                  refreshDepartments()
                }}
              />
            </Modal>
          </div>
        </div>
      </div>

      {/* =====================================================
          DELETE DEPARTMENT MODAL
      ===================================================== */}

      <Modal
        isOpen={deleteDepartmentOpen}
        onClose={() => {
          setDeleteDepartmentOpen(false)
          setDepartmentToDelete(null)
        }}
        title='Delete Department'
        size='md'
      >
        <DeleteDepartmentModal
          department={departmentToDelete}
          deleting={deleteLoading === departmentToDelete?._id}
          onClose={() => {
            setDeleteDepartmentOpen(false)
            setDepartmentToDelete(null)
          }}
          onConfirm={confirmDeleteDepartment}
        />
      </Modal>

      {/* =====================================================
          PAGINATION
      ===================================================== */}

      {totalPages > 1 && (
        <div className='mt-4'>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}

export default Department