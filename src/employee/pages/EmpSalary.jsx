import { useMemo, useState } from 'react'
import {
  Search,
  FileText,
  Wallet,
  TrendingUp,
  CalendarDays,
  ChevronDown,
  Eye,
  CheckCircle2,
  Clock3,
  CircleAlert
} from 'lucide-react'
import Modal from '../../UI/Modal'
import PayslipModal from '../employeeModal/PayslipModal'

const payslipData = [
  {
    id: 'PAY-2026-010',
    month: 'October',
    year: 2026,
    paymentDate: '10 Oct 2026',
    status: 'Paid',
    basicSalary: 25000,
    hra: 7500,
    conveyance: 1600,
    specialAllowance: 3900,
    bonus: 0,
    pf: 1800,
    professionalTax: 200,
    tds: 1000
  },
  {
    id: 'PAY-2026-009',
    month: 'September',
    year: 2026,
    paymentDate: '10 Sep 2026',
    status: 'Paid',
    basicSalary: 25000,
    hra: 7500,
    conveyance: 1600,
    specialAllowance: 3900,
    bonus: 0,
    pf: 1800,
    professionalTax: 200,
    tds: 1000
  },
  {
    id: 'PAY-2026-008',
    month: 'August',
    year: 2026,
    paymentDate: '10 Aug 2026',
    status: 'Paid',
    basicSalary: 25000,
    hra: 7500,
    conveyance: 1600,
    specialAllowance: 3900,
    bonus: 1500,
    pf: 1800,
    professionalTax: 200,
    tds: 1000
  },
  {
    id: 'PAY-2026-007',
    month: 'July',
    year: 2026,
    paymentDate: '10 Jul 2026',
    status: 'Paid',
    basicSalary: 25000,
    hra: 7500,
    conveyance: 1600,
    specialAllowance: 3900,
    bonus: 0,
    pf: 1800,
    professionalTax: 200,
    tds: 1000
  },
  {
    id: 'PAY-2026-006',
    month: 'June',
    year: 2026,
    paymentDate: '10 Jun 2026',
    status: 'Paid',
    basicSalary: 25000,
    hra: 7500,
    conveyance: 1600,
    specialAllowance: 3900,
    bonus: 0,
    pf: 1800,
    professionalTax: 200,
    tds: 1000
  },
  {
    id: 'PAY-2026-005',
    month: 'May',
    year: 2026,
    paymentDate: '10 May 2026',
    status: 'Processing',
    basicSalary: 25000,
    hra: 7500,
    conveyance: 1600,
    specialAllowance: 3900,
    bonus: 0,
    pf: 1800,
    professionalTax: 200,
    tds: 1000
  },
  {
    id: 'PAY-2026-004',
    month: 'April',
    year: 2026,
    paymentDate: 'Pending',
    status: 'Pending',
    basicSalary: 25000,
    hra: 7500,
    conveyance: 1600,
    specialAllowance: 3900,
    bonus: 0,
    pf: 1800,
    professionalTax: 200,
    tds: 1000
  }
]

const employee = {
  name: 'Ananya Pradhan',
  employeeId: 'EMP001',
  designation: 'Software Developer',
  department: 'Development',
  email: 'ananya@example.com',
  company: 'Your Company Name'
}

// ======================================================
// HELPERS
// ======================================================

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
  payslip.pf + payslip.professionalTax + payslip.tds

const getNetSalary = payslip => getEarnings(payslip) - getDeductions(payslip)

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

// Compact summary card: 3 in one row on mobile
const SummaryCard = ({
  title,
  shortTitle,
  value,
  subtitle,
  icon: Icon,
  iconStyle
}) => (
  <div className='rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all duration-300 hover:shadow-md sm:rounded-2xl sm:p-5'>
    <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4'>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-11 sm:w-11 sm:rounded-xl ${iconStyle}`}
      >
        <Icon className='h-4 w-4 sm:h-5 sm:w-5' strokeWidth={1.8} />
      </div>

      <div className='min-w-0'>
        <p className='truncate text-[11px] font-medium text-gray-500 sm:text-sm'>
          <span className='sm:hidden'>{shortTitle}</span>
          <span className='hidden sm:inline'>{title}</span>
        </p>

        <h2 className='truncate text-base font-bold leading-tight text-gray-900 sm:text-2xl'>
          {value}
        </h2>
      </div>
    </div>

    <p className='mt-2 hidden text-xs text-gray-400 sm:block'>{subtitle}</p>
  </div>
)

// ======================================================
// MAIN COMPONENT
// ======================================================

const EmployeePayslip = () => {
  const [search, setSearch] = useState('')
  const [selectedYear, setSelectedYear] = useState('2026')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedPayslip, setSelectedPayslip] = useState(null)

  const filteredPayslips = useMemo(() => {
    return payslipData.filter(payslip => {
      const matchesSearch = `${payslip.month} ${payslip.year} ${payslip.id}`
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesYear =
        selectedYear === 'All' || payslip.year.toString() === selectedYear

      const matchesStatus =
        selectedStatus === 'All' || payslip.status === selectedStatus

      return matchesSearch && matchesYear && matchesStatus
    })
  }, [search, selectedYear, selectedStatus])

  const paidPayslips = payslipData.filter(payslip => payslip.status === 'Paid')

  const totalPaid = paidPayslips.reduce(
    (total, payslip) => total + getNetSalary(payslip),
    0
  )

  const latestPayslip = payslipData[0]
  const latestNetSalary = getNetSalary(latestPayslip)

  const pendingPayslips = payslipData.filter(
    payslip => payslip.status === 'Pending' || payslip.status === 'Processing'
  ).length

  const handleClosePayslip = () => {
    setSelectedPayslip(null)
  }

  return (
    <div className='min-h-screen space-y-6 px-0 py-2 text-gray-900 sm:py-4'>
      {/* HEADER */}
      <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl'>
            My Payslips
          </h1>

          <p className='mt-1 text-xs text-gray-500 sm:text-sm'>
            View your monthly salary statements and deductions.
          </p>
        </div>

        <div className='flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 shadow-sm sm:self-auto'>
          <CalendarDays size={16} />
          <span>Financial year</span>
          <span className='font-semibold text-gray-900'>2026–27</span>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className='grid grid-cols-3 gap-2 sm:gap-4'>
        <SummaryCard
          title='Latest Net Salary'
          shortTitle='Latest'
          value={formatCurrency(latestNetSalary)}
          subtitle={`${latestPayslip.month} ${latestPayslip.year}`}
          icon={Wallet}
          iconStyle='bg-gray-100 text-gray-700'
        />

        <SummaryCard
          title='Total Salary Received'
          shortTitle='Received'
          value={formatCurrency(totalPaid)}
          subtitle={`${paidPayslips.length} paid payslips`}
          icon={TrendingUp}
          iconStyle='bg-green-50 text-green-600'
        />

        <SummaryCard
          title='Pending Payslips'
          shortTitle='Pending'
          value={String(pendingPayslips).padStart(2, '0')}
          subtitle='Awaiting completion'
          icon={Clock3}
          iconStyle='bg-amber-50 text-amber-700'
        />
      </div>

      {/* SALARY HISTORY */}
      <section className='overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm'>
        <div className='flex flex-col gap-4 border-b border-gray-100 p-4 sm:p-5'>
          <div className='flex items-center justify-between gap-3'>
            <div>
              <h2 className='text-base font-bold text-gray-900'>
                Salary History
              </h2>

              <p className='mt-1 text-xs text-gray-400'>
                Your monthly payslips and payment records.
              </p>
            </div>

            <span className='shrink-0 text-xs font-medium text-gray-500'>
              {filteredPayslips.length} records
            </span>
          </div>

          {/* Filters */}
          <div className='grid grid-cols-1 gap-2 sm:grid-cols-3'>
            <div className='group relative'>
              <Search
                size={16}
                className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-600'
              />

              <input
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder='Search month or payslip ID'
                className='w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-800 outline-none transition-all duration-300 placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10'
              />
            </div>

            <div className='relative'>
              <select
                value={selectedYear}
                onChange={event => setSelectedYear(event.target.value)}
                className='w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-9 text-sm font-semibold text-gray-700 outline-none transition-all duration-300 hover:border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10'
              >
                <option value='All'>All years</option>
                <option value='2026'>2026</option>
                <option value='2025'>2025</option>
              </select>

              <ChevronDown
                size={15}
                className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
              />
            </div>

            <div className='relative'>
              <select
                value={selectedStatus}
                onChange={event => setSelectedStatus(event.target.value)}
                className='w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-9 text-sm font-semibold text-gray-700 outline-none transition-all duration-300 hover:border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10'
              >
                <option value='All'>All statuses</option>
                <option value='Paid'>Paid</option>
                <option value='Processing'>Processing</option>
                <option value='Pending'>Pending</option>
              </select>

              <ChevronDown
                size={15}
                className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[720px] text-left'>
            <thead className='bg-gray-50/80'>
              <tr className='border-b border-gray-100'>
                <th className='px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500'>
                  Salary Month
                </th>
                <th className='px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500'>
                  Payslip ID
                </th>
                <th className='px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500'>
                  Net Salary
                </th>
                <th className='px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500'>
                  Payment Date
                </th>
                <th className='px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500'>
                  Status
                </th>
                <th className='px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-gray-500'>
                  Action
                </th>
              </tr>
            </thead>

            <tbody className='divide-y divide-gray-100'>
              {filteredPayslips.map(payslip => (
                <tr
                  key={payslip.id}
                  className='transition-colors duration-200 hover:bg-gray-50'
                >
                  <td className='px-5 py-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700'>
                        <FileText size={19} strokeWidth={1.8} />
                      </div>

                      <div>
                        <p className='text-sm font-semibold text-gray-800'>
                          {payslip.month} {payslip.year}
                        </p>

                        <p className='mt-0.5 text-xs text-gray-400'>
                          Monthly salary
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className='px-5 py-4 text-sm text-gray-500'>
                    {payslip.id}
                  </td>

                  <td className='px-5 py-4 text-sm font-semibold text-gray-900'>
                    {formatCurrency(getNetSalary(payslip))}
                  </td>

                  <td className='px-5 py-4 text-sm text-gray-500'>
                    {payslip.paymentDate}
                  </td>

                  <td className='px-5 py-4'>
                    <StatusBadge status={payslip.status} />
                  </td>

                  <td className='px-5 py-4 text-right'>
                    <button
                      onClick={() => setSelectedPayslip(payslip)}
                      className='inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white'
                    >
                      <Eye size={15} />
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {filteredPayslips.length === 0 && (
                <tr>
                  <td colSpan={6} className='px-5 py-16 text-center'>
                    <div className='flex flex-col items-center gap-3'>
                      <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400'>
                        <Search size={26} strokeWidth={1.5} />
                      </div>

                      <div>
                        <p className='text-sm font-semibold text-gray-700'>
                          No payslips found
                        </p>

                        <p className='mt-1 text-xs text-gray-400'>
                          Try changing your search or filters.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setSearch('')
                          setSelectedYear('All')
                          setSelectedStatus('All')
                        }}
                        className='text-sm font-semibold text-blue-600 underline underline-offset-4'
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className='border-t border-gray-100 bg-gray-50/50 px-5 py-4 text-xs leading-5 text-gray-500'>
          Payslip details shown here are sample records. Official salary
          statements should be generated from verified payroll records.
        </div>
      </section>

      {/* HELP NOTE */}
      <div className='flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
        <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600'>
          <CircleAlert size={18} />
        </div>

        <div>
          <p className='text-sm font-semibold text-gray-800'>
            Need help with your salary?
          </p>

          <p className='mt-1 text-xs leading-5 text-gray-500 sm:text-sm'>
            If you notice an incorrect amount or missing payslip, contact your
            HR or payroll team.
          </p>
        </div>
      </div>

      {/* Reusable Payslip Modal */}
      <Modal
        isOpen={!!selectedPayslip}
        onClose={handleClosePayslip}
        title='Payslip Details'
        size='lg'
      >
        {selectedPayslip && (
          <PayslipModal
            payslip={selectedPayslip}
            employee={employee}
            onClose={handleClosePayslip}
          />
        )}
      </Modal>
    </div>
  )
}

export default EmployeePayslip
