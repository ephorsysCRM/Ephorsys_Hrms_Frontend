import {
  ArrowLeft,
  Pencil,
  UserRound,
  Mail,
  Phone,
  MapPin,
  BriefcaseBusiness,
  WalletCards,
  Landmark,
  GraduationCap,
  Building2,
  FileText,
  LockKeyhole,
  Eye
} from 'lucide-react'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import DocumentModal from '../adminModals/DocumentModal'
import Modal from '../../UI/Modal'
import { getEmployeeById } from '../../Redux/features/employee/employeeThunk'

const EmployeeProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [selectedDocument, setSelectedDocument] = useState(null)

  // =====================================================
  // REDUX
  // =====================================================

  const { employee, getEmployeeByIdLoading, getEmployeeByIdError } =
    useSelector(state => state.employee)

  // =====================================================
  // GET SINGLE EMPLOYEE
  // =====================================================

  useEffect(() => {
    if (id) {
      dispatch(getEmployeeById(id))
    }
  }, [dispatch, id])

  // =====================================================
  // HELPERS
  // =====================================================

  const sectionClass =
    'mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm'

  const sectionHeaderClass =
    'flex flex-col gap-4 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6'

  const editButtonClass =
    'inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 transition-all duration-200 hover:border-black hover:bg-black hover:text-white'

  const labelClass =
    'text-[11px] font-semibold uppercase tracking-[0.08em] text-black'

  const valueClass = 'mt-1.5 text-sm font-semibold text-gray-900'

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = date => {
    if (!date) {
      return '—'
    }

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return '—'
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = value => {
    const number = Number(value)

    if (!Number.isFinite(number)) {
      return '₹0'
    }

    return `₹${number.toLocaleString('en-IN')}`
  }

  // =====================================================
  // FORMAT ROLE
  // =====================================================

  const formatRole = role => {
    if (!role) {
      return '—'
    }

    if (role === 'hr') {
      return 'HR'
    }

    return role
      .replaceAll('_', ' ')
      .replace(/\b\w/g, char => char.toUpperCase())
  }

  // =====================================================
  // FORMAT EMPLOYMENT TYPE
  // =====================================================

  const formatEmploymentType = type => {
    if (!type) {
      return '—'
    }

    return type
      .replaceAll('_', ' ')
      .replace(/\b\w/g, char => char.toUpperCase())
  }

  // =====================================================
  // FORMAT WORK MODE
  // =====================================================

  const formatWorkMode = mode => {
    if (!mode) {
      return '—'
    }

    return mode
      .replaceAll('_', ' ')
      .replace(/\b\w/g, char => char.toUpperCase())
  }

  // =====================================================
  // FORMAT EMPLOYMENT STATUS
  // =====================================================

  const formatEmploymentStatus = status => {
    if (!status) {
      return '—'
    }

    return status
      .replaceAll('_', ' ')
      .replace(/\b\w/g, char => char.toUpperCase())
  }

  // =====================================================
  // EMPLOYEE NAME
  // =====================================================

  const employeeName = [
    employee?.firstName,
    employee?.middleName,
    employee?.lastName
  ]
    .filter(Boolean)
    .join(' ')

  // =====================================================
  // EDUCATION
  // =====================================================

  const educationList = employee?.educationList || []

  // =====================================================
  // EXPERIENCE
  // =====================================================

  const experienceList = employee?.experienceList || []

  // =====================================================
  // DOCUMENT URL
  // =====================================================

  const getDocumentUrl = documentType => {
    const documents = employee?.documents || {}

    const documentList = documents[documentType]

    if (!Array.isArray(documentList) || documentList.length === 0) {
      return null
    }

    return documentList[0]
  }

  // =====================================================
  // DOCUMENT STATUS
  // =====================================================

  const hasDocument = documentType => {
    return Boolean(getDocumentUrl(documentType))
  }

  // =====================================================
  // DOCUMENT NAME
  // =====================================================

  const getDocumentName = documentType => {
    const names = {
      aadhaar: 'Aadhaar',
      pan: 'PAN',
      resume: 'Resume',
      offerLetter: 'Offer Letter',
      experienceLetter: 'Experience Letter',
      signedNda: 'Signed NDA',
      idCard: 'ID Card'
    }

    return names[documentType] || documentType
  }

  // =====================================================
  // DOCUMENT CLICK
  // =====================================================

  const handleDocumentClick = documentType => {
    const url = getDocumentUrl(documentType)

    if (!url) {
      return
    }

    setSelectedDocument({
      name: getDocumentName(documentType),
      url
    })
  }

  // =====================================================
  // BANK DOCUMENT CLICK
  // =====================================================

  const handleBankDocumentClick = () => {
    if (!employee?.bankDocument) {
      return
    }

    setSelectedDocument({
      name: 'Bank Document',
      url: employee.bankDocument
    })
  }

  // =====================================================
  // EDUCATION DOCUMENT CLICK
  // =====================================================

  const handleEducationDocumentClick = (qualification, url, index) => {
    if (!url) {
      return
    }

    setSelectedDocument({
      name: `${qualification || 'Education'} Document ${index + 1}`,
      url
    })
  }

  // =====================================================
  // EXPERIENCE CHECK
  // =====================================================

  const hasExperienceData = experience => {
    if (!experience) {
      return false
    }

    return Boolean(
      experience.companyName ||
      experience.designation ||
      experience.totalExperience ||
      experience.skills ||
      experience.startDate ||
      experience.endDate ||
      experience.reasonForLeaving
    )
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (getEmployeeByIdLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center text-sm text-gray-500'>
        Loading employee profile...
      </div>
    )
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (getEmployeeByIdError) {
    return (
      <div className='min-h-screen py-6'>
        <button
          type='button'
          onClick={() => navigate('/admin/all-employees')}
          className='group inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-500 transition-all hover:bg-white hover:text-black'
        >
          <ArrowLeft
            size={17}
            className='transition-transform group-hover:-translate-x-0.5'
          />
          Back to Employees
        </button>

        <div className='mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-center'>
          <p className='text-sm font-semibold text-red-600'>
            {getEmployeeByIdError}
          </p>

          <button
            type='button'
            onClick={() => dispatch(getEmployeeById(id))}
            className='mt-4 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white'
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // =====================================================
  // EMPLOYEE NOT FOUND
  // =====================================================

  if (!employee) {
    return (
      <div className='min-h-screen py-6'>
        <button
          type='button'
          onClick={() => navigate('/admin/all-employees')}
          className='group inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-500 transition-all hover:bg-white hover:text-black'
        >
          <ArrowLeft
            size={17}
            className='transition-transform group-hover:-translate-x-0.5'
          />
          Back to Employees
        </button>

        <div className='mt-6 rounded-2xl border border-gray-200 bg-white p-10 text-center'>
          <p className='text-sm font-semibold text-gray-600'>
            Employee not found.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen py-2 text-black'>
      {/* =====================================================
          BACK BUTTON
      ===================================================== */}

      <div className='mx-auto mb-5'>
        <button
          type='button'
          onClick={() => navigate('/admin/all-employees')}
          className='group inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-500 transition-all duration-200 hover:bg-white hover:text-black'
        >
          <ArrowLeft
            size={17}
            className='transition-transform duration-200 group-hover:-translate-x-0.5'
          />
          Back to Employees
        </button>
      </div>

      <div className='mx-auto'>
        {/* =====================================================
            PROFILE HEADER
        ===================================================== */}

        <div className='overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm'>
          <div className='h-2 bg-black' />

          <div className='p-6 sm:p-8'>
            <div className='flex flex-col gap-7 md:flex-row md:items-center md:justify-between'>
              {/* Employee Identity */}

              <div className='flex flex-col items-center gap-5 sm:flex-row sm:items-center'>
                {/* Profile Picture */}

                <div className='relative'>
                  {employee.profilePhoto ? (
                    <img
                      src={employee.profilePhoto}
                      alt={employeeName || 'Employee'}
                      className='h-24 w-24 rounded-2xl object-cover shadow-md sm:h-28 sm:w-28'
                    />
                  ) : (
                    <div className='flex h-24 w-24 items-center justify-center rounded-2xl bg-black text-white shadow-md sm:h-28 sm:w-28'>
                      <UserRound size={42} strokeWidth={1.5} />
                    </div>
                  )}

                  <div className='absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-black'>
                    <span className='h-2 w-2 rounded-full bg-white' />
                  </div>
                </div>

                {/* Employee Name */}

                <div className='text-center sm:text-left'>
                  <p className='mb-1 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400'>
                    Employee Profile
                  </p>

                  <h1 className='text-2xl font-bold tracking-tight text-black sm:text-3xl'>
                    {employeeName || '—'}
                  </h1>

                  <p className='mt-1 text-sm text-gray-500'>
                    {employee.employeeId || id}

                    <span className='mx-1.5 text-gray-300'>•</span>

                    {employee.designation || '—'}
                  </p>

                  <div className='mt-3 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5'>
                    <span className='h-2 w-2 rounded-full bg-green-700' />

                    <span className='text-xs font-semibold text-green-700'>
                      {formatEmploymentStatus(employee.employmentStatus)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Header Edit */}

              <div className='flex justify-center sm:justify-end'>
                <button type='button' className={editButtonClass}
                  onClick={() =>
                    navigate(`/admin/edit-employees/${employee._id}`)
                  }>
                  <Pencil size={14} />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            PERSONAL INFORMATION
        ===================================================== */}

        <div className={sectionClass}>
          <div className={sectionHeaderClass}>
            <div className='flex items-center gap-3'>
              <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white'>
                <UserRound size={17} />
              </div>

              <div>
                <h2 className='text-base font-bold text-black'>
                  Personal Information
                </h2>

                <p className='mt-0.5 text-xs text-gray-400'>
                  Personal details of the employee
                </p>
              </div>
            </div>
          </div>

          <div className='grid gap-x-10 gap-y-7 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:p-6'>
            <div>
              <p className={labelClass}>Name</p>
              <p className={valueClass}>{employeeName || '—'}</p>
            </div>

            <div>
              <p className={labelClass}>Gender</p>
              <p className={valueClass}>{employee.gender || '—'}</p>
            </div>

            <div>
              <p className={labelClass}>Date of Birth</p>
              <p className={valueClass}>{formatDate(employee.dateOfBirth)}</p>
            </div>

            <div>
              <p className={labelClass}>Marital Status</p>
              <p className={valueClass}>{employee.maritalStatus || '—'}</p>
            </div>

            <div>
              <p className={labelClass}>Blood Group</p>
              <p className={valueClass}>{employee.bloodGroup || '—'}</p>
            </div>
          </div>
        </div>

        {/* =====================================================
            CONTACT INFORMATION
        ===================================================== */}

        <div className={sectionClass}>
          <div className={sectionHeaderClass}>
            <div className='flex items-center gap-3'>
              <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white'>
                <Phone size={17} />
              </div>

              <div>
                <h2 className='text-base font-bold text-black'>
                  Contact Information
                </h2>

                <p className='mt-0.5 text-xs text-gray-400'>
                  Contact and address details
                </p>
              </div>
            </div>

          </div>

          <div className='p-5 sm:p-6'>
            <h3 className='mb-5 flex items-center gap-2 text-sm font-bold text-gray-800'>
              <Mail size={15} />
              Email & Phone
            </h3>

            <div className='grid gap-6 sm:grid-cols-2'>
              <div>
                <p className={labelClass}>Personal Email</p>
                <p className={valueClass}>{employee.personalEmail || '—'}</p>
              </div>

              <div>
                <p className={labelClass}>Official Email</p>
                <p className={valueClass}>{employee.officialEmail || '—'}</p>
              </div>

              <div>
                <p className={labelClass}>Mobile No.</p>
                <p className={valueClass}>{employee.mobile || '—'}</p>
              </div>

              <div>
                <p className={labelClass}>Alternate Mobile No.</p>
                <p className={valueClass}>{employee.alternateMobile || '—'}</p>
              </div>

              <div>
                <p className={labelClass}>Emergency Contact Name</p>
                <p className={valueClass}>
                  {employee.emergencyContactName || '—'}
                </p>
              </div>

              <div>
                <p className={labelClass}>Emergency Contact No.</p>
                <p className={valueClass}>
                  {employee.emergencyContactNumber || '—'}
                </p>
              </div>
            </div>

            <div className='my-8 border-t border-gray-100' />

            <h3 className='mb-5 flex items-center gap-2 text-sm font-bold text-gray-800'>
              <MapPin size={15} />
              Address
            </h3>

            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              <div>
                <p className={labelClass}>City</p>
                <p className={valueClass}>{employee.city || '—'}</p>
              </div>

              <div>
                <p className={labelClass}>State</p>
                <p className={valueClass}>{employee.state || '—'}</p>
              </div>

              <div>
                <p className={labelClass}>PIN Code</p>
                <p className={valueClass}>{employee.pinCode || '—'}</p>
              </div>

              <div className='sm:col-span-2 lg:col-span-3'>
                <p className={labelClass}>Current Address</p>
                <p className={valueClass}>{employee.currentAddress || '—'}</p>
              </div>

              <div className='sm:col-span-2 lg:col-span-3'>
                <p className={labelClass}>Permanent Address</p>
                <p className={valueClass}>{employee.permanentAddress || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            JOB INFORMATION
        ===================================================== */}

        <div className={sectionClass}>
          <div className={sectionHeaderClass}>
            <div className='flex items-center gap-3'>
              <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white'>
                <BriefcaseBusiness size={17} />
              </div>

              <div>
                <h2 className='text-base font-bold text-black'>
                  Job Information
                </h2>

                <p className='mt-0.5 text-xs text-gray-400'>
                  Employment and work details
                </p>
              </div>
            </div>

          </div>

          <div className='p-5 sm:p-6'>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              <div>
                <p className={labelClass}>Employee ID</p>
                <p className={valueClass}>{employee.employeeId || '—'}</p>
              </div>

              <div>
                <p className={labelClass}>Department</p>
                <p className={valueClass}>{employee.department?.name || '—'}</p>
              </div>

              <div>
                <p className={labelClass}>Role</p>
                <p className={valueClass}>{formatRole(employee.role)}</p>
              </div>

              <div>
                <p className={labelClass}>Designation</p>
                <p className={valueClass}>{employee.designation || '—'}</p>
              </div>

              <div>
                <p className={labelClass}>Employment Type</p>
                <p className={valueClass}>
                  {formatEmploymentType(employee.employmentType)}
                </p>
              </div>

              <div>
                <p className={labelClass}>Work Location</p>
                <p className={valueClass}>{employee.workLocation || '—'}</p>
              </div>

              <div>
                <p className={labelClass}>Joining Date</p>
                <p className={valueClass}>{formatDate(employee.joiningDate)}</p>
              </div>

              <div>
                <p className={labelClass}>Probation End Date</p>
                <p className={valueClass}>
                  {formatDate(employee.probationEndDate)}
                </p>
              </div>
            </div>

            <div className='my-8 border-t border-gray-100' />

            <h3 className='mb-5 text-sm font-bold text-gray-800'>
              Shift Timing
            </h3>

            <div className='grid gap-6 sm:grid-cols-2'>
              <div>
                <p className={labelClass}>From</p>
                <p className={valueClass}>{employee.shiftFrom || '—'}</p>
              </div>

              <div>
                <p className={labelClass}>To</p>
                <p className={valueClass}>{employee.shiftTo || '—'}</p>
              </div>
            </div>

            <div className='my-8 border-t border-gray-100' />

            <h3 className='mb-4 text-sm font-bold text-gray-800'>Work Mode</h3>

            <p className='text-sm font-semibold text-gray-900'>
              {formatWorkMode(employee.workMode)}
            </p>

            <div className='my-8 border-t border-gray-100' />

            <h3 className='mb-4 text-sm font-bold text-gray-800'>
              Employment Status
            </h3>

            <span className='inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700'>
              {formatEmploymentStatus(employee.employmentStatus)}
            </span>
          </div>
        </div>

        {/* =====================================================
            PAYROLL
        ===================================================== */}

        <div className={sectionClass}>
          <div className={sectionHeaderClass}>
            <div className='flex items-center gap-3'>
              <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white'>
                <WalletCards size={17} />
              </div>

              <div>
                <h2 className='text-base font-bold text-black'>Payroll</h2>

                <p className='mt-0.5 text-xs text-gray-400'>
                  Salary, deductions and compensation
                </p>
              </div>
            </div>

          </div>

          <div className='p-5 sm:p-6'>
            <h3 className='mb-5 text-sm font-bold text-gray-800'>Earnings</h3>

            <div className='grid gap-6 sm:grid-cols-2'>
              <div>
                <p className={labelClass}>Basic Salary</p>
                <p className={valueClass}>
                  {formatCurrency(employee.basicSalary)}
                </p>
              </div>

              <div>
                <p className={labelClass}>HRA</p>

                <p className={valueClass}>
                  {formatCurrency(employee.hraAmount)}

                  <span className='text-xs font-normal text-gray-500'>
                    {' '}
                    ({employee.hraPercentage || 0}%)
                  </span>
                </p>
              </div>

              <div>
                <p className={labelClass}>Conveyance Allowance</p>

                <p className={valueClass}>
                  {formatCurrency(employee.conveyanceAllowance)}
                </p>
              </div>

              <div>
                <p className={labelClass}>Special Allowance</p>

                <p className={valueClass}>
                  {formatCurrency(employee.specialAllowance)}
                </p>
              </div>
            </div>

            <div className='mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4'>
              <div className='flex items-center justify-between gap-4'>
                <div>
                  <p className='text-sm font-bold text-black'>Gross Salary</p>

                  <p className='mt-1 text-xs text-gray-500'>
                    Automatically calculated from total earnings
                  </p>
                </div>

                <p className='text-sm font-bold text-black'>
                  {formatCurrency(employee.grossSalary)}
                </p>
              </div>
            </div>

            <div className='my-8 border-t border-gray-100' />

            <h3 className='mb-5 text-sm font-bold text-gray-800'>Deductions</h3>

            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              <div>
                <p className={labelClass}>EPF</p>

                <p className={valueClass}>
                  {formatCurrency(employee.epfAmount)}

                  <span className='text-xs font-normal text-gray-500'>
                    {' '}
                    ({employee.epfPercentage || 0}%)
                  </span>
                </p>
              </div>

              <div>
                <p className={labelClass}>Professional Tax</p>

                <p className={valueClass}>
                  {formatCurrency(employee.professionalTaxAmount)}

                  <span className='text-xs font-normal text-gray-500'>
                    {' '}
                    ({employee.professionalTaxPercentage || 0}%)
                  </span>
                </p>
              </div>

              <div>
                <p className={labelClass}>TDS</p>

                <p className={valueClass}>{formatCurrency(employee.tds)}</p>
              </div>
            </div>

            <div className='mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4'>
              <div className='flex items-center justify-between gap-4'>
                <div>
                  <p className='text-sm font-bold text-black'>
                    Total Deductions
                  </p>

                  <p className='mt-1 text-xs text-gray-500'>
                    EPF + Professional Tax + TDS
                  </p>
                </div>

                <p className='text-sm font-bold text-black'>
                  {formatCurrency(employee.totalDeductions)}
                </p>
              </div>
            </div>

            <div className='mt-3 rounded-xl border border-black bg-black p-4 text-white'>
              <div className='flex items-center justify-between gap-4'>
                <div>
                  <p className='text-sm font-bold'>Net Salary</p>

                  <p className='mt-1 text-xs text-gray-400'>
                    Take-home pay after deductions
                  </p>
                </div>

                <p className='text-sm font-bold'>
                  {formatCurrency(employee.netSalary)}
                </p>
              </div>
            </div>

            <div className='my-8 border-t border-gray-100' />

            <h3 className='mb-5 text-sm font-bold text-gray-800'>
              Employer Contributions
            </h3>

            <div>
              <p className={labelClass}>Employer PF Contribution</p>

              <p className={valueClass}>
                {formatCurrency(employee.employerPfAmount)}

                <span className='text-xs font-normal text-gray-500'>
                  {' '}
                  ({employee.employerPfPercentage || 0}%)
                </span>
              </p>
            </div>

            <div className='mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4'>
              <div className='flex items-center justify-between gap-4'>
                <div>
                  <p className='text-sm font-bold text-black'>CTC</p>

                  <p className='mt-1 text-xs text-gray-500'>
                    Gross salary + employer contributions
                  </p>
                </div>

                <p className='text-sm font-bold text-black'>
                  {formatCurrency(employee.ctc)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            BANK INFORMATION
        ===================================================== */}

        <div className={sectionClass}>
          <div className={sectionHeaderClass}>
            <div className='flex items-center gap-3'>
              <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white'>
                <Landmark size={17} />
              </div>

              <div>
                <h2 className='text-base font-bold text-black'>
                  Bank Information
                </h2>

                <p className='mt-0.5 text-xs text-gray-400'>
                  Employee banking details
                </p>
              </div>
            </div>

          </div>

          <div className='p-5 sm:p-6'>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              <div>
                <p className={labelClass}>Bank Name</p>

                <p className={valueClass}>{employee.bankName || '—'}</p>
              </div>

              <div>
                <p className={labelClass}>Account Holder Name</p>

                <p className={valueClass}>
                  {employee.accountHolderName || '—'}
                </p>
              </div>

              <div>
                <p className={labelClass}>Account Number</p>

                <p className={valueClass}>{employee.accountNumber || '—'}</p>
              </div>

              <div>
                <p className={labelClass}>IFSC Code</p>

                <p className={valueClass}>{employee.ifscCode || '—'}</p>
              </div>

              <div>
                <p className={labelClass}>Branch</p>

                <p className={valueClass}>{employee.branch || '—'}</p>
              </div>
            </div>

            <div className='mt-8 border-t border-gray-100 pt-6'>
              <p className={labelClass}>Bank Document</p>

              {employee.bankDocument ? (
                <button
                  type='button'
                  onClick={handleBankDocumentClick}
                  className='mt-3 flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 text-left hover:border-black'
                >
                  <div className='flex items-center gap-3'>
                    <FileText size={18} className='text-gray-400' />

                    <p className='text-sm font-medium text-gray-700'>
                      View bank document
                    </p>
                  </div>

                  <Eye size={17} />
                </button>
              ) : (
                <div className='mt-3 flex items-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4'>
                  <FileText size={18} className='text-gray-400' />

                  <p className='text-sm font-medium text-gray-500'>
                    Bank document not uploaded
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =====================================================
            EDUCATION
        ===================================================== */}

        <div className={sectionClass}>
          <div className={sectionHeaderClass}>
            <div className='flex items-center gap-3'>
              <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white'>
                <GraduationCap size={17} />
              </div>

              <div>
                <h2 className='text-base font-bold text-black'>Education</h2>

                <p className='mt-0.5 text-xs text-gray-400'>
                  Academic qualification details
                </p>
              </div>
            </div>

          </div>

          <div className='space-y-4 p-5 sm:p-6'>
            {educationList.length === 0 ? (
              <div className='rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500'>
                No education details available.
              </div>
            ) : (
              educationList.map((education, index) => (
                <div
                  key={education._id || index}
                  className='rounded-xl border border-gray-200 bg-gray-50/50 p-5'
                >
                  <div className='mb-5'>
                    <p className='text-sm font-bold text-black'>
                      Education {index + 1}
                    </p>
                  </div>

                  <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                    <div>
                      <p className={labelClass}>Qualification</p>

                      <p className={valueClass}>
                        {education.qualification || '—'}
                      </p>
                    </div>

                    <div>
                      <p className={labelClass}>University / Board</p>

                      <p className={valueClass}>
                        {education.university || '—'}
                      </p>
                    </div>

                    <div>
                      <p className={labelClass}>Passing Year</p>

                      <p className={valueClass}>
                        {education.passingYear || '—'}
                      </p>
                    </div>

                    <div>
                      <p className={labelClass}>Score</p>

                      <p className={valueClass}>
                        {education.score ?? '—'}

                        {education.scoreType
                          ? ` (${education.scoreType.toUpperCase()})`
                          : ''}
                      </p>
                    </div>

                    <div>
                      <p className={labelClass}>Specialization</p>

                      <p className={valueClass}>
                        {education.specialization || '—'}
                      </p>
                    </div>
                  </div>

                  <div className='mt-7 border-t border-gray-200 pt-6'>
                    <p className={labelClass}>Education Documents</p>

                    {education.documents?.length > 0 ? (
                      education.documents.map((document, documentIndex) => (
                        <button
                          type='button'
                          key={documentIndex}
                          onClick={() =>
                            handleEducationDocumentClick(
                              education.qualification,
                              document,
                              documentIndex
                            )
                          }
                          className='mt-3 flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-left hover:border-black'
                        >
                          <div className='flex items-center gap-3'>
                            <FileText size={17} />

                            <span className='text-sm font-medium'>
                              Document {documentIndex + 1}
                            </span>
                          </div>

                          <Eye size={17} />
                        </button>
                      ))
                    ) : (
                      <p className='mt-3 text-sm text-gray-400'>
                        No documents uploaded.
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* =====================================================
            EXPERIENCE
        ===================================================== */}

        <div className={sectionClass}>
          <div className={sectionHeaderClass}>
            <div className='flex items-center gap-3'>
              <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white'>
                <Building2 size={17} />
              </div>

              <div>
                <h2 className='text-base font-bold text-black'>
                  Experience Information
                </h2>

                <p className='mt-0.5 text-xs text-gray-400'>
                  Previous employment details
                </p>
              </div>
            </div>
          </div>

          <div className='space-y-4 p-5 sm:p-6'>
            {experienceList.length === 0 ||
              !experienceList.some(hasExperienceData) ? (
              <div className='rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500'>
                No experience details available.
              </div>
            ) : (
              experienceList
                .filter(hasExperienceData)
                .map((experience, index) => (
                  <div
                    key={experience._id || index}
                    className='rounded-xl border border-gray-200 bg-gray-50/50 p-5'
                  >
                    <p className='mb-5 text-sm font-bold text-black'>
                      Experience {index + 1}
                    </p>

                    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                      <div>
                        <p className={labelClass}>Company Name</p>

                        <p className={valueClass}>
                          {experience.companyName || '—'}
                        </p>
                      </div>

                      <div>
                        <p className={labelClass}>Designation</p>

                        <p className={valueClass}>
                          {experience.designation || '—'}
                        </p>
                      </div>

                      <div>
                        <p className={labelClass}>Total Experience</p>

                        <p className={valueClass}>
                          {experience.totalExperience || '—'}
                        </p>
                      </div>

                      <div>
                        <p className={labelClass}>Skills</p>

                        <p className={valueClass}>{experience.skills || '—'}</p>
                      </div>

                      <div>
                        <p className={labelClass}>Start Date</p>

                        <p className={valueClass}>
                          {formatDate(experience.startDate)}
                        </p>
                      </div>

                      <div>
                        <p className={labelClass}>End Date</p>

                        <p className={valueClass}>
                          {formatDate(experience.endDate)}
                        </p>
                      </div>

                      <div className='sm:col-span-2 lg:col-span-3'>
                        <p className={labelClass}>Reason for Leaving</p>

                        <p className={valueClass}>
                          {experience.reasonForLeaving || '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* =====================================================
            DOCUMENTS
        ===================================================== */}

        <div className={sectionClass}>
          <div className={sectionHeaderClass}>
            <div className='flex items-center gap-3'>
              <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white'>
                <FileText size={17} />
              </div>

              <div>
                <h2 className='text-base font-bold text-black'>Documents</h2>

                <p className='mt-0.5 text-xs text-gray-400'>
                  Employee verification documents
                </p>
              </div>
            </div>
          </div>

          <div className='grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3'>
            {/* =================================================
                AADHAAR
            ================================================= */}

            <button
              type='button'
              disabled={!hasDocument('aadhaar')}
              onClick={() => handleDocumentClick('aadhaar')}
              className='group text-left disabled:cursor-default'
            >
              <div className='rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-black hover:shadow-sm'>
                <div className='flex items-start justify-between'>
                  <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100'>
                    <FileText size={17} />
                  </div>

                  <Eye
                    size={16}
                    className={
                      hasDocument('aadhaar')
                        ? 'text-gray-400 group-hover:text-black'
                        : 'text-gray-300'
                    }
                  />
                </div>

                <p className='mt-4 text-sm font-bold text-black'>Aadhaar</p>

                <p className='mt-1 text-xs text-gray-400'>
                  {hasDocument('aadhaar')
                    ? 'View document'
                    : 'Document not uploaded'}
                </p>
              </div>
            </button>

            {/* =================================================
                PAN
            ================================================= */}

            <button
              type='button'
              disabled={!hasDocument('pan')}
              onClick={() => handleDocumentClick('pan')}
              className='group text-left disabled:cursor-default'
            >
              <div className='rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-black hover:shadow-sm'>
                <div className='flex items-start justify-between'>
                  <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100'>
                    <FileText size={17} />
                  </div>

                  <Eye
                    size={16}
                    className={
                      hasDocument('pan')
                        ? 'text-gray-400 group-hover:text-black'
                        : 'text-gray-300'
                    }
                  />
                </div>

                <p className='mt-4 text-sm font-bold text-black'>PAN</p>

                <p className='mt-1 text-xs text-gray-400'>
                  {hasDocument('pan')
                    ? 'View document'
                    : 'Document not uploaded'}
                </p>
              </div>
            </button>

            {/* =================================================
                RESUME
            ================================================= */}

            <button
              type='button'
              disabled={!hasDocument('resume')}
              onClick={() => handleDocumentClick('resume')}
              className='group text-left disabled:cursor-default'
            >
              <div className='rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-black hover:shadow-sm'>
                <div className='flex items-start justify-between'>
                  <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100'>
                    <FileText size={17} />
                  </div>

                  <Eye
                    size={16}
                    className={
                      hasDocument('resume')
                        ? 'text-gray-400 group-hover:text-black'
                        : 'text-gray-300'
                    }
                  />
                </div>

                <p className='mt-4 text-sm font-bold text-black'>Resume</p>

                <p className='mt-1 text-xs text-gray-400'>
                  {hasDocument('resume')
                    ? 'View document'
                    : 'Document not uploaded'}
                </p>
              </div>
            </button>

            {/* =================================================
                OFFER LETTER
            ================================================= */}

            <button
              type='button'
              disabled={!hasDocument('offerLetter')}
              onClick={() => handleDocumentClick('offerLetter')}
              className='group text-left disabled:cursor-default'
            >
              <div className='rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-black hover:shadow-sm'>
                <div className='flex items-start justify-between'>
                  <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100'>
                    <FileText size={17} />
                  </div>

                  <Eye
                    size={16}
                    className={
                      hasDocument('offerLetter')
                        ? 'text-gray-400 group-hover:text-black'
                        : 'text-gray-300'
                    }
                  />
                </div>

                <p className='mt-4 text-sm font-bold text-black'>
                  Offer Letter
                </p>

                <p className='mt-1 text-xs text-gray-400'>
                  {hasDocument('offerLetter')
                    ? 'View document'
                    : 'Document not uploaded'}
                </p>
              </div>
            </button>

            {/* =================================================
                EXPERIENCE LETTER
            ================================================= */}

            <button
              type='button'
              disabled={!hasDocument('experienceLetter')}
              onClick={() => handleDocumentClick('experienceLetter')}
              className='group text-left disabled:cursor-default'
            >
              <div className='rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-black hover:shadow-sm'>
                <div className='flex items-start justify-between'>
                  <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100'>
                    <FileText size={17} />
                  </div>

                  <Eye
                    size={16}
                    className={
                      hasDocument('experienceLetter')
                        ? 'text-gray-400 group-hover:text-black'
                        : 'text-gray-300'
                    }
                  />
                </div>

                <p className='mt-4 text-sm font-bold text-black'>
                  Experience Letter
                </p>

                <p className='mt-1 text-xs text-gray-400'>
                  {hasDocument('experienceLetter')
                    ? 'View document'
                    : 'Document not uploaded'}
                </p>
              </div>
            </button>

            {/* =================================================
                SIGNED NDA
            ================================================= */}

            <button
              type='button'
              disabled={!hasDocument('signedNda')}
              onClick={() => handleDocumentClick('signedNda')}
              className='group text-left disabled:cursor-default'
            >
              <div className='rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-black hover:shadow-sm'>
                <div className='flex items-start justify-between'>
                  <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100'>
                    <FileText size={17} />
                  </div>

                  <Eye
                    size={16}
                    className={
                      hasDocument('signedNda')
                        ? 'text-gray-400 group-hover:text-black'
                        : 'text-gray-300'
                    }
                  />
                </div>

                <p className='mt-4 text-sm font-bold text-black'>Signed NDA</p>

                <p className='mt-1 text-xs text-gray-400'>
                  {hasDocument('signedNda')
                    ? 'View document'
                    : 'Document not uploaded'}
                </p>
              </div>
            </button>

            {/* =================================================
                ID CARD
            ================================================= */}

            <button
              type='button'
              disabled={!hasDocument('idCard')}
              onClick={() => handleDocumentClick('idCard')}
              className='group text-left disabled:cursor-default'
            >
              <div className='rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-black hover:shadow-sm'>
                <div className='flex items-start justify-between'>
                  <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100'>
                    <FileText size={17} />
                  </div>

                  <Eye
                    size={16}
                    className={
                      hasDocument('idCard')
                        ? 'text-gray-400 group-hover:text-black'
                        : 'text-gray-300'
                    }
                  />
                </div>

                <p className='mt-4 text-sm font-bold text-black'>ID Card</p>

                <p className='mt-1 text-xs text-gray-400'>
                  {hasDocument('idCard')
                    ? 'View document'
                    : 'Document not uploaded'}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* =====================================================
            DOCUMENT MODAL
        ===================================================== */}

        {selectedDocument && (
          <Modal
            isOpen={true}
            onClose={() => setSelectedDocument(null)}
            title={selectedDocument.name}
            size='lg'
          >
            <DocumentModal
              document={selectedDocument}
              onClose={() => setSelectedDocument(null)}
            />
          </Modal>
        )}

        {/* =====================================================
            ACCESS
        ===================================================== */}

        <section className='mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm'>
          <div className='border-b border-gray-100 px-5 py-5 sm:px-6'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex items-center gap-3'>
                <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white'>
                  <LockKeyhole size={17} />
                </div>

                <div>
                  <h2 className='text-base font-bold text-black'>Access</h2>

                  <p className='mt-0.5 text-xs text-gray-400'>
                    Account access and security
                  </p>
                </div>
              </div>

              <button type='button' className={editButtonClass}>
                Change Password
              </button>
            </div>
          </div>

          <div className='p-5 sm:p-6'>
            <div className='rounded-xl border border-gray-200 bg-gray-50 p-4'>
              <p className='mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400'>
                Password
              </p>

              <div className='flex items-center justify-between'>
                <p className='text-sm font-semibold tracking-widest text-black'>
                  ••••••••••
                </p>

                <Eye size={17} className='text-gray-400' />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            BOTTOM BACK BUTTON
        ===================================================== */}

        <div className='py-8'>
          <button
            type='button'
            onClick={() => navigate('/admin/all-employees')}
            className='group mx-auto flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition-all duration-200 hover:border-black hover:bg-black hover:text-white'
          >
            <ArrowLeft
              size={16}
              className='transition-transform duration-200 group-hover:-translate-x-0.5'
            />
            Back to Employees
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmployeeProfile
