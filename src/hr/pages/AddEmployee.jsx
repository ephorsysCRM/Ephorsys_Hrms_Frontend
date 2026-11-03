import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import CustomStepper from '../components/stepper/CustomStepper'

import BasicInformation from '../components/steps/BasicInfo'
import ContactInfo from '../components/steps/ContactInfo'
import JobInfo from '../components/steps/JobInfo'
import PayRollInfo from '../components/steps/PayRollInfo'
import BankInfo from '../components/steps/BankInfo'
import Education from '../components/steps/Education'
import ExperienceInfo from '../components/steps/ExperienceInfo'
import DocUpload from '../components/steps/DocUpload'

import { validateInfo } from '../utils/ValidateInfo'
import { validateContactInfo } from '../utils/ValidateContactInfo'
import { validateBankInfo } from '../utils/ValidateBankInfo'
import { validatePayRoll } from '../utils/ValidatePayRoll'
import { validateEducation } from '../utils/ValidateEducation'
import { validateExperience } from '../utils/ValidateExperience'
import { validateDoc } from '../utils/ValidateDoc'
import { validateJobInfo } from '../utils/ValidateJobInfo'
import { createEmployee } from '../../redux/features/employee/employeeThunk'

export default function AddEmployee () {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // =====================================================
  // REDUX
  // =====================================================

  const { createEmployeeLoading, createEmployeeError } = useSelector(
    state => state.employee
  )

  // =====================================================
  // ACTIVE STEP
  // =====================================================

  const [activeStep, setActiveStep] = useState(0)

  // =====================================================
  // VALIDATION ERRORS
  // =====================================================

  const [validationErrors, setValidationErrors] = useState({})

  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    // =================================================
    // BASIC INFORMATION
    // =================================================

    basic: {
      employeeId: '',
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      maritalStatus: '',
      bloodGroup: '',
      address: '',
      profilePhoto: null
    },

    // =================================================
    // CONTACT INFORMATION
    // =================================================

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

    // =================================================
    // JOB INFORMATION
    // =================================================

    employment: {
      employeeId: '',
      department: '',
      designation: '',
      joiningDate: '',
      employmentType: '',
      reportingManager: '',
      workLocation: '',
      probationEndDate: '',
      shiftFrom: '',
      shiftTo: '',
      workMode: '',
      employmentStatus: ''
    },

    // =================================================
    // PAYROLL
    // =================================================

    payroll: {
      basicSalary: '',
      allowances: '',
      deductions: '',
      pf: '',
      pt: '',
      payrollFrequency: '',

      hraPercentage: '',
      conveyanceAllowance: '',
      specialAllowance: '',
      epfPercentage: '',
      professionalTaxPercentage: '',
      tds: '',
      employerPfPercentage: ''
    },

    // =================================================
    // BANK
    // =================================================

    bank: {
      accountHolderName: '',
      bankName: '',
      accountNumber: '',
      confirmAccountNumber: '',

      /*
       * IMPORTANT
       *
       * Use backend-compatible names.
       */

      ifscCode: '',
      branch: '',

      bankDocument: null
    },

    // =================================================
    // EDUCATION
    // =================================================

    education: [
      {
        qualification: '',
        university: '',
        passingYear: '',
        score: '',
        scoreType: 'percentage',
        specialization: '',
        documents: []
      }
    ],

    // =================================================
    // EXPERIENCE
    // =================================================

    experience: [
      {
        companyName: '',
        designation: '',
        totalExperience: '',
        skills: '',
        startDate: '',
        endDate: '',
        reasonForLeaving: ''
      }
    ],

    // =================================================
    // DOCUMENTS
    // =================================================

    documents: {
      aadhaar: [],
      pan: [],
      resume: [],
      offerLetter: [],
      experienceLetter: [],
      signedNda: [],
      idCard: []
    }
  })

  // =====================================================
  // STEPS
  // =====================================================

  const steps = [
    {
      title: 'Basic Information'
    },
    {
      title: 'Contact Information'
    },
    {
      title: 'Job Information'
    },
    {
      title: 'Payroll'
    },
    {
      title: 'Bank Information'
    },
    {
      title: 'Education'
    },
    {
      title: 'Experience'
    },
    {
      title: 'Document Verification'
    }
  ]

  // =====================================================
  // UPDATE SECTION
  // =====================================================

  const updateSection = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }))
  }

  // =====================================================
  // CONTINUE
  // =====================================================

  const handleContinue = () => {
    let errors = {}

    switch (activeStep) {
      case 0:
        errors = validateInfo(formData.basic)

        break

      case 1:
        errors = validateContactInfo(formData.contact)

        break

      case 2:
        errors = validateJobInfo(formData.employment)

        break

      case 3:
        errors = validatePayRoll(formData.payroll)

        break

      case 4:
        errors = validateBankInfo(formData.bank)

        break

      case 5:
        errors = validateEducation(formData.education)

        break

      case 6:
        errors = validateExperience(formData.experience)

        break

      case 7:
        errors = validateDoc(formData.documents)

        break

      default:
        errors = {}
    }

    setValidationErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    setActiveStep(prev => Math.min(prev + 1, steps.length - 1))

    setValidationErrors({})
  }

  // =====================================================
  // BACK
  // =====================================================

  const previousStep = () => {
    setValidationErrors({})

    setActiveStep(prev => Math.max(prev - 1, 0))
  }

  // =====================================================
  // STEPPER
  // =====================================================

  const handleStepClick = stepIndex => {
    if (stepIndex > activeStep) {
      if (activeStep === 0) {
        const errors = validateInfo(formData.basic)

        setValidationErrors(errors)

        if (Object.keys(errors).length > 0) {
          return
        }
      }
    }

    setValidationErrors({})

    setActiveStep(stepIndex)
  }

  // =====================================================
  // CREATE EMPLOYEE
  // =====================================================

  const handleCreateEmployee = async () => {
    // =============================================
    // BASIC VALIDATION
    // =============================================

    const basicErrors = validateInfo(formData.basic)

    if (Object.keys(basicErrors).length > 0) {
      setActiveStep(0)

      setValidationErrors(basicErrors)

      return
    }

    // =============================================
    // PROFILE PHOTO
    // =============================================

    const profilePhoto = formData.basic.profilePhoto

    if (!profilePhoto || !(profilePhoto instanceof File)) {
      setActiveStep(0)

      setValidationErrors({
        profilePhoto: 'Profile photo is required'
      })

      return
    }

    // =============================================
    // BANK DOCUMENT
    // =============================================

    const bankDocument = formData.bank.bankDocument

    if (!bankDocument || !(bankDocument instanceof File)) {
      setActiveStep(4)

      setValidationErrors({
        bankDocument: 'Bank document is required'
      })

      return
    }

    // =============================================
    // BANK FIELDS
    // =============================================

    const ifscCode = formData.bank.ifscCode?.trim()

    const branch = formData.bank.branch?.trim()

    if (!ifscCode) {
      setActiveStep(4)

      setValidationErrors({
        ifscCode: 'IFSC Code is required'
      })

      return
    }

    if (!branch) {
      setActiveStep(4)

      setValidationErrors({
        branch: 'Branch is required'
      })

      return
    }

    try {
      // =========================================
      // CREATE FORMDATA
      // =========================================

      const payload = new FormData()

      // =========================================
      // BASIC INFORMATION
      // =========================================

      payload.append('employeeId', formData.basic.employeeId || '')

      payload.append('firstName', formData.basic.firstName || '')

      payload.append('middleName', formData.basic.middleName || '')

      payload.append('lastName', formData.basic.lastName || '')

      payload.append('dateOfBirth', formData.basic.dateOfBirth || '')

      payload.append('gender', formData.basic.gender || '')

      payload.append('maritalStatus', formData.basic.maritalStatus || '')

      payload.append('bloodGroup', formData.basic.bloodGroup || '')

      payload.append('address', formData.basic.address || '')

      // =========================================
      // PROFILE PHOTO
      // =========================================

      payload.append('profilePhoto', profilePhoto)

      // =========================================
      // CONTACT
      // =========================================

      payload.append('personalEmail', formData.contact.personalEmail || '')

      payload.append('officialEmail', formData.contact.officialEmail || '')

      payload.append('mobile', formData.contact.mobile || '')

      payload.append('alternateMobile', formData.contact.alternateMobile || '')

      payload.append(
        'emergencyContactName',
        formData.contact.emergencyContactName || ''
      )

      payload.append(
        'emergencyContactNumber',
        formData.contact.emergencyContactNumber || ''
      )

      payload.append('city', formData.contact.city || '')

      payload.append('state', formData.contact.state || '')

      payload.append('pinCode', formData.contact.pinCode || '')

      payload.append('currentAddress', formData.contact.currentAddress || '')

      payload.append(
        'permanentAddress',
        formData.contact.permanentAddress || ''
      )

      // =========================================
      // JOB
      // =========================================

      payload.append('department', formData.employment.department || '')

      payload.append('designation', formData.employment.designation || '')

      payload.append('role', formData.employment.role || 'employee')

      payload.append('joiningDate', formData.employment.joiningDate || '')

      payload.append('employmentType', formData.employment.employmentType || '')

      payload.append('workLocation', formData.employment.workLocation || '')

      payload.append(
        'probationEndDate',
        formData.employment.probationEndDate || ''
      )

      payload.append('shiftFrom', formData.employment.shiftFrom || '')

      payload.append('shiftTo', formData.employment.shiftTo || '')

      payload.append('workMode', formData.employment.workMode || '')

      payload.append(
        'employmentStatus',
        formData.employment.employmentStatus || ''
      )

      // =========================================
      // PAYROLL
      // =========================================

      payload.append('basicSalary', formData.payroll.basicSalary || 0)

      payload.append('hraPercentage', formData.payroll.hraPercentage || 0)

      payload.append(
        'conveyanceAllowance',
        formData.payroll.conveyanceAllowance || 0
      )

      payload.append('specialAllowance', formData.payroll.specialAllowance || 0)

      payload.append(
        'epfPercentage',
        formData.payroll.epfPercentage || formData.payroll.pf || 0
      )

      payload.append(
        'professionalTaxPercentage',
        formData.payroll.professionalTaxPercentage || formData.payroll.pt || 0
      )

      payload.append('tds', formData.payroll.tds || 0)

      payload.append(
        'employerPfPercentage',
        formData.payroll.employerPfPercentage || 0
      )

      payload.append(
        'payrollFrequency',
        formData.payroll.payrollFrequency || ''
      )

      // =========================================
      // BANK INFORMATION
      // =========================================

      payload.append('bankName', formData.bank.bankName || '')

      payload.append('accountHolderName', formData.bank.accountHolderName || '')

      payload.append('accountNumber', formData.bank.accountNumber || '')

      /*
       * EXACT BACKEND FIELD
       */

      payload.append('ifscCode', ifscCode)

      /*
       * EXACT BACKEND FIELD
       */

      payload.append('branch', branch)

      // =========================================
      // BANK DOCUMENT
      // =========================================

      payload.append('bankDocument', bankDocument)

      // =========================================
      // EDUCATION
      // =========================================

      const educationList = formData.education.map(education => ({
        qualification: education.qualification || '',

        university: education.university || '',

        passingYear: education.passingYear || '',

        score: education.score || '',

        scoreType: education.scoreType || 'percentage',

        specialization: education.specialization || ''
      }))

      payload.append('educationList', JSON.stringify(educationList))

      // =========================================
      // EDUCATION DOCUMENTS
      // =========================================

      formData.education.forEach((education, index) => {
        if (!Array.isArray(education.documents)) {
          return
        }

        education.documents.forEach(file => {
          if (file instanceof File) {
            payload.append(`educationDocuments_${index}`, file)
          }
        })
      })

      // =========================================
      // EXPERIENCE
      // =========================================

      const experienceList = formData.experience.map(experience => ({
        companyName: experience.companyName || '',

        designation: experience.designation || '',

        totalExperience: experience.totalExperience || '',

        skills: experience.skills || '',

        startDate: experience.startDate || '',

        endDate: experience.endDate || '',

        reasonForLeaving: experience.reasonForLeaving || ''
      }))

      payload.append('experienceList', JSON.stringify(experienceList))

      // =========================================
      // GENERAL DOCUMENTS
      // =========================================

      const documentFields = [
        'aadhaar',
        'pan',
        'resume',
        'offerLetter',
        'signedNda',
        'idCard'
      ]

      documentFields.forEach(documentKey => {
        const files = formData.documents[documentKey]

        if (!Array.isArray(files)) {
          return
        }

        files.forEach(file => {
          if (file instanceof File) {
            payload.append(`documents_${documentKey}`, file)
          }
        })
      })

      // =========================================
      // DEBUG FORMDATA
      // =========================================

      console.log('================================')

      console.log('CREATE EMPLOYEE FORMDATA')

      console.log('================================')

      for (const [key, value] of payload.entries()) {
        if (value instanceof File) {
          console.log(key, {
            name: value.name,

            type: value.type,

            size: value.size
          })
        } else {
          console.log(key, value)
        }
      }

      // =========================================
      // API
      // =========================================

      const result = await dispatch(createEmployee(payload))

      console.log('CREATE EMPLOYEE RESULT:', result)

      // =========================================
      // SUCCESS
      // =========================================

      if (result?.success) {
        alert(result.message || 'Employee created successfully!')

        if (location.pathname.startsWith('/hr/')) {
          navigate('/hr/all-employees')
        } else {
          navigate('/admin/all-employees')
        }

        return
      }

      // =========================================
      // FAILURE
      // =========================================

      alert(result?.message || 'Failed to create employee')
    } catch (error) {
      console.error('CREATE EMPLOYEE ERROR:', error)

      alert(
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong while creating employee'
      )
    }
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className='min-h-screen w-full px-2'>
      <div className='w-full'>
        <div className='w-full'>
          {/* =====================================
                        STEPPER
                    ===================================== */}

          <CustomStepper
            steps={steps}
            activeStep={activeStep}
            onStepClick={handleStepClick}
          />

          {/* =====================================
                        CONTENT
                    ===================================== */}

          <div className='min-h-100 py-2'>
            {/* =================================
                            STEP 1
                        ================================= */}

            {activeStep === 0 && (
              <BasicInformation
                data={formData.basic}
                errors={validationErrors}
                onChange={data => updateSection('basic', data)}
              />
            )}

            {/* =================================
                            STEP 2
                        ================================= */}

            {activeStep === 1 && (
              <ContactInfo
                data={formData.contact}
                errors={validationErrors}
                onChange={data => updateSection('contact', data)}
              />
            )}

            {/* =================================
                            STEP 3
                        ================================= */}

            {activeStep === 2 && (
              <JobInfo
                data={formData.employment}
                errors={validationErrors}
                onChange={data => updateSection('employment', data)}
              />
            )}

            {/* =================================
                            STEP 4
                        ================================= */}

            {activeStep === 3 && (
              <PayRollInfo
                data={formData.payroll}
                errors={validationErrors}
                onChange={data => updateSection('payroll', data)}
              />
            )}

            {/* =================================
                            STEP 5
                        ================================= */}

            {activeStep === 4 && (
              <BankInfo
                data={formData.bank}
                errors={validationErrors}
                onChange={data => updateSection('bank', data)}
              />
            )}

            {/* =================================
                            STEP 6
                        ================================= */}

            {activeStep === 5 && (
              <Education
                data={formData.education}
                errors={validationErrors}
                onChange={data => updateSection('education', data)}
              />
            )}

            {/* =================================
                            STEP 7
                        ================================= */}

            {activeStep === 6 && (
              <ExperienceInfo
                data={formData.experience}
                errors={validationErrors}
                onChange={data => updateSection('experience', data)}
              />
            )}

            {/* =================================
                            STEP 8
                        ================================= */}

            {activeStep === 7 && (
              <DocUpload
                data={formData.documents}
                errors={validationErrors}
                onChange={data => updateSection('documents', data)}
              />
            )}
          </div>

          {/* =====================================
                        API ERROR
                    ===================================== */}

          {createEmployeeError && (
            <div className='mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'>
              {createEmployeeError}
            </div>
          )}

          {/* =====================================
                        NAVIGATION
                    ===================================== */}

          <div className='mt-8 flex items-center justify-between border-t border-gray-200 pt-5'>
            {/* =================================
                            BACK
                        ================================= */}

            <button
              type='button'
              onClick={previousStep}
              disabled={activeStep === 0 || createEmployeeLoading}
              className='rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40'
            >
              Back
            </button>

            {/* =================================
                            CONTINUE
                        ================================= */}

            {activeStep < steps.length - 1 ? (
              <button
                type='button'
                onClick={handleContinue}
                disabled={createEmployeeLoading}
                className='rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50'
              >
                Continue
              </button>
            ) : (
              <button
                type='button'
                onClick={handleCreateEmployee}
                disabled={createEmployeeLoading}
                className='rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50'
              >
                {createEmployeeLoading
                  ? 'Creating Employee...'
                  : 'Create Employee'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
