import { Route } from 'react-router-dom'

import Login from '../admin/pages/Login'
import EmpLayout from '../layout/EmpLayout'
import EmpDashboard from '../employee/pages/EmpDashboard'
import ProtectedRoute from './protected.routes'
import EmpProfile from '../employee/pages/EmpProfile'
import EmpLeave from '../employee/pages/EmpLeave'
import EmpSalary from '../employee/pages/EmpSalary'
import EmpAnnouncement from '../employee/pages/EmpAnnouncement'
import EmpDocument from '../employee/pages/EmpDocument'
import EmpNotification from '../employee/pages/EmpNotification'

const EmpRoutes = (
  <Route path='employee'>
    {/* Public Login Route */}
    <Route index element={<Login />} />

    {/* HR Protected Routes */}
    <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
      <Route element={<EmpLayout />}>
        <Route path='dashboard' element={<EmpDashboard />} />
        <Route path='profile' element={<EmpProfile />} />
        <Route path='leave' element={<EmpLeave />} />
        <Route path='salary' element={<EmpSalary />} />
        <Route path='announcement' element={<EmpAnnouncement />} />
        <Route path='document' element={<EmpDocument />} />
        <Route path='notification' element={<EmpNotification />} />
        
      </Route>
    </Route>
  </Route>
)

export default EmpRoutes
