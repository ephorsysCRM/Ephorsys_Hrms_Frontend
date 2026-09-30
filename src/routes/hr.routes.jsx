import { Route } from "react-router-dom";

import HrLayout from "../layout/HrLayout";
import Login from "../admin/pages/Login";
import HrDashboard from "../hr/pages/HrDashboard";

import AllEmployee from "../admin/pages/AllEmployee";
import AddEmployee from "../admin/pages/AddEmployee";
import EmployeeProfile from "../admin/pages/EmployeeProfile";
import Department from "../admin/pages/Department";
import DepartmentView from "../admin/pages/DepartmentView";

const HrRoutes = (
    <Route path="hr">

        {/* Public Route */}
        <Route
            index
            element={<Login />}
        />

        {/* Protected Routes */}
        {/* <Route element={<ProtectedRoute />}> */}

        <Route
            element={<HrLayout />}>

            {/* Dashboard */}
            <Route
                path="dashboard"
                element={<HrDashboard />}
            />

            {/* Employees */}
            <Route
                path="all-employees"
                element={<AllEmployee />}
            />

            {/* Add Employee */}
            <Route
                path="add-employee"
                element={<AddEmployee />}
            />

            {/* Employee Profile */}
            <Route
                path="employees/:id"
                element={<EmployeeProfile />}
            />

            {/* Departments */}
            <Route
                path="departments"
                element={<Department />}
            />

            <Route
                path="departments/:id"
                element={<DepartmentView />}
            />

        </Route>

        {/* </Route> */}

    </Route>
);

export default HrRoutes;