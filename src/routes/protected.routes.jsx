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

  // Wait until authentication check is completed
  if (!authChecked) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin' />
      </div>
    )
  }

  // Redirect unauthenticated users
  if (!isAuthenticated) {
    return <Navigate to='/' replace state={{ from: location }} />
  }

  // Support either a user object or an admin object in Redux
  const currentUser = user || admin
  const currentRole = currentUser?.role || storedRole

  // Check allowed roles
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

  return <Outlet />
}

export default ProtectedRoute
