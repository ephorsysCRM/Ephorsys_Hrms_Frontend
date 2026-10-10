
import {
  Download,
  Building2,
  UserRound,
  CheckCircle2,
  Clock3,
  CircleAlert
} from 'lucide-react'
import image from '/icon.png'

const formatCurrency = amount =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount)

const getEarnings = payslip =>
  payslip.basicSalary +
  payslip.hra +
  payslip.conveyance +
  payslip.specialAllowance +
  payslip.bonus

const getDeductions = payslip =>
  payslip.pf +
  payslip.professionalTax +
  payslip.tds

const getNetSalary = payslip =>
  getEarnings(payslip) - getDeductions(payslip)

const StatusBadge = ({ status }) => {
  const styles = {
    Paid: 'bg-green-50 text-green-700 border-green-200',
    Processing: 'bg-amber-50 text-amber-700 border-amber-200',
    Pending: 'bg-gray-100 text-gray-600 border-gray-200'
  }

  const StatusIcon =
    status === 'Paid'
      ? CheckCircle2
      : status === 'Processing'
        ? Clock3
        : CircleAlert

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
        styles[status] || styles.Pending
      }`}
    >
      <StatusIcon size={13} />
      {status}
    </span>
  )
}

const SalaryRow = ({ label, amount, highlight = false }) => (
  <div
    className={`flex items-center justify-between gap-4 py-3 ${
      highlight ? 'font-semibold text-gray-900' : 'text-gray-600'
    }`}
  >
    <span className='text-sm'>{label}</span>

    <span className='text-sm tabular-nums'>
      {formatCurrency(amount)}
    </span>
  </div>
)

const PayslipModal = ({ payslip, employee, onClose }) => {
  if (!payslip || !employee) return null

  const handleDownload = () => {
    window.print()
  }

  return (
    <>
      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }

          .payslip-print,
          .payslip-print * {
            visibility: visible !important;
          }

          .payslip-print {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          @page {
            size: A4;
            margin: 10mm;
          }
        }
      `}</style>

      {/* Printable Payslip */}
      <div className='payslip-print w-full overflow-hidden rounded-xl bg-white'>

        {/* Company Details */}
        <div className='border-b-2 border-gray-900 pb-5'>
          <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-start'>
            <div>
              <div className='mb-3 inline-flex rounded-md  bg-gray-950 p-1 text-white'>
                <img className='w-9 h-9' src={image} alt="" />
              </div>

              <h2 className='text-xl font-bold'>
                Ephorsys Pvt. Ltd.
              </h2>

              <p className='mt-1 text-sm text-gray-500'>
                Employee salary statement
              </p>
            </div>

            <div className='sm:text-right'>
              <p className='text-xs font-semibold uppercase tracking-widest text-gray-500'>
                Payslip for
              </p>

              <h3 className='mt-1 text-lg font-bold'>
                {payslip.month} {payslip.year}
              </h3>

              <p className='mt-1 text-xs text-gray-500'>
                ID: {payslip.id}
              </p>

              <div className='mt-2'>
                <StatusBadge status={payslip.status} />
              </div>
            </div>
          </div>
        </div>

        {/* Employee Details */}
        <div className='grid grid-cols-1 gap-4 border-b border-gray-200 py-5 sm:grid-cols-2'>
          <div className='flex gap-3'>
            <div className='h-fit rounded-lg bg-gray-100 p-2'>
              <UserRound size={18} />
            </div>

            <div>
              <p className='text-xs text-gray-500'>
                Employee name
              </p>

              <p className='mt-1 text-sm font-semibold'>
                {employee.name}
              </p>

              <p className='mt-1 text-xs text-gray-500'>
                {employee.employeeId}
              </p>
            </div>
          </div>

          <div className='flex gap-3'>
            <div className='h-fit rounded-lg bg-gray-100 p-2'>
              <Building2 size={18} />
            </div>

            <div>
              <p className='text-xs text-gray-500'>
                Department / Role
              </p>

              <p className='mt-1 text-sm font-semibold'>
                {employee.department}
              </p>

              <p className='mt-1 text-xs text-gray-500'>
                {employee.designation}
              </p>
            </div>
          </div>
        </div>

        {/* Salary Overview */}
        <div className='my-5 rounded-xl bg-gray-950 p-5 text-white sm:p-6'>
          <p className='text-sm text-gray-300'>
            Net salary payable
          </p>

          <h2 className='mt-2 text-3xl font-bold tracking-tight'>
            {formatCurrency(getNetSalary(payslip))}
          </h2>

          <div className='mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-300'>
            <span>
              Gross earnings: {formatCurrency(getEarnings(payslip))}
            </span>

            <span>
              Deductions: {formatCurrency(getDeductions(payslip))}
            </span>
          </div>
        </div>

        {/* Earnings and Deductions */}
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>

          {/* Earnings */}
          <div className='rounded-xl border border-gray-200 p-4'>
            <h3 className='mb-2 border-b border-gray-100 pb-3 text-sm font-bold'>
              Earnings
            </h3>

            <SalaryRow
              label='Basic salary'
              amount={payslip.basicSalary}
            />

            <SalaryRow
              label='House rent allowance'
              amount={payslip.hra}
            />

            <SalaryRow
              label='Conveyance allowance'
              amount={payslip.conveyance}
            />

            <SalaryRow
              label='Special allowance'
              amount={payslip.specialAllowance}
            />

            <SalaryRow
              label='Bonus'
              amount={payslip.bonus}
            />

            <div className='mt-2 border-t border-gray-200 pt-1'>
              <SalaryRow
                label='Gross earnings'
                amount={getEarnings(payslip)}
                highlight
              />
            </div>
          </div>

          {/* Deductions */}
          <div className='rounded-xl border border-gray-200 p-4'>
            <h3 className='mb-2 border-b border-gray-100 pb-3 text-sm font-bold'>
              Deductions
            </h3>

            <SalaryRow
              label='Provident fund (PF)'
              amount={payslip.pf}
            />

            <SalaryRow
              label='Professional tax'
              amount={payslip.professionalTax}
            />

            <SalaryRow
              label='TDS'
              amount={payslip.tds}
            />

            <div className='mt-2 border-t border-gray-200 pt-1'>
              <SalaryRow
                label='Total deductions'
                amount={getDeductions(payslip)}
                highlight
              />
            </div>
          </div>
        </div>

        {/* Net Salary and Payment Details */}
        <div className='mt-5 rounded-xl border border-gray-200 p-4 sm:p-5'>
          <div className='flex items-center justify-between gap-4'>
            <div>
              <p className='text-sm font-semibold'>
                Net salary
              </p>

              <p className='mt-1 text-xs text-gray-500'>
                Gross earnings minus total deductions
              </p>
            </div>

            <p className='text-xl font-bold'>
              {formatCurrency(getNetSalary(payslip))}
            </p>
          </div>

          <div className='mt-4 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-2'>
            <div>
              <p className='text-xs text-gray-500'>
                Payment date
              </p>

              <p className='mt-1 text-sm font-medium'>
                {payslip.paymentDate}
              </p>
            </div>

            <div>
              <p className='text-xs text-gray-500'>
                Payment status
              </p>

              <div className='mt-1'>
                <StatusBadge status={payslip.status} />
              </div>
            </div>
          </div>
        </div>

        <p className='mt-6 text-center text-xs leading-5 text-gray-500'>
          This is a sample salary statement. Official payroll data and
          company details must be verified before use.
        </p>
      </div>

      {/* Modal Footer */}
      <div className='no-print mt-5 flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end'>
        <button
          type='button'
          onClick={onClose}
          className='rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold transition hover:bg-gray-100'
        >
          Close
        </button>

        <button
          type='button'
          onClick={handleDownload}
          className='inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800'
        >
          <Download size={17} />
          Download / Save PDF
        </button>
      </div>
    </>
  )
}

export default PayslipModal
