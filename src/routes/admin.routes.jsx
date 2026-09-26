import { Route } from "react-router-dom";

import AdminLogin from "../admin/pages/Login";
import AdminDashboard from "../admin/pages/AdminDashboard";

import ProtectedRoute from "./protected.routes";
import AdminLayout from "../layout/AdminLayout";
import NotFound from "../NotFound";
import AllEmployee from "../admin/pages/AllEmployee";
import EmployeeProfile from "../admin/pages/EmployeeProfile";

const AdminRoutes = (
    <Route path="/">
        {/* Public Route */}
        <Route
            index
            element={<AdminLogin />}
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>

                {/* Dashboard */}
                <Route
                    path="dashboard"
                    element={<AdminDashboard />}
                />
                <Route
                    path="all-employees"
                    element={<AllEmployee />}
                />
                  <Route path="/employees/:id" element={<EmployeeProfile />} />
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