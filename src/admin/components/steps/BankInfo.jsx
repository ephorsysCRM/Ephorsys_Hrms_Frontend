import { useEffect, useState } from 'react'

import { validateBankInfo } from '../../utils/ValidateBankInfo'

export default function BankInfo ({ data, onChange, errors = {} }) {
  // =====================================================
  // LOCAL VALIDATION STATE
  // =====================================================

  const [fieldErrors, setFieldErrors] = useState({})

  // =====================================================
  // NORMALIZE OLD DATA
  // =====================================================

  /*
   * This also supports your old field names if old data
   * is already present.
   *
   * Old:
   * ifsc
   * branchName
   * passbookDocument
   *
   * New:
   * ifscCode
   * branch
   * bankDocument
   */

  const ifscCode = data?.ifscCode || data?.ifsc || ''

  const branch = data?.branch || data?.branchName || ''

  const bankDocument = data?.bankDocument || data?.passbookDocument || null

  // =====================================================
  // UPDATE FIELD
  // =====================================================

  const update = (field, value) => {
    onChange({
      ...data,
      [field]: value
    })
  }

  // =====================================================
  // VALIDATE FIELD
  // =====================================================

  const validateField = field => {
    const validationErrors = validateBankInfo({
      ...data,

      ifscCode,
      branch,
      bankDocument
    })

    setFieldErrors(prev => ({
      ...prev,
      [field]: validationErrors?.[field] || ''
    }))
  }

  // =====================================================
  // SYNC OLD FIELD NAMES
  // =====================================================

  useEffect(() => {
    /*
     * If old data exists, convert it once to the
     * new backend-compatible field names.
     */

    if (data?.ifsc && !data?.ifscCode) {
      onChange({
        ...data,
        ifscCode: data.ifsc
      })

      return
    }

    if (data?.branchName && !data?.branch) {
      onChange({
        ...data,
        branch: data.branchName
      })

      return
    }

    if (data?.passbookDocument && !data?.bankDocument) {
      onChange({
        ...data,
        bankDocument: data.passbookDocument
      })
    }
  }, [])

  // =====================================================
  // LABEL
  // =====================================================

  const Label = ({ children, required = false }) => (
    <label className='text-sm font-medium text-gray-800'>
      {children}

      {required && <span className='ml-1 text-red-500'>*</span>}
    </label>
  )

  // =====================================================
  // INPUT CLASS
  // =====================================================

  const inputClass = field => {
    const hasError = errors?.[field] || fieldErrors?.[field]

    return `
            mt-2
            w-full
            rounded-lg
            border
            px-3
            py-2.5
            outline-none
            transition
            ${
              hasError
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-300 focus:border-black'
            }
        `
  }

  // =====================================================
  // DOCUMENT ERROR
  // =====================================================

  const documentError =
    errors?.bankDocument ||
    errors?.passbookDocument ||
    fieldErrors?.bankDocument ||
    fieldErrors?.passbookDocument

  // =====================================================
  // UI
  // =====================================================

  return (
    <div>
      {/* =================================================
                HEADER
            ================================================= */}

      <div className='mb-6'>
        <h2 className='text-xl font-semibold text-black'>Bank Information</h2>

        <p className='mt-1 text-sm text-gray-500'>
          Enter the employee's bank account and payment information.
        </p>
      </div>

      {/* =================================================
                FORM
            ================================================= */}

      <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
        {/* =================================================
                    BANK NAME
                ================================================= */}

        <div>
          <Label required>Bank Name</Label>

          <input
            type='text'
            value={data?.bankName || ''}
            onChange={e => update('bankName', e.target.value)}
            onBlur={() => validateField('bankName')}
            placeholder='Enter bank name'
            className={inputClass('bankName')}
          />

          {(errors?.bankName || fieldErrors?.bankName) && (
            <p className='mt-1 text-xs text-red-500'>
              {errors?.bankName || fieldErrors?.bankName}
            </p>
          )}
        </div>

        {/* =================================================
                    ACCOUNT HOLDER NAME
                ================================================= */}

        <div>
          <Label required>Account Holder Name</Label>

          <input
            type='text'
            value={data?.accountHolderName || ''}
            onChange={e => update('accountHolderName', e.target.value)}
            onBlur={() => validateField('accountHolderName')}
            placeholder='Enter account holder name'
            className={inputClass('accountHolderName')}
          />

          {(errors?.accountHolderName || fieldErrors?.accountHolderName) && (
            <p className='mt-1 text-xs text-red-500'>
              {errors?.accountHolderName || fieldErrors?.accountHolderName}
            </p>
          )}
        </div>

        {/* =================================================
                    ACCOUNT NUMBER
                ================================================= */}

        <div>
          <Label required>Account Number</Label>

          <input
            type='text'
            inputMode='numeric'
            value={data?.accountNumber || ''}
            onChange={e => update('accountNumber', e.target.value)}
            onBlur={() => validateField('accountNumber')}
            placeholder='Enter account number'
            className={inputClass('accountNumber')}
          />

          {(errors?.accountNumber || fieldErrors?.accountNumber) && (
            <p className='mt-1 text-xs text-red-500'>
              {errors?.accountNumber || fieldErrors?.accountNumber}
            </p>
          )}
        </div>

        {/* =================================================
                    IFSC CODE
                ================================================= */}

        <div>
          <Label required>IFSC Code</Label>

          <input
            type='text'
            value={ifscCode}
            onChange={e => update('ifscCode', e.target.value.toUpperCase())}
            onBlur={() => validateField('ifscCode')}
            placeholder='Enter IFSC code'
            className={inputClass('ifscCode')}
          />

          {(errors?.ifscCode || errors?.ifsc || fieldErrors?.ifscCode) && (
            <p className='mt-1 text-xs text-red-500'>
              {errors?.ifscCode || errors?.ifsc || fieldErrors?.ifscCode}
            </p>
          )}
        </div>

        {/* =================================================
                    BRANCH
                ================================================= */}

        <div>
          <Label required>Branch</Label>

          <input
            type='text'
            value={branch}
            onChange={e => update('branch', e.target.value)}
            onBlur={() => validateField('branch')}
            placeholder='Enter branch name'
            className={inputClass('branch')}
          />

          {(errors?.branch || errors?.branchName || fieldErrors?.branch) && (
            <p className='mt-1 text-xs text-red-500'>
              {errors?.branch || errors?.branchName || fieldErrors?.branch}
            </p>
          )}
        </div>

        {/* =================================================
                    BANK DOCUMENT
                ================================================= */}

        <div>
          <Label required>Passbook / Bank Document</Label>

          <input
            type='file'
            accept='.pdf,.jpg,.jpeg,.png'
            onChange={e => {
              const file = e.target.files?.[0] || null

              update('bankDocument', file)

              /*
               * Allow selecting the same
               * file again.
               */

              e.target.value = ''
            }}
            className={`
                            mt-2
                            block
                            w-full
                            rounded-lg
                            border
                            bg-white
                            px-3
                            py-2
                            text-sm
                            text-gray-700
                            file:mr-4
                            file:rounded-md
                            file:border-0
                            file:bg-black
                            file:px-4
                            file:py-2
                            file:text-sm
                            file:font-medium
                            file:text-white
                            hover:file:bg-gray-800
                            ${
                              documentError
                                ? 'border-red-500'
                                : 'border-gray-300'
                            }
                        `}
          />

          <p className='mt-1 text-xs text-gray-500'>
            Upload passbook or bank proof in PDF, JPG, JPEG, or PNG format.
          </p>

          {/* =============================================
                        SELECTED FILE
                    ============================================= */}

          {bankDocument && (
            <div className='mt-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2'>
              <p className='truncate text-xs font-medium text-gray-700'>
                {bankDocument?.name || 'Bank document selected'}
              </p>
            </div>
          )}

          {/* =============================================
                        ERROR
                    ============================================= */}

          {documentError && (
            <p className='mt-1 text-xs text-red-500'>{documentError}</p>
          )}
        </div>
      </div>
    </div>
  )
}
