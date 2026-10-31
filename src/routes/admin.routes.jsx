import { Route } from 'react-router-dom'

import AdminLogin from '../admin/pages/Login'
import AdminDashboard from '../admin/pages/AdminDashboard'

import ProtectedRoute from './protected.routes'
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
import LeaveManagement from '../admin/pages/LeaveManagement'
import AttendanceRequests from '../admin/pages/AttendanceRequests'
import Announcements from '../admin/pages/Announcements'

const AdminRoutes = (
  <Route path='/'>
    {/* Public Login Route */}
    <Route index element={<AdminLogin />} />

    {/* Admin Protected Routes */}
    <Route element={<ProtectedRoute allowedRoles={['super_admin', 'admin']} />}>
      <Route path='admin' element={<AdminLayout />}>
        <Route path='dashboard' element={<AdminDashboard />} />
        <Route path='manage-hr' element={<ManageHr />} />

        <Route path='all-employees' element={<AllEmployee />} />

        <Route path='add-employee' element={<AddEmployee />} />

        <Route path='employees/:id' element={<EmployeeProfile />} />
        <Route path='edit-employees/:id' element={<EditEmployee />} />

        <Route path='departments' element={<Department />} />

        <Route path='departments/:id' element={<DepartmentView />} />

        <Route path='attendance' element={<Attendance/>} />

        <Route path='attendance-requests' element={<AttendanceRequests/>} />

        <Route path='leave-management' element={<LeaveManagement/>} />

        <Route path='announcements' element={<Announcements/>} />
      </Route>
    </Route>

    {/* 404 Route */}
    <Route path='*' element={<NotFound />} />
  </Route>
)

export default AdminRoutes
