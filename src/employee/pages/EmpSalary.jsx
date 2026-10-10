
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
  CircleAlert,
  Receipt
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

const SummaryCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconStyle
}) => (
  <div className='rounded-2xl border border-gray-200 bg-white p-5 transition hover:shadow-md sm:p-6'>
    <div className='flex items-start justify-between gap-3'>
      <div>
        <p className='text-sm text-gray-500'>{title}</p>

        <h2 className='mt-3 text-2xl font-bold tracking-tight text-gray-900'>
          {value}
        </h2>

        <p className='mt-2 text-xs text-gray-500'>
          {subtitle}
        </p>
      </div>

      <div className={`rounded-xl p-3 ${iconStyle}`}>
        <Icon size={21} />
      </div>
    </div>
  </div>
)

const EmployeePayslip = () => {
  const [search, setSearch] = useState('')
  const [selectedYear, setSelectedYear] = useState('2026')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedPayslip, setSelectedPayslip] = useState(null)

  const filteredPayslips = useMemo(() => {
    return payslipData.filter(payslip => {
      const matchesSearch =
        `${payslip.month} ${payslip.year} ${payslip.id}`
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesYear =
        selectedYear === 'All' ||
        payslip.year.toString() === selectedYear

      const matchesStatus =
        selectedStatus === 'All' ||
        payslip.status === selectedStatus

      return matchesSearch && matchesYear && matchesStatus
    })
  }, [search, selectedYear, selectedStatus])

  const paidPayslips = payslipData.filter(
    payslip => payslip.status === 'Paid'
  )

  const totalPaid = paidPayslips.reduce(
    (total, payslip) => total + getNetSalary(payslip),
    0
  )

  const latestPayslip = payslipData[0]
  const latestNetSalary = getNetSalary(latestPayslip)

  const pendingPayslips = payslipData.filter(
    payslip =>
      payslip.status === 'Pending' ||
      payslip.status === 'Processing'
  ).length

  const handleClosePayslip = () => {
    setSelectedPayslip(null)
  }

  return (
    <div className='min-h-screen bg-[#f7f7f7] px-4 py-6 text-gray-900 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl'>

        {/* Page Heading */}
        <div className='mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <div className='mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-gray-500'>
              <Wallet size={15} />
              Salary & Benefits
            </div>

            <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>
              My Payslips
            </h1>

            <p className='mt-2 text-sm text-gray-500'>
              View your monthly salary statements, payment details and deductions.
            </p>
          </div>

          <div className='flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 sm:self-auto'>
            <CalendarDays size={17} />
            <span>Financial year</span>
            <span className='font-semibold text-gray-900'>
              2026–27
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className='mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          <SummaryCard
            title='Latest Net Salary'
            value={formatCurrency(latestNetSalary)}
            subtitle={`${latestPayslip.month} ${latestPayslip.year}`}
            icon={Wallet}
            iconStyle='bg-gray-100 text-gray-800'
          />

          <SummaryCard
            title='Total Salary Received'
            value={formatCurrency(totalPaid)}
            subtitle={`${paidPayslips.length} paid payslips`}
            icon={TrendingUp}
            iconStyle='bg-green-50 text-green-700'
          />

          <SummaryCard
            title='Paid Payslips'
            value={paidPayslips.length}
            subtitle='Successfully processed'
            icon={CheckCircle2}
            iconStyle='bg-blue-50 text-blue-700'
          />

          <SummaryCard
            title='Pending Payslips'
            value={pendingPayslips}
            subtitle='Awaiting completion'
            icon={Clock3}
            iconStyle='bg-amber-50 text-amber-700'
          />
        </div>

        {/* Latest Salary Highlight */}
        <div className='relative mb-8 overflow-hidden rounded-2xl bg-gray-950 p-6 text-white sm:p-8'>
          <div className='absolute -right-12 -top-20 h-64 w-64 rounded-full border border-white/10' />
          <div className='absolute -right-2 -top-10 h-44 w-44 rounded-full border border-white/10' />

          <div className='relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
            <div>
              <div className='mb-4 flex items-center gap-2 text-sm text-gray-300'>
                <span className='rounded-lg bg-white/10 p-2'>
                  <Receipt size={19} />
                </span>
                Latest salary statement
              </div>

              <p className='text-sm text-gray-400'>
                {latestPayslip.month} {latestPayslip.year}
              </p>

              <h2 className='mt-2 text-3xl font-bold tracking-tight sm:text-4xl'>
                {formatCurrency(latestNetSalary)}
              </h2>

              <div className='mt-4 flex flex-wrap items-center gap-3'>
                <StatusBadge status={latestPayslip.status} />

                <span className='text-xs text-gray-400'>
                  Payslip ID: {latestPayslip.id}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedPayslip(latestPayslip)}
              className='inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-950 transition hover:bg-gray-200'
            >
              <Eye size={17} />
              View Latest Payslip
            </button>
          </div>
        </div>

        {/* Salary History */}
        <div className='overflow-hidden rounded-2xl border border-gray-200 bg-white'>
          <div className='border-b border-gray-200 p-5 sm:p-6'>
            <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <h2 className='text-lg font-bold'>
                  Salary History
                </h2>

                <p className='mt-1 text-sm text-gray-500'>
                  Your monthly payslips and payment records
                </p>
              </div>

              <span className='text-sm text-gray-500'>
                {filteredPayslips.length} records
              </span>
            </div>

            {/* Filters */}
            <div className='mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
              <div className='relative'>
                <Search
                  size={17}
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                />

                <input
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                  placeholder='Search month or payslip ID'
                  className='w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-500'
                />
              </div>

              <div className='relative'>
                <select
                  value={selectedYear}
                  onChange={event => setSelectedYear(event.target.value)}
                  className='w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500'
                >
                  <option value='All'>All years</option>
                  <option value='2026'>2026</option>
                  <option value='2025'>2025</option>
                </select>

                <ChevronDown
                  size={16}
                  className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400'
                />
              </div>

              <div className='relative'>
                <select
                  value={selectedStatus}
                  onChange={event => setSelectedStatus(event.target.value)}
                  className='w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500'
                >
                  <option value='All'>All payment statuses</option>
                  <option value='Paid'>Paid</option>
                  <option value='Processing'>Processing</option>
                  <option value='Pending'>Pending</option>
                </select>

                <ChevronDown
                  size={16}
                  className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400'
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[720px] text-left'>
              <thead className='bg-gray-50'>
                <tr className='text-xs uppercase tracking-wider text-gray-500'>
                  <th className='px-6 py-4 font-semibold'>Salary Month</th>
                  <th className='px-6 py-4 font-semibold'>Payslip ID</th>
                  <th className='px-6 py-4 font-semibold'>Net Salary</th>
                  <th className='px-6 py-4 font-semibold'>Payment Date</th>
                  <th className='px-6 py-4 font-semibold'>Status</th>
                  <th className='px-6 py-4 text-right font-semibold'>Action</th>
                </tr>
              </thead>

              <tbody className='divide-y divide-gray-100'>
                {filteredPayslips.map(payslip => (
                  <tr
                    key={payslip.id}
                    className='transition hover:bg-gray-50/80'
                  >
                    <td className='px-6 py-5'>
                      <div className='flex items-center gap-3'>
                        <div className='rounded-xl border border-gray-200 bg-white p-2.5'>
                          <FileText size={19} className='text-gray-700' />
                        </div>

                        <div>
                          <p className='text-sm font-semibold text-gray-900'>
                            {payslip.month} {payslip.year}
                          </p>

                          <p className='mt-1 text-xs text-gray-500'>
                            Monthly salary
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className='px-6 py-5 text-sm text-gray-500'>
                      {payslip.id}
                    </td>

                    <td className='px-6 py-5 text-sm font-semibold text-gray-900'>
                      {formatCurrency(getNetSalary(payslip))}
                    </td>

                    <td className='px-6 py-5 text-sm text-gray-500'>
                      {payslip.paymentDate}
                    </td>

                    <td className='px-6 py-5'>
                      <StatusBadge status={payslip.status} />
                    </td>

                    <td className='px-6 py-5 text-right'>
                      <button
                        onClick={() => setSelectedPayslip(payslip)}
                        className='inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium transition hover:border-gray-400 hover:bg-white'
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredPayslips.length === 0 && (
                  <tr>
                    <td colSpan={6} className='px-6 py-16 text-center'>
                      <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100'>
                        <Search size={22} className='text-gray-400' />
                      </div>

                      <p className='mt-4 font-semibold text-gray-800'>
                        No payslips found
                      </p>

                      <p className='mt-1 text-sm text-gray-500'>
                        Try changing your search or filters.
                      </p>

                      <button
                        onClick={() => {
                          setSearch('')
                          setSelectedYear('All')
                          setSelectedStatus('All')
                        }}
                        className='mt-4 text-sm font-semibold underline underline-offset-4'
                      >
                        Clear filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className='border-t border-gray-200 bg-gray-50 px-5 py-4 text-xs leading-5 text-gray-500 sm:px-6'>
            Payslip details shown here are sample records. Official salary
            statements should be generated from verified payroll records.
          </div>
        </div>

        {/* Helpful Note */}
        <div className='mt-5 flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4'>
          <div className='rounded-lg bg-gray-100 p-2'>
            <CircleAlert size={18} className='text-gray-600' />
          </div>

          <div>
            <p className='text-sm font-semibold text-gray-800'>
              Need help with your salary?
            </p>

            <p className='mt-1 text-sm leading-6 text-gray-500'>
              If you notice an incorrect amount or missing payslip, contact
              your HR or payroll team.
            </p>
          </div>
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
