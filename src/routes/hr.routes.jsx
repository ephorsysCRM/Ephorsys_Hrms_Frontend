import { Route } from "react-router-dom";

import HrLayout from "../layout/HrLayout";

import Login from "../admin/pages/Login";
import HrDashboard from "../hr/pages/HrDashboard";

import AllEmployee from "../admin/pages/AllEmployee";
import AddEmployee from "../admin/pages/AddEmployee";
import EmployeeProfile from "../admin/pages/EmployeeProfile";
import Department from "../admin/pages/Department";
import DepartmentView from "../admin/pages/DepartmentView";
import ProtectedRoute from "./protected.routes";

const HrRoutes = (
    <Route path="hr">
        {/* Public Login Route */}
        <Route
            index
            element={<Login />}
        />

        {/* HR Protected Routes */}
        <Route
            element={<ProtectedRoute allowedRoles={["hr"]} />}
        >
            <Route element={<HrLayout />}>
                <Route
                    path="dashboard"
                    element={<HrDashboard />}
                />

                <Route
                    path="all-employees"
                    element={<AllEmployee />}
                />

                <Route
                    path="add-employee"
                    element={<AddEmployee />}
                />

                <Route
                    path="employees/:id"
                    element={<EmployeeProfile />}
                />

                <Route
                    path="departments"
                    element={<Department />}
                />

                <Route
                    path="departments/:id"
                    element={<DepartmentView />}
                />
            </Route>
        </Route>
    </Route>
);

export default HrRoutes;