import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, Clock3 } from 'lucide-react'
import { useDispatch } from 'react-redux'

import { getAdminProfile } from '../../redux/features/auth/authThunk'

const leaveTypes = [
  {
    name: 'Casual Leave',
    key: 'casualLeave',
    theme: {
      main: 'text-blue-700',
      icon: 'bg-blue-600 text-white',
      light: 'bg-black',
      border: 'border-blue-100',
      progress: 'bg-blue-600',
      accent: 'bg-blue-500',
      soft: 'text-blue-400',
      gradient: 'from-black to-blue-700',
      glow: 'bg-blue-400/10',
      line: 'border-blue-200/70'
    }
  },
  {
    name: 'Sick Leave',
    key: 'sickLeave',
    theme: {
      main: 'text-yellow-700',
      icon: 'bg-yellow-500 text-white',
      light: 'bg-black',
      border: 'border-yellow-100',
      progress: 'bg-yellow-500',
      accent: 'bg-yellow-400',
      soft: 'text-yellow-400',
      gradient: 'from-black to-yellow-700',
      glow: 'bg-yellow-400/10',
      line: 'border-yellow-200/70'
    }
  },
  {
    name: 'Work From Home',
    key: 'workFromHome',
    theme: {
      main: 'text-emerald-700',
      icon: 'bg-emerald-600 text-white',
      light: 'bg-black',
      border: 'border-emerald-100',
      progress: 'bg-emerald-600',
      accent: 'bg-emerald-500',
      soft: 'text-emerald-400',
      gradient: 'from-black to-teal-700',
      glow: 'bg-emerald-400/10',
      line: 'border-emerald-200/70'
    }
  }
]

const EmpLeave = () => {
  const dispatch = useDispatch()

  // =====================================================
  // LOCAL STATES
  // =====================================================

  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const selectedYear = new Date().getFullYear()

  // =====================================================
  // FETCH LOGGED-IN EMPLOYEE PROFILE
  // =====================================================

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await dispatch(getAdminProfile())

        if (!response?.success) {
          throw new Error(
            response?.message || 'Failed to fetch employee profile'
          )
        }

        const employeeData =
          response?.data?.user ||
          response?.data?.employee ||
          response?.data?.admin ||
          response?.data

        if (!employeeData) {
          throw new Error('Employee details not found')
        }

        setEmployee(employeeData)
      } catch (err) {
        setError(err?.message || 'Unable to load leave details')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [dispatch])

  // =====================================================
  // GET CURRENT YEAR LEAVE DETAILS
  // =====================================================

  const currentYearLeave = useMemo(() => {
    return (
      employee?.leaveDetails?.find(
        leave => Number(leave.year) === Number(selectedYear)
      ) || null
    )
  }, [employee, selectedYear])

  // =====================================================
  // DYNAMIC LEAVE BALANCES
  // =====================================================

  const leaveBalances = useMemo(() => {
    return leaveTypes.map(leave => {
      const balance = currentYearLeave?.[leave.key]

      return {
        ...leave,
        used: Number(balance?.used ?? 0),
        total: Number(balance?.total ?? 0),
        remaining: Number(balance?.remaining ?? 0),
        assigned: Boolean(balance)
      }
    })
  }, [currentYearLeave])

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className='min-h-screen px-0 py-4 sm:px-6 sm:py-6 lg:px-1 lg:py-1'>
      {/* Page Header */}
      <div className='mb-8 flex flex-col justify-between gap-4 px-2 sm:flex-row sm:items-center'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl'>
            Leave Management
          </h1>

          <p className='mt-2 text-sm text-gray-500'>
            Keep track of your leave balance and plan your time off.
          </p>
        </div>

        <div className='flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:self-center'>
          <Clock3 size={17} className='text-blue-600' />
          <span className='text-sm font-semibold text-gray-700'>
            Leave Year {selectedYear}
          </span>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className='rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500'>
          Loading your leave details...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className='rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600'>
          {error}
        </div>
      )}

      {/* Employee Not Found */}
      {!loading && !error && !employee && (
        <div className='rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700'>
          Employee profile not found. Please log in again.
        </div>
      )}

      {/* Leave Cards */}
      {!loading && !error && employee && (
        <>
          {!currentYearLeave && (
            <div className='mb-5 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700'>
              Leave has not been assigned for {selectedYear} yet.
            </div>
          )}

          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3'>
            {leaveBalances.map(leave => {
              const remaining = leave.remaining

              const percentage =
                leave.total > 0 ? (remaining / leave.total) * 100 : 0

              const usedPercentage =
                leave.total > 0 ? (leave.used / leave.total) * 100 : 0

              return (
                <div
                  key={leave.name}
                  className={`group relative overflow-hidden rounded-2xl border ${leave.theme.border} bg-white shadow-[0_4px_20px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(15,23,42,0.11)]`}
                >
                  {/* Top Color Accent */}
                  <div
                    className={`h-1 w-full bg-gradient-to-r ${leave.theme.gradient}`}
                  />

                  {/* Card Decorations */}
                  <div className='pointer-events-none absolute inset-0 overflow-hidden'>
                    <div
                      className={`absolute -right-12 top-16 h-36 w-36 rounded-full ${leave.theme.glow} blur-2xl transition-transform duration-700 group-hover:scale-125`}
                    />

                    <div
                      className={`absolute -bottom-12 -left-10 h-32 w-32 rounded-full ${leave.theme.glow} blur-2xl transition-transform duration-700 group-hover:scale-125`}
                    />

                    <div className='absolute right-0 top-24 flex rotate-[-35deg] flex-col gap-2 opacity-50'>
                      <span
                        className={`h-px w-24 border-t ${leave.theme.line}`}
                      />
                      <span
                        className={`h-px w-32 border-t ${leave.theme.line}`}
                      />
                      <span
                        className={`h-px w-20 border-t ${leave.theme.line}`}
                      />
                    </div>

                    <div
                      className={`absolute -right-5 top-36 h-16 w-16 rounded-full border ${leave.theme.line} transition-transform duration-500 group-hover:scale-125`}
                    />

                    <div
                      className={`absolute bottom-24 left-4 h-7 w-7 rounded-full border ${leave.theme.line}`}
                    />

                    <div
                      className={`absolute right-8 bottom-28 h-3 w-3 rotate-45 border ${leave.theme.line} transition-transform duration-500 group-hover:rotate-90`}
                    />

                    <span
                      className={`absolute left-1/2 top-7 h-1.5 w-1.5 rounded-full ${leave.theme.accent}`}
                    />

                    <span
                      className={`absolute right-14 top-14 h-2 w-2 rounded-full ${leave.theme.accent} opacity-40`}
                    />
                  </div>

                  <div className='relative p-5 sm:p-6'>
                    {/* Card Top - Icon Removed */}
                    <div className='flex items-center justify-end'>
                      <div
                        className={`h-2 w-2 rounded-full ${leave.theme.accent} opacity-70`}
                      />
                    </div>

                    {/* Leave Title */}
                    <div className='mt-5'>
                      <h2 className='text-lg font-bold tracking-tight text-gray-900'>
                        {leave.name}
                      </h2>

                      <p className='mt-1 text-sm text-gray-500'>
                        Your available leave entitlement
                      </p>
                    </div>

                    {/* Main Balance */}
                    <div
                      className={`group/balance relative mt-5 overflow-hidden rounded-xl ${leave.theme.light} p-4 shadow-lg shadow-black/15 transition-all duration-500`}
                    >
                      <div className='pointer-events-none absolute -right-5 top-0 h-36 w-36 rotate-45 opacity-20'>
                        <div className='absolute left-0 top-5 h-px w-40 bg-white' />
                        <div className='absolute left-0 top-10 h-px w-40 bg-white' />
                        <div className='absolute left-0 top-[15px] h-px w-40 bg-white' />
                        <div className='absolute left-0 top-20 h-px w-40 bg-white' />
                      </div>

                      <div className='pointer-events-none absolute right-7 top-5 h-14 w-14 rounded-full border border-white/20 transition-transform duration-500 group-hover/balance:scale-125' />

                      <div className='pointer-events-none absolute right-12 top-10 h-5 w-5 rounded-full border border-white/30' />

                      <div className='pointer-events-none absolute bottom-3 left-[48%] h-8 w-8 rounded-full border-2 border-white/10' />

                      <div className='pointer-events-none absolute right-28 bottom-5 h-3 w-3 rotate-45 border border-white/30' />

                      <div className='pointer-events-none absolute left-[42%] top-5 h-1.5 w-1.5 rounded-full bg-white/40' />

                      <div className='pointer-events-none absolute -bottom-12 right-16 h-28 w-28 rounded-full bg-white/10 blur-2xl transition-transform duration-700 group-hover/balance:scale-150' />

                      <div className='pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover/balance:translate-x-[450%]' />

                      {/* Content */}
                      <p
                        className={`relative z-10 text-xs font-semibold uppercase tracking-wider ${leave.theme.soft}`}
                      >
                        Available Balance
                      </p>

                      <div className='relative z-10 mt-2 flex items-end justify-between'>
                        <div className='flex items-baseline gap-2'>
                          <span className='text-5xl font-bold tracking-tight text-white transition-transform duration-300 group-hover/balance:translate-x-1'>
                            {remaining}
                          </span>

                          <span className='pb-1 text-sm font-medium text-gray-400'>
                            days left
                          </span>
                        </div>

                        <div
                          className={`mb-1 flex h-9 w-9 items-center justify-center rounded-full bg-white ${leave.theme.main} shadow-md transition-all duration-300 group-hover/balance:rotate-45 group-hover/balance:scale-110`}
                        >
                          <ArrowUpRight size={19} />
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className='mt-5'>
                      <div className='mb-3 flex items-center justify-between'>
                        <span className='text-sm font-semibold text-gray-700'>
                          Leave Utilization
                        </span>

                        <span
                          className={`text-sm font-bold ${leave.theme.main}`}
                        >
                          {Math.round(usedPercentage)}%
                        </span>
                      </div>

                      <div className='h-2.5 overflow-hidden rounded-full bg-gray-100 shadow-inner'>
                        <div
                          className={`h-full rounded-full ${leave.theme.progress} transition-all duration-700`}
                          style={{
                            width: `${Math.min(100, usedPercentage)}%`
                          }}
                        />
                      </div>

                      <div className='mt-3 flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${leave.theme.accent}`}
                          />

                          <span className='text-xs text-gray-500'>
                            {leave.used} days used
                          </span>
                        </div>

                        <span className='text-xs text-gray-500'>
                          {leave.total} days total
                        </span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className='mt-5 flex items-center justify-between border-t border-gray-100 pt-4'>
                      <span className='text-xs font-medium text-gray-500'>
                        Remaining entitlement
                      </span>

                      <span className={`text-sm font-bold ${leave.theme.main}`}>
                        {Math.round(percentage)}% available
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default EmpLeave
