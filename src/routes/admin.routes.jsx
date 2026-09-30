import { Route } from "react-router-dom";

import AdminLogin from "../admin/pages/Login";
import AdminDashboard from "../admin/pages/AdminDashboard";

import ProtectedRoute from "./protected.routes";
import AdminLayout from "../layout/AdminLayout";
import NotFound from "../NotFound";

import AllEmployee from "../admin/pages/AllEmployee";
import EmployeeProfile from "../admin/pages/EmployeeProfile";
import AddEmployee from "../admin/pages/AddEmployee";
import Department from "../admin/pages/Department";
import DepartmentView from "../admin/pages/DepartmentView";

const AdminRoutes = (
    <Route path="/">
        {/* Public Route */}
        <Route
            index
            element={<AdminLogin />}
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
            <Route path="admin" element={<AdminLayout />}>

                {/* Dashboard */}
                <Route
                    path="dashboard"
                    element={<AdminDashboard />}
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

                <Route
                     path="departments"
                     element={<Department />} />

                <Route
                    path="departments/:id"
                    element={<DepartmentView />} />

            </Route>
        </Route>

        {/* 404 Route */}
        <Route
            path="*"
            element={<NotFound />}
        />
    </Route>
);

export default AdminRoutes;