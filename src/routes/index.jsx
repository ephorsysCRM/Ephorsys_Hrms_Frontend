import { BrowserRouter, Routes } from 'react-router-dom'
import AdminRoutes from './admin.routes'
import HrRoutes from './hr.routes'
import EmpRoutes from './emp.routes'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {AdminRoutes}
        {HrRoutes}
        {EmpRoutes}
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
