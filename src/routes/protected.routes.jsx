import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const location = useLocation()

  const {
    isAuthenticated,
    authChecked,
    user,
    admin,
    role: storedRole
  } = useSelector(state => state.auth)

  // =====================================================
  // WAIT FOR AUTH CHECK
  // =====================================================

  if (!authChecked) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin' />
      </div>
    )
  }

  // =====================================================
  // NOT AUTHENTICATED
  // =====================================================

  if (!isAuthenticated) {
    return <Navigate to='/' replace state={{ from: location }} />
  }

  // =====================================================
  // CURRENT USER
  // =====================================================

  const currentUser = user || admin

  // IMPORTANT:
  // API profile response already provides:
  //
  // data.role
  //
  // So Redux storedRole gets priority.

  const currentRole = storedRole || currentUser?.role

  // =====================================================
  // DEBUG
  // =====================================================

  console.log('========== PROTECTED ROUTE ==========')
  console.log('currentUser:', currentUser)
  console.log('storedRole:', storedRole)
  console.log('currentRole:', currentRole)
  console.log('allowedRoles:', allowedRoles)
  console.log('currentPath:', location.pathname)
  console.log('=====================================')

  // =====================================================
  // ROLE CHECK
  // =====================================================

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
    const dashboardByRole = {
      super_admin: '/admin/dashboard',
      admin: '/admin/dashboard',
      hr: '/hr/dashboard',
      manager: '/manager/dashboard',
      employee: '/employee/dashboard'
    }

    return <Navigate to={dashboardByRole[currentRole] || '/'} replace />
  }

  // =====================================================
  // ACCESS GRANTED
  // =====================================================

  return <Outlet />
}

export default ProtectedRoute
