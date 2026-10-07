import {
  ArrowLeft,
  Save,
  UserRound,
  Phone,
  BriefcaseBusiness,
  WalletCards,
  Landmark,
  GraduationCap,
  Building2,
  FileText,
  Upload,
  Eye,
  Trash2,
  Plus,
  X,
  Loader2
} from 'lucide-react'

import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import {
  getEmployeeById,
  updateEmployee
} from '../../Redux/features/employee/employeeThunk'

const documentNames = {
  aadhaar: 'Aadhaar',
  pan: 'PAN',
  resume: 'Resume',
  offerLetter: 'Offer Letter',
  experienceLetter: 'Experience Letter',
  signedNda: 'Signed NDA',
  idCard: 'ID Card'
}

const emptyEducation = {
  qualification: '',
  university: '',
  passingYear: '',
  score: '',
  scoreType: 'percentage',
  specialization: '',
  documents: []
}

const emptyExperience = {
  companyName: '',
  designation: '',
  totalExperience: '',
  skills: '',
  startDate: '',
  endDate: '',
  reasonForLeaving: ''
}

const emptyForm = {
  basic: {
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    bloodGroup: '',
    profilePhoto: null
  },

  contact: {
    personalEmail: '',
    officialEmail: '',
    mobile: '',
    alternateMobile: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    city: '',
    state: '',
    pinCode: '',
    currentAddress: '',
    permanentAddress: ''
  },

  employment: {
    employeeId: '',
    department: '',
    designation: '',
    role: 'employee',
    joiningDate: '',
    employmentType: '',
    workLocation: '',
    probationEndDate: '',
    shiftFrom: '',
    shiftTo: '',
    workMode: '',
    employmentStatus: 'active'
  },

  payroll: {
    basicSalary: '',
    hraPercentage: '',
    conveyanceAllowance: '',
    specialAllowance: '',
    epfPercentage: '',
    professionalTaxPercentage: '',
    tds: '',
    employerPfPercentage: ''
  },

  bank: {
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branch: '',
    bankDocument: null
  },

  education: [],
  experience: [],

  documents: {
    aadhaar: [],
    pan: [],
    resume: [],
    offerLetter: [],
    experienceLetter: [],
    signedNda: [],
    idCard: []
  }
}

const inputClass =
  'mt-2 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black'

const selectClass = inputClass

const textareaClass =
  'mt-2 min-h-[100px] w-full resize-y rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black'

const labelClass =
  'text-[11px] font-semibold uppercase tracking-[0.08em] text-black'

const sectionClass =
  'mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm'

const sectionHeaderClass =
  'flex flex-col gap-4 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6'

const sectionIconClass =
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black text-white'

const dateInputValue = value => {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return date.toISOString().slice(0, 10)
}

const fileArray = value => {
  if (!Array.isArray(value)) return []
  return value
}

const getDepartmentId = department => {
  if (!department) return ''
  if (typeof department === 'string') return department
  return department._id || department.id || ''
}

const mapEmployeeToForm = employee => {
  const education = Array.isArray(employee?.educationList)
    ? employee.educationList.map(item => ({
        qualification: item?.qualification || '',
        university: item?.university || '',
        passingYear: item?.passingYear ?? '',
        score: item?.score ?? '',
        scoreType: item?.scoreType || 'percentage',
        specialization: item?.specialization || '',
        documents: fileArray(item?.documents)
      }))
    : []

  const experience = Array.isArray(employee?.experienceList)
    ? employee.experienceList.map(item => ({
        companyName: item?.companyName || '',
        designation: item?.designation || '',
        totalExperience: item?.totalExperience || '',
        skills: item?.skills || '',
        startDate: dateInputValue(item?.startDate),
        endDate: dateInputValue(item?.endDate),
        reasonForLeaving: item?.reasonForLeaving || ''
      }))
    : []

  const documents = employee?.documents || {}

  return {
    basic: {
      firstName: employee?.firstName || '',
      middleName: employee?.middleName || '',
      lastName: employee?.lastName || '',
      dateOfBirth: dateInputValue(employee?.dateOfBirth),
      gender: employee?.gender || '',
      maritalStatus: employee?.maritalStatus || '',
      bloodGroup: employee?.bloodGroup || '',
      profilePhoto: employee?.profilePhoto || null
    },

    contact: {
      personalEmail: employee?.personalEmail || '',
      officialEmail: employee?.officialEmail || '',
      mobile: employee?.mobile || '',
      alternateMobile: employee?.alternateMobile || '',
      emergencyContactName: employee?.emergencyContactName || '',
      emergencyContactNumber: employee?.emergencyContactNumber || '',
      city: employee?.city || '',
      state: employee?.state || '',
      pinCode: employee?.pinCode || '',
      currentAddress: employee?.currentAddress || '',
      permanentAddress: employee?.permanentAddress || ''
    },

    employment: {
      employeeId: employee?.employeeId || '',
      department: getDepartmentId(employee?.department),
      designation: employee?.designation || '',
      role: employee?.role || 'employee',
      joiningDate: dateInputValue(employee?.joiningDate),
      employmentType: employee?.employmentType || '',
      workLocation: employee?.workLocation || '',
      probationEndDate: dateInputValue(employee?.probationEndDate),
      shiftFrom: employee?.shiftFrom || '',
      shiftTo: employee?.shiftTo || '',
      workMode: employee?.workMode || '',
      employmentStatus: employee?.employmentStatus || 'active'
    },

    payroll: {
      basicSalary: employee?.basicSalary ?? '',
      hraPercentage: employee?.hraPercentage ?? '',
      conveyanceAllowance: employee?.conveyanceAllowance ?? '',
      specialAllowance: employee?.specialAllowance ?? '',
      epfPercentage: employee?.epfPercentage ?? '',
      professionalTaxPercentage: employee?.professionalTaxPercentage ?? '',
      tds: employee?.tds ?? '',
      employerPfPercentage: employee?.employerPfPercentage ?? ''
    },

    bank: {
      accountHolderName: employee?.accountHolderName || '',
      bankName: employee?.bankName || '',
      accountNumber: employee?.accountNumber || '',
      ifscCode: employee?.ifscCode || '',
      branch: employee?.branch || '',
      bankDocument: employee?.bankDocument || null
    },

    education,

    experience,

    documents: {
      aadhaar: fileArray(documents.aadhaar),
      pan: fileArray(documents.pan),
      resume: fileArray(documents.resume),
      offerLetter: fileArray(documents.offerLetter),
      experienceLetter: fileArray(documents.experienceLetter),
      signedNda: fileArray(documents.signedNda),
      idCard: fileArray(documents.idCard)
    }
  }
}

