import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PublicRoute = () => {
  const {
    isAuthenticated,
    authChecked,
    user,
    admin,
    role: storedRole
  } = useSelector(state => state.auth)

  // Wait until session restoration finishes
  if (!authChecked) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin' />
      </div>
    )
  }

  // Not logged in: show login page
  if (!isAuthenticated) {
    return <Outlet />
  }

  // Identify current user role
  const currentUser = user || admin
  const currentRole = storedRole || currentUser?.role

  const dashboardByRole = {
    super_admin: '/admin/dashboard',
    admin: '/admin/dashboard',
    hr: '/hr/dashboard',
    manager: '/manager/dashboard',
    employee: '/employee/dashboard'
  }

  // Redirect authenticated user to their dashboard
  return <Navigate to={dashboardByRole[currentRole] || '/'} replace />
}

export default PublicRoute
