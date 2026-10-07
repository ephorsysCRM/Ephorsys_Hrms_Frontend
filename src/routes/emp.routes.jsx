import { Route } from 'react-router-dom'

import Login from '../admin/pages/Login'
import EmpLayout from '../layout/EmpLayout'
import EmpDashboard from '../employee/pages/EmpDashboard'
import ProtectedRoute from './protected.routes'

const EmpRoutes = (
  <Route path='employee'>
    {/* Public Login Route */}
    <Route index element={<Login />} />

    {/* HR Protected Routes */}
    <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
      <Route element={<EmpLayout />}>
        <Route path='dashboard' element={<EmpDashboard />} />
      </Route>
    </Route>
  </Route>
)

export default EmpRoutes