const Field = ({ label, required = false, children, className = '' }) => (
  <div className={className}>
    <label className={labelClass}>
      {label}
      {required && <span className='ml-1 text-red-500'>*</span>}
    </label>
    {children}
  </div>
)

const SectionHeader = ({ icon: Icon, title, description }) => (
  <div className={sectionHeaderClass}>
    <div className='flex items-center gap-3'>
      <div className={sectionIconClass}>
        <Icon size={17} />
      </div>

      <div>
        <h2 className='text-base font-bold text-black'>{title}</h2>
        <p className='mt-0.5 text-xs text-gray-400'>{description}</p>
      </div>
    </div>
  </div>
)

const ExistingFile = ({
  value,
  label,
  onView,
  onReplace,
  onRemove,
  accept = '.pdf',
  multiple = false
}) => {
  const hasExisting = Array.isArray(value) ? value.length > 0 : Boolean(value)

  const inputRef = useRef(null)

  const handleSelect = event => {
    const files = Array.from(event.target.files || [])

    if (!files.length) return

    onReplace(files, multiple)

    event.target.value = ''
  }

  return (
    <div className='rounded-xl border border-gray-200 bg-gray-50/60 p-4'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='min-w-0'>
          <p className='text-sm font-bold text-gray-900'>{label}</p>

          <p className='mt-1 truncate text-xs text-gray-400'>
            {hasExisting
              ? Array.isArray(value)
                ? `${value.length} document${
                    value.length > 1 ? 's' : ''
                  } available`
                : 'Existing document available'
              : 'No document uploaded'}
          </p>
        </div>

        <div className='flex flex-wrap gap-2'>
          {hasExisting && (
            <button
              type='button'
              onClick={onView}
              className='inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-black hover:text-black'
            >
              <Eye size={14} />
              View
            </button>
          )}

          <button
            type='button'
            onClick={() => inputRef.current?.click()}
            className='inline-flex items-center gap-1.5 rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-800'
          >
            <Upload size={14} />
            {hasExisting ? 'Replace' : 'Upload'}
          </button>

          {hasExisting && onRemove && (
            <button
              type='button'
              onClick={onRemove}
              className='inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50'
            >
              <Trash2 size={14} />
              Remove
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type='file'
        accept={accept}
        multiple={multiple}
        onChange={handleSelect}
        className='hidden'
      />
    </div>
  )
}

export default function EditEmployee () {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    employee,
    getEmployeeByIdLoading,
    getEmployeeByIdError,
    updateEmployeeLoading,
    updateEmployeeError,
    updateEmployeeSuccess
  } = useSelector(state => state.employee)

  const { departments = [], loading: departmentLoading } = useSelector(
    state => state.department || {}
  )

  const [formData, setFormData] = useState(emptyForm)
  const [initialEmployee, setInitialEmployee] = useState(null)
  const [profilePreview, setProfilePreview] = useState(null)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    if (id) {
      dispatch(getEmployeeById(id))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (!employee || employee._id !== id) return

    const mapped = mapEmployeeToForm(employee)

    setFormData(mapped)
    setInitialEmployee(employee)
    setProfilePreview(
      typeof mapped.basic.profilePhoto === 'string'
        ? mapped.basic.profilePhoto
        : null
    )
  }, [employee, id])

  useEffect(() => {
    if (formData.basic.profilePhoto instanceof File) {
      const url = URL.createObjectURL(formData.basic.profilePhoto)

      setProfilePreview(url)

      return () => URL.revokeObjectURL(url)
    }

    if (typeof formData.basic.profilePhoto === 'string') {
      setProfilePreview(formData.basic.profilePhoto)
    }
  }, [formData.basic.profilePhoto])

  useEffect(() => {
    if (updateEmployeeSuccess) {
      navigate(`/hr/employees/${id}`)
    }
  }, [updateEmployeeSuccess, navigate, id])

  const updateSection = (section, field, value) => {
    setFormData(previous => ({
      ...previous,
      [section]: {
        ...previous[section],
        [field]: value
      }
    }))

    setSaveError(null)
  }

  const updateEducation = (index, field, value) => {
    setFormData(previous => {
      const updated = [...previous.education]

      updated[index] = {
        ...updated[index],
        [field]: value
      }

      return {
        ...previous,
        education: updated
      }
    })

    setSaveError(null)
  }

  const addEducation = () => {
    setFormData(previous => ({
      ...previous,
      education: [
        ...previous.education,
        {
          ...emptyEducation,
          documents: []
        }
      ]
    }))
  }

  const removeEducation = index => {
    setFormData(previous => ({
      ...previous,
      education: previous.education.filter(
        (_, itemIndex) => itemIndex !== index
      )
    }))
  }

  const updateEducationDocuments = (index, files) => {
    setFormData(previous => {
      const updated = [...previous.education]

      updated[index] = {
        ...updated[index],
        documents: files
      }

      return {
        ...previous,
        education: updated
      }
    })

    setSaveError(null)
  }

  const updateExperience = (index, field, value) => {
    setFormData(previous => {
      const updated = [...previous.experience]

      updated[index] = {
        ...updated[index],
        [field]: value
      }

      return {
        ...previous,
        experience: updated
      }
    })

    setSaveError(null)
  }

  const addExperience = () => {
    setFormData(previous => ({
      ...previous,
      experience: [...previous.experience, { ...emptyExperience }]
    }))
  }

  const removeExperience = index => {
    setFormData(previous => ({
      ...previous,
      experience: previous.experience.filter(
        (_, itemIndex) => itemIndex !== index
      )
    }))
  }

  const getExistingUrl = value => {
    if (!value) return null

    if (typeof value === 'string') return value

    if (Array.isArray(value)) {
      const first = value.find(item => typeof item === 'string')

      return first || null
    }

    return null
  }

  const openDocument = (name, value) => {
    const url = getExistingUrl(value)

    if (!url) return

    setSelectedDocument({
      name,
      url
    })
  }

  const replaceGeneralDocument = (documentType, files, multiple = false) => {
    const value = multiple ? files : files.slice(0, 1)

    setFormData(previous => ({
      ...previous,
      documents: {
        ...previous.documents,
        [documentType]: value
      }
    }))

    setSaveError(null)
  }

  const removeGeneralDocument = documentType => {
    setFormData(previous => ({
      ...previous,
      documents: {
        ...previous.documents,
        [documentType]: []
      }
    }))
  }

  const replaceEducationDocument = (educationIndex, files) => {
    updateEducationDocuments(educationIndex, files.slice(0, 10))
  }

  const removeEducationDocument = educationIndex => {
    updateEducationDocuments(educationIndex, [])
  }

  const buildFormData = () => {
    const payload = new FormData()

    const append = (key, value) => {
      payload.append(
        key,
        value === null || value === undefined ? '' : String(value)
      )
    }

    // ==========================================
    // BASIC
    // ==========================================

    append('firstName', formData.basic.firstName)
    append('middleName', formData.basic.middleName)
    append('lastName', formData.basic.lastName)
    append('dateOfBirth', formData.basic.dateOfBirth)
    append('gender', formData.basic.gender)
    append('maritalStatus', formData.basic.maritalStatus)
    append('bloodGroup', formData.basic.bloodGroup)

    if (formData.basic.profilePhoto instanceof File) {
      payload.append('profilePhoto', formData.basic.profilePhoto)
    }

    // ==========================================
    // CONTACT
    // ==========================================

    Object.entries(formData.contact).forEach(([key, value]) => {
      append(key, value)
    })

    // ==========================================
    // EMPLOYMENT
    // ==========================================

    Object.entries(formData.employment).forEach(([key, value]) => {
      append(key, value)
    })

    // ==========================================
    // PAYROLL
    // ==========================================

    Object.entries(formData.payroll).forEach(([key, value]) => {
      append(key, value)
    })

    // ==========================================
    // BANK
    // ==========================================

    append('accountHolderName', formData.bank.accountHolderName)
    append('bankName', formData.bank.bankName)
    append('accountNumber', formData.bank.accountNumber)
    append('ifscCode', formData.bank.ifscCode)
    append('branch', formData.bank.branch)

    if (formData.bank.bankDocument instanceof File) {
      payload.append('bankDocument', formData.bank.bankDocument)
    }

    // ==========================================
    // EDUCATION
    // ==========================================

    const educationPayload = formData.education.map(education => ({
      qualification: education.qualification || '',
      university: education.university || '',
      passingYear:
        education.passingYear === '' ? '' : Number(education.passingYear),
      score: education.score === '' ? '' : Number(education.score),
      scoreType: education.scoreType || 'percentage',
      specialization: education.specialization || '',
      documents: Array.isArray(education.documents)
        ? education.documents.filter(document => typeof document === 'string')
        : []
    }))

    payload.append('educationList', JSON.stringify(educationPayload))

    formData.education.forEach((education, educationIndex) => {
      if (!Array.isArray(education.documents)) {
        return
      }

      education.documents.forEach(document => {
        if (document instanceof File) {
          payload.append(`educationDocuments_${educationIndex}`, document)
        }
      })
    })

    // ==========================================
    // EXPERIENCE
    // ==========================================

    payload.append(
      'experienceList',
      JSON.stringify(
        formData.experience.map(experience => ({
          companyName: experience.companyName || '',
          designation: experience.designation || '',
          totalExperience: experience.totalExperience || '',
          skills: experience.skills || '',
          startDate: experience.startDate || null,
          endDate: experience.endDate || null,
          reasonForLeaving: experience.reasonForLeaving || ''
        }))
      )
    )

    // ==========================================
    // GENERAL DOCUMENTS
    // ==========================================

    Object.entries(formData.documents).forEach(([documentType, documents]) => {
      const existingUrls = Array.isArray(documents)
        ? documents.filter(document => typeof document === 'string')
        : []

      payload.append(
        `documents_${documentType}_existing`,
        JSON.stringify(existingUrls)
      )

      if (!Array.isArray(documents)) return

      documents.forEach(document => {
        if (document instanceof File) {
          payload.append(`documents_${documentType}`, document)
        }
      })
    })

    return payload
  }

  const handleSave = async () => {
    setSaveError(null)

    if (!formData.basic.firstName?.trim()) {
      setSaveError('First name is required.')
      return
    }

    if (!formData.basic.lastName?.trim()) {
      setSaveError('Last name is required.')
      return
    }

    if (!formData.contact.officialEmail?.trim()) {
      setSaveError('Official email is required.')
      return
    }

    if (!formData.contact.mobile?.trim()) {
      setSaveError('Mobile number is required.')
      return
    }

    if (!formData.employment.employeeId?.trim()) {
      setSaveError('Employee ID is required.')
      return
    }

    if (!formData.employment.department) {
      setSaveError('Department is required.')
      return
    }

    if (!formData.employment.designation?.trim()) {
      setSaveError('Designation is required.')
      return
    }

    try {
      const payload = buildFormData()

      const result = await dispatch(updateEmployee(id, payload))

      if (!result?.success) {
        setSaveError(result?.message || 'Failed to update employee.')
      }
    } catch (error) {
      setSaveError(error?.message || 'Failed to update employee.')
    }
  }

  const employeeName = [
    formData.basic.firstName,
    formData.basic.middleName,
    formData.basic.lastName
  ]
    .filter(Boolean)
    .join(' ')

  const existingProfilePhoto =
    typeof initialEmployee?.profilePhoto === 'string'
      ? initialEmployee.profilePhoto
      : null

  if (getEmployeeByIdLoading && !initialEmployee) {
    return (
      <div className='flex min-h-screen items-center justify-center text-sm text-gray-500'>
        Loading employee...
      </div>
    )
  }

  if (getEmployeeByIdError && !initialEmployee) {
    return (
      <div className='min-h-screen py-6'>
        <button
          type='button'
          onClick={() => navigate(`/hr/employees/${id}`)}
          className='group inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-500 transition hover:bg-white hover:text-black'
        >
          <ArrowLeft
            size={17}
            className='transition-transform group-hover:-translate-x-0.5'
          />
          Back to Employee Profile
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

  if (!initialEmployee) {
    return null
  }

  return (
    <div className='min-h-screen py-2 text-black'>
      {/* ==========================================
          BACK
      ========================================== */}

      <div className='mx-auto mb-5'>
        <button
          type='button'
          onClick={() => navigate(`/hr/employees/${id}`)}
          className='group inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-500 transition hover:bg-white hover:text-black'
        >
          <ArrowLeft
            size={17}
            className='transition-transform group-hover:-translate-x-0.5'
          />
          Back to Employee Profile
        </button>
      </div>

      <div className='mx-auto'>
        {/* ==========================================
            HEADER
        ========================================== */}

        <div className='overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm'>
          <div className='h-2 bg-black' />

          <div className='p-6 sm:p-8'>
            <div className='flex flex-col gap-7 md:flex-row md:items-center md:justify-between'>
              <div className='flex flex-col items-center gap-5 sm:flex-row'>
                <div className='relative'>
                  {profilePreview || existingProfilePhoto ? (
                    <img
                      src={profilePreview || existingProfilePhoto}
                      alt={employeeName || 'Employee'}
                      className='h-24 w-24 rounded-2xl object-cover shadow-md sm:h-28 sm:w-28'
                    />
                  ) : (
                    <div className='flex h-24 w-24 items-center justify-center rounded-2xl bg-black text-white shadow-md sm:h-28 sm:w-28'>
                      <UserRound size={42} strokeWidth={1.5} />
                    </div>
                  )}

                  <label className='absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-black text-white shadow-sm transition hover:bg-gray-800'>
                    <Upload size={14} />

                    <input
                      type='file'
                      accept='image/*'
                      className='hidden'
                      onChange={event => {
                        const file = event.target.files?.[0]

                        if (file) {
                          updateSection('basic', 'profilePhoto', file)
                        }

                        event.target.value = ''
                      }}
                    />
                  </label>
                </div>

                <div className='text-center sm:text-left'>
                  <p className='mb-1 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400'>
                    Edit Employee
                  </p>

                  <h1 className='text-2xl font-bold tracking-tight text-black sm:text-3xl'>
                    {employeeName || 'Employee'}
                  </h1>

                  <p className='mt-1 text-sm text-gray-500'>
                    {formData.employment.employeeId || id}
                    <span className='mx-1.5 text-gray-300'>•</span>
                    {formData.employment.designation || '—'}
                  </p>
                </div>
              </div>

              <button
                type='button'
                onClick={handleSave}
                disabled={updateEmployeeLoading}
                className='inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60'
              >
                {updateEmployeeLoading ? (
                  <>
                    <Loader2 size={15} className='animate-spin' />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {(saveError || updateEmployeeError) && (
          <div className='mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600'>
            {saveError || updateEmployeeError}
          </div>
        )}

        {/* ==========================================
            PERSONAL INFORMATION
        ========================================== */}

        <div className={sectionClass}>
          <SectionHeader
            icon={UserRound}
            title='Personal Information'
            description='Edit personal details of the employee'
          />

          <div className='grid gap-6 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:p-6'>
            <Field label='First Name' required>
              <input
                value={formData.basic.firstName}
                onChange={e =>
                  updateSection('basic', 'firstName', e.target.value)
                }
                className={inputClass}
                placeholder='First name'
              />
            </Field>

            <Field label='Middle Name'>
              <input
                value={formData.basic.middleName}
                onChange={e =>
                  updateSection('basic', 'middleName', e.target.value)
                }
                className={inputClass}
                placeholder='Middle name'
              />
            </Field>

            <Field label='Last Name' required>
              <input
                value={formData.basic.lastName}
                onChange={e =>
                  updateSection('basic', 'lastName', e.target.value)
                }
                className={inputClass}
                placeholder='Last name'
              />
            </Field>

            <Field label='Gender' required>
              <select
                value={formData.basic.gender}
                onChange={e => updateSection('basic', 'gender', e.target.value)}
                className={selectClass}
              >
                <option value=''>Select gender</option>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
                <option value='Other'>Other</option>
              </select>
            </Field>

            <Field label='Date of Birth' required>
              <input
                type='date'
                value={formData.basic.dateOfBirth}
                onChange={e =>
                  updateSection('basic', 'dateOfBirth', e.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label='Marital Status' required>
              <select
                value={formData.basic.maritalStatus}
                onChange={e =>
                  updateSection('basic', 'maritalStatus', e.target.value)
                }
                className={selectClass}
              >
                <option value=''>Select status</option>
                <option value='Single'>Single</option>
                <option value='Married'>Married</option>
                <option value='Divorced'>Divorced</option>
                <option value='Widowed'>Widowed</option>
              </select>
            </Field>

            <Field label='Blood Group'>
              <select
                value={formData.basic.bloodGroup}
                onChange={e =>
                  updateSection('basic', 'bloodGroup', e.target.value)
                }
                className={selectClass}
              >
                <option value=''>Select blood group</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(
                  group => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  )
                )}
              </select>
            </Field>
          </div>
        </div>

        {/* ==========================================
            CONTACT INFORMATION
        ========================================== */}

        <div className={sectionClass}>
          <SectionHeader
            icon={Phone}
            title='Contact Information'
            description='Edit contact and address details'
          />

          <div className='p-5 sm:p-6'>
            <h3 className='mb-5 text-sm font-bold text-gray-800'>
              Email & Phone
            </h3>

            <div className='grid gap-6 sm:grid-cols-2'>
              {[
                ['personalEmail', 'Personal Email'],
                ['officialEmail', 'Official Email'],
                ['mobile', 'Mobile No.'],
                ['alternateMobile', 'Alternate Mobile No.'],
                ['emergencyContactName', 'Emergency Contact Name'],
                ['emergencyContactNumber', 'Emergency Contact No.']
              ].map(([field, label]) => (
                <Field key={field} label={label}>
                  <input
                    type={field.includes('Email') ? 'email' : 'text'}
                    value={formData.contact[field]}
                    onChange={e =>
                      updateSection('contact', field, e.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
              ))}
            </div>

            <div className='my-8 border-t border-gray-100' />

            <h3 className='mb-5 text-sm font-bold text-gray-800'>Address</h3>

            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              <Field label='City'>
                <input
                  value={formData.contact.city}
                  onChange={e =>
                    updateSection('contact', 'city', e.target.value)
                  }
                  className={inputClass}
                />
              </Field>

              <Field label='State'>
                <input
                  value={formData.contact.state}
                  onChange={e =>
                    updateSection('contact', 'state', e.target.value)
                  }
                  className={inputClass}
                />
              </Field>

              <Field label='PIN Code'>
                <input
                  value={formData.contact.pinCode}
                  onChange={e =>
                    updateSection('contact', 'pinCode', e.target.value)
                  }
                  className={inputClass}
                />
              </Field>

              <Field
                label='Current Address'
                className='sm:col-span-2 lg:col-span-3'
              >
                <textarea
                  value={formData.contact.currentAddress}
                  onChange={e =>
                    updateSection('contact', 'currentAddress', e.target.value)
                  }
                  className={textareaClass}
                />
              </Field>

              <Field
                label='Permanent Address'
                className='sm:col-span-2 lg:col-span-3'
              >
                <textarea
                  value={formData.contact.permanentAddress}
                  onChange={e =>
                    updateSection('contact', 'permanentAddress', e.target.value)
                  }
                  className={textareaClass}
                />
              </Field>
            </div>
          </div>
        </div>

        {/* ==========================================
            JOB INFORMATION
        ========================================== */}

        <div className={sectionClass}>
          <SectionHeader
            icon={BriefcaseBusiness}
            title='Job Information'
            description='Edit employment and work details'
          />

          <div className='grid gap-6 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:p-6'>
            <Field label='Employee ID' required>
              <input
                value={formData.employment.employeeId}
                onChange={e =>
                  updateSection('employment', 'employeeId', e.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label='Department' required>
              <select
                value={formData.employment.department}
                onChange={e =>
                  updateSection('employment', 'department', e.target.value)
                }
                className={selectClass}
                disabled={departmentLoading}
              >
                <option value=''>
                  {departmentLoading
                    ? 'Loading departments...'
                    : 'Select department'}
                </option>

                {departments.map(department => (
                  <option key={department._id} value={department._id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label='Role' required>
              <select
                value={formData.employment.role}
                onChange={e =>
                  updateSection('employment', 'role', e.target.value)
                }
                className={selectClass}
              >
                <option value='employee'>Employee</option>
                <option value='hr'>HR</option>
                <option value='manager'>Manager</option>
              </select>
            </Field>

            <Field label='Designation' required>
              <input
                value={formData.employment.designation}
                onChange={e =>
                  updateSection('employment', 'designation', e.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label='Employment Type'>
              <select
                value={formData.employment.employmentType}
                onChange={e =>
                  updateSection('employment', 'employmentType', e.target.value)
                }
                className={selectClass}
              >
                <option value=''>Select type</option>
                <option value='full_time'>Full Time</option>
                <option value='part_time'>Part Time</option>
                <option value='intern'>Intern</option>
                <option value='freelancer'>Freelancer</option>
                <option value='contract'>Contract</option>
              </select>
            </Field>

            <Field label='Work Location'>
              <input
                value={formData.employment.workLocation}
                onChange={e =>
                  updateSection('employment', 'workLocation', e.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label='Joining Date'>
              <input
                type='date'
                value={formData.employment.joiningDate}
                onChange={e =>
                  updateSection('employment', 'joiningDate', e.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label='Probation End Date'>
              <input
                type='date'
                value={formData.employment.probationEndDate}
                onChange={e =>
                  updateSection(
                    'employment',
                    'probationEndDate',
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </Field>

            <Field label='Work Mode'>
              <select
                value={formData.employment.workMode}
                onChange={e =>
                  updateSection('employment', 'workMode', e.target.value)
                }
                className={selectClass}
              >
                <option value=''>Select mode</option>
                <option value='office'>Office</option>
                <option value='remote'>Remote</option>
                <option value='hybrid'>Hybrid</option>
              </select>
            </Field>

            <Field label='Shift From'>
              <input
                type='time'
                value={formData.employment.shiftFrom}
                onChange={e =>
                  updateSection('employment', 'shiftFrom', e.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label='Shift To'>
              <input
                type='time'
                value={formData.employment.shiftTo}
                onChange={e =>
                  updateSection('employment', 'shiftTo', e.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label='Employment Status'>
              <select
                value={formData.employment.employmentStatus}
                onChange={e =>
                  updateSection(
                    'employment',
                    'employmentStatus',
                    e.target.value
                  )
                }
                className={selectClass}
              >
                <option value='active'>Active</option>
                <option value='notice_period'>Notice Period</option>
                <option value='resigned'>Resigned</option>
                <option value='terminated'>Terminated</option>
              </select>
            </Field>
          </div>
        </div>

        {/* ==========================================
            PAYROLL
        ========================================== */}

        <div className={sectionClass}>
          <SectionHeader
            icon={WalletCards}
            title='Payroll'
            description='Edit salary, deductions and compensation'
          />

          <div className='p-5 sm:p-6'>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              <Field label='Basic Salary'>
                <input
                  type='number'
                  value={formData.payroll.basicSalary}
                  onChange={e =>
                    updateSection('payroll', 'basicSalary', e.target.value)
                  }
                  className={inputClass}
                />
              </Field>

              <Field label='HRA (%)'>
                <input
                  type='number'
                  value={formData.payroll.hraPercentage}
                  onChange={e =>
                    updateSection('payroll', 'hraPercentage', e.target.value)
                  }
                  className={inputClass}
                />
              </Field>

              <Field label='Conveyance Allowance'>
                <input
                  type='number'
                  value={formData.payroll.conveyanceAllowance}
                  onChange={e =>
                    updateSection(
                      'payroll',
                      'conveyanceAllowance',
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
              </Field>

              <Field label='Special Allowance'>
                <input
                  type='number'
                  value={formData.payroll.specialAllowance}
                  onChange={e =>
                    updateSection('payroll', 'specialAllowance', e.target.value)
                  }
                  className={inputClass}
                />
              </Field>

              <Field label='EPF (%)'>
                <input
                  type='number'
                  value={formData.payroll.epfPercentage}
                  onChange={e =>
                    updateSection('payroll', 'epfPercentage', e.target.value)
                  }
                  className={inputClass}
                />
              </Field>

              <Field label='Professional Tax (%)'>
                <input
                  type='number'
                  value={formData.payroll.professionalTaxPercentage}
                  onChange={e =>
                    updateSection(
                      'payroll',
                      'professionalTaxPercentage',
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
              </Field>

              <Field label='TDS'>
                <input
                  type='number'
                  value={formData.payroll.tds}
                  onChange={e =>
                    updateSection('payroll', 'tds', e.target.value)
                  }
                  className={inputClass}
                />
              </Field>

              <Field label='Employer PF (%)'>
                <input
                  type='number'
                  value={formData.payroll.employerPfPercentage}
                  onChange={e =>
                    updateSection(
                      'payroll',
                      'employerPfPercentage',
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
              </Field>
            </div>

            <div className='mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4'>
              <p className='text-xs text-gray-500'>
                Gross Salary, EPF amount, Professional Tax amount, Total
                Deductions, Net Salary, Employer PF amount and CTC should be
                recalculated by the backend from these editable payroll values.
              </p>
            </div>
          </div>
        </div>

        {/* ==========================================
            BANK
        ========================================== */}

        <div className={sectionClass}>
          <SectionHeader
            icon={Landmark}
            title='Bank Information'
            description='Edit employee banking details'
          />

          <div className='p-5 sm:p-6'>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              <Field label='Account Holder Name'>
                <input
                  value={formData.bank.accountHolderName}
                  onChange={e =>
                    updateSection('bank', 'accountHolderName', e.target.value)
                  }
                  className={inputClass}
                />
              </Field>

              <Field label='Bank Name'>
                <input
                  value={formData.bank.bankName}
                  onChange={e =>
                    updateSection('bank', 'bankName', e.target.value)
                  }
                  className={inputClass}
                />
              </Field>

              <Field label='Account Number'>
                <input
                  value={formData.bank.accountNumber}
                  onChange={e =>
                    updateSection('bank', 'accountNumber', e.target.value)
                  }
                  className={inputClass}
                />
              </Field>

              <Field label='IFSC Code'>
                <input
                  value={formData.bank.ifscCode}
                  onChange={e =>
                    updateSection(
                      'bank',
                      'ifscCode',
                      e.target.value.toUpperCase()
                    )
                  }
                  className={inputClass}
                />
              </Field>

              <Field label='Branch'>
                <input
                  value={formData.bank.branch}
                  onChange={e =>
                    updateSection('bank', 'branch', e.target.value)
                  }
                  className={inputClass}
                />
              </Field>
            </div>

            <div className='mt-8 border-t border-gray-100 pt-6'>
              <ExistingFile
                label='Bank Document'
                value={
                  formData.bank.bankDocument ? [formData.bank.bankDocument] : []
                }
                accept='.pdf,.jpg,.jpeg,.png'
                onView={() =>
                  openDocument('Bank Document', formData.bank.bankDocument)
                }
                onReplace={files =>
                  updateSection('bank', 'bankDocument', files[0] || null)
                }
                onRemove={() => updateSection('bank', 'bankDocument', null)}
              />
            </div>
          </div>
        </div>

        {/* ==========================================
            EDUCATION
        ========================================== */}

        <div className={sectionClass}>
          <SectionHeader
            icon={GraduationCap}
            title='Education'
            description='Edit academic qualifications and documents'
          />

          <div className='space-y-5 p-5 sm:p-6'>
            {formData.education.length === 0 && (
              <div className='rounded-xl border border-dashed border-gray-200 p-7 text-center'>
                <p className='text-sm font-semibold text-gray-600'>
                  No education details available.
                </p>

                <button
                  type='button'
                  onClick={() =>
                    setFormData(previous => ({
                      ...previous,
                      education: [
                        {
                          ...emptyEducation,
                          documents: []
                        }
                      ]
                    }))
                  }
                  className='mt-4 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-xs font-semibold text-white'
                >
                  <Plus size={14} />
                  Add Education
                </button>
              </div>
            )}

            {formData.education.map((education, index) => (
              <div
                key={index}
                className='rounded-xl border border-gray-200 bg-gray-50/50 p-5'
              >
                <div className='mb-5 flex items-center justify-between gap-4'>
                  <div>
                    <p className='text-sm font-bold text-black'>
                      Education {index + 1}
                    </p>

                    <p className='mt-1 text-xs text-gray-400'>
                      Academic qualification details
                    </p>
                  </div>

                  <button
                    type='button'
                    onClick={() => removeEducation(index)}
                    className='inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50'
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>

                <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                  <Field label='Qualification'>
                    <input
                      value={education.qualification}
                      onChange={e =>
                        updateEducation(index, 'qualification', e.target.value)
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label='University / Board'>
                    <input
                      value={education.university}
                      onChange={e =>
                        updateEducation(index, 'university', e.target.value)
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label='Passing Year'>
                    <input
                      type='number'
                      value={education.passingYear}
                      onChange={e =>
                        updateEducation(index, 'passingYear', e.target.value)
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label='Score'>
                    <input
                      type='number'
                      step='0.01'
                      value={education.score}
                      onChange={e =>
                        updateEducation(index, 'score', e.target.value)
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label='Score Type'>
                    <select
                      value={education.scoreType}
                      onChange={e =>
                        updateEducation(index, 'scoreType', e.target.value)
                      }
                      className={selectClass}
                    >
                      <option value='percentage'>Percentage</option>
                      <option value='cgpa'>CGPA</option>
                    </select>
                  </Field>

                  <Field label='Specialization'>
                    <input
                      value={education.specialization}
                      onChange={e =>
                        updateEducation(index, 'specialization', e.target.value)
                      }
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className='mt-7 border-t border-gray-200 pt-6'>
                  <div className='mb-3 flex items-center justify-between gap-4'>
                    <div>
                      <p className={labelClass}>Education Documents</p>

                      <p className='mt-1 text-xs text-gray-400'>
                        Existing documents can be viewed or replaced.
                      </p>
                    </div>

                    <button
                      type='button'
                      onClick={() => {
                        const input = document.getElementById(
                          `education-document-${index}`
                        )

                        input?.click()
                      }}
                      className='inline-flex items-center gap-1.5 rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white'
                    >
                      <Upload size={14} />
                      Add / Replace
                    </button>

                    <input
                      id={`education-document-${index}`}
                      type='file'
                      accept='.pdf,.jpg,.jpeg,.png'
                      multiple
                      className='hidden'
                      onChange={event => {
                        const files = Array.from(event.target.files || [])

                        if (files.length) {
                          replaceEducationDocument(index, files)
                        }

                        event.target.value = ''
                      }}
                    />
                  </div>

                  {education.documents.length > 0 ? (
                    <div className='space-y-2'>
                      {education.documents.map((document, documentIndex) => (
                        <div
                          key={documentIndex}
                          className='flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3'
                        >
                          <div className='flex min-w-0 items-center gap-3'>
                            <FileText
                              size={17}
                              className='shrink-0 text-gray-500'
                            />

                            <p className='truncate text-sm font-medium text-gray-700'>
                              {document instanceof File
                                ? document.name
                                : `Existing document ${documentIndex + 1}`}
                            </p>
                          </div>

                          <div className='flex shrink-0 gap-2'>
                            {typeof document === 'string' && (
                              <button
                                type='button'
                                onClick={() =>
                                  openDocument(
                                    `${
                                      education.qualification || 'Education'
                                    } Document ${documentIndex + 1}`,
                                    document
                                  )
                                }
                                className='rounded-lg border border-gray-200 p-2 hover:border-black'
                              >
                                <Eye size={14} />
                              </button>
                            )}

                            <button
                              type='button'
                              onClick={() => {
                                const updated = education.documents.filter(
                                  (_, itemIndex) => itemIndex !== documentIndex
                                )

                                updateEducationDocuments(index, updated)
                              }}
                              className='rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50'
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-400'>
                      No education documents uploaded.
                    </p>
                  )}
                </div>
              </div>
            ))}

            <button
              type='button'
              onClick={addEducation}
              className='inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:border-black hover:text-black'
            >
              <Plus size={14} />
              Add Education
            </button>
          </div>
        </div>

        {/* ==========================================
            EXPERIENCE
        ========================================== */}

        <div className={sectionClass}>
          <SectionHeader
            icon={Building2}
            title='Experience Information'
            description='Edit previous employment details'
          />

          <div className='space-y-5 p-5 sm:p-6'>
            {formData.experience.length === 0 && (
              <div className='rounded-xl border border-dashed border-gray-200 p-7 text-center'>
                <p className='text-sm font-semibold text-gray-600'>
                  No experience details available.
                </p>
              </div>
            )}

            {formData.experience.map((experience, index) => (
              <div
                key={index}
                className='rounded-xl border border-gray-200 bg-gray-50/50 p-5'
              >
                <div className='mb-5 flex items-center justify-between gap-4'>
                  <div>
                    <p className='text-sm font-bold text-black'>
                      Experience {index + 1}
                    </p>

                    <p className='mt-1 text-xs text-gray-400'>
                      Previous employment details
                    </p>
                  </div>

                  <button
                    type='button'
                    onClick={() => removeExperience(index)}
                    className='inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50'
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>

                <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                  <Field label='Company Name'>
                    <input
                      value={experience.companyName}
                      onChange={e =>
                        updateExperience(index, 'companyName', e.target.value)
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label='Designation'>
                    <input
                      value={experience.designation}
                      onChange={e =>
                        updateExperience(index, 'designation', e.target.value)
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label='Total Experience'>
                    <input
                      value={experience.totalExperience}
                      onChange={e =>
                        updateExperience(
                          index,
                          'totalExperience',
                          e.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label='Skills'>
                    <input
                      value={experience.skills}
                      onChange={e =>
                        updateExperience(index, 'skills', e.target.value)
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label='Start Date'>
                    <input
                      type='date'
                      value={experience.startDate}
                      onChange={e =>
                        updateExperience(index, 'startDate', e.target.value)
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label='End Date'>
                    <input
                      type='date'
                      value={experience.endDate}
                      onChange={e =>
                        updateExperience(index, 'endDate', e.target.value)
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field
                    label='Reason for Leaving'
                    className='sm:col-span-2 lg:col-span-3'
                  >
                    <textarea
                      value={experience.reasonForLeaving}
                      onChange={e =>
                        updateExperience(
                          index,
                          'reasonForLeaving',
                          e.target.value
                        )
                      }
                      className={textareaClass}
                    />
                  </Field>
                </div>
              </div>
            ))}

            <button
              type='button'
              onClick={addExperience}
              className='inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:border-black hover:text-black'
            >
              <Plus size={14} />
              Add Experience
            </button>
          </div>
        </div>

        {/* ==========================================
            DOCUMENTS
        ========================================== */}

        <div className={sectionClass}>
          <SectionHeader
            icon={FileText}
            title='Documents'
            description='View, replace or remove employee verification documents'
          />

          <div className='grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3'>
            {Object.keys(documentNames).map(documentType => (
              <ExistingFile
                key={documentType}
                label={documentNames[documentType]}
                value={formData.documents[documentType]}
                accept='.pdf,.jpg,.jpeg,.png'
                onView={() =>
                  openDocument(
                    documentNames[documentType],
                    formData.documents[documentType]
                  )
                }
                onReplace={(files, multiple) =>
                  replaceGeneralDocument(documentType, files, multiple)
                }
                onRemove={() => removeGeneralDocument(documentType)}
                multiple={false}
              />
            ))}
          </div>
        </div>

        {/* ==========================================
            BOTTOM ACTIONS
        ========================================== */}

        <div className='sticky bottom-4 z-20 mt-6 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between'>
          <button
            type='button'
            onClick={() => navigate(`/hr/employees/${id}`)}
            className='inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:border-black hover:text-black'
          >
            <X size={15} />
            Cancel
          </button>

          <button
            type='button'
            onClick={handleSave}
            disabled={updateEmployeeLoading}
            className='inline-flex items-center justify-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60'
          >
            {updateEmployeeLoading ? (
              <>
                <Loader2 size={15} className='animate-spin' />
                Saving Changes...
              </>
            ) : (
              <>
                <Save size={15} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* ==========================================
          DOCUMENT PREVIEW
      ========================================== */}

      {selectedDocument && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'>
          <div className='flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl'>
            <div className='flex items-center justify-between border-b border-gray-100 px-5 py-4'>
              <div>
                <p className='text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400'>
                  Document Preview
                </p>
                <h3 className='mt-1 text-base font-bold text-black'>
                  {selectedDocument.name}
                </h3>
              </div>

              <button
                type='button'
                onClick={() => setSelectedDocument(null)}
                className='rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-black'
              >
                <X size={18} />
              </button>
            </div>

            <div className='flex min-h-[500px] items-center justify-center overflow-auto bg-gray-100 p-4'>
              {selectedDocument.url.toLowerCase().includes('.pdf') ? (
                <iframe
                  src={selectedDocument.url}
                  title={selectedDocument.name}
                  className='h-[70vh] w-full rounded-lg bg-white'
                />
              ) : (
                <img
                  src={selectedDocument.url}
                  alt={selectedDocument.name}
                  className='max-h-[70vh] max-w-full rounded-lg object-contain'
                />
              )}
            </div>

            <div className='flex justify-end border-t border-gray-100 px-5 py-4'>
              <button
                type='button'
                onClick={() => setSelectedDocument(null)}
                className='rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
