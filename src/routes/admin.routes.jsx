import { Route } from 'react-router-dom'

import AdminLogin from '../admin/pages/Login'
import AdminDashboard from '../admin/pages/AdminDashboard'

import ProtectedRoute from './protected.routes'
import PublicRoute from './PublicRoute'
import AdminLayout from '../layout/AdminLayout'
import NotFound from '../NotFound'

import AllEmployee from '../admin/pages/AllEmployee'
import EmployeeProfile from '../admin/pages/EmployeeProfile'
import AddEmployee from '../admin/pages/AddEmployee'
import Department from '../admin/pages/Department'
import DepartmentView from '../admin/pages/DepartmentView'
import EditEmployee from '../admin/pages/EditEmployee'
import ManageHr from '../admin/pages/ManageHr'
import Attendance from '../admin/pages/Attendance'
import AttendanceDetails from '../admin/pages/AttendanceDetails'
import RegularizationRequests from '../admin/pages/RegularizationRequests'
import AddLeave from '../admin/pages/AddLeave'
import LeaveRequests from '../admin/pages/LeaveRequests'
import Holiday from '../admin/pages/Holiday'

const AdminRoutes = (
  <Route path='/'>
    {/* Public Login Route */}
    <Route element={<PublicRoute />}>
      <Route index element={<AdminLogin />} />
    </Route>

    {/* Admin Protected Routes */}
    <Route element={<ProtectedRoute allowedRoles={['super_admin', 'admin']} />}>
      <Route path='admin' element={<AdminLayout />}>
        <Route path='dashboard' element={<AdminDashboard />} />
        <Route path='manage-hr' element={<ManageHr />} />

        <Route path='all-employees' element={<AllEmployee />} />

        <Route path='add-employee' element={<AddEmployee />} />
        <Route path='attendance/:id' element={<AttendanceDetails />} />
        <Route path='employees/:id' element={<EmployeeProfile />} />
        <Route path='edit-employees/:id' element={<EditEmployee />} />

        <Route path='departments' element={<Department />} />
        <Route path='departments/:id' element={<DepartmentView />} />

        <Route path='attendance' element={<Attendance />} />

        <Route
          path='regularization-requests'
          element={<RegularizationRequests />}
        />

        <Route path='add-leaves' element={<AddLeave />} />
        <Route path='leave-requests' element={<LeaveRequests />} />
        <Route path='all-holidays' element={<Holiday />} />
      </Route>
    </Route>

    {/* 404 Route */}
    <Route path='*' element={<NotFound />} />
  </Route>
)

export default AdminRoutes
