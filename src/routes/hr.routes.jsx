import { Route } from "react-router-dom";

import HrLayout from "../layout/HrLayout";

import Login from "../admin/pages/Login";
import HrDashboard from "../hr/pages/HrDashboard";

import AllEmployee from "../hr/pages/AllEmployee";
import AddEmployee from "../admin/pages/AddEmployee";
import EmployeeProfileHr from "../hr/pages/EmployProfileHr";
import DepartmentHr from "../hr/pages/DepartmentHr";
import DepartmentViewHr from "../hr/pages/DepartmentViewHr";
import ProtectedRoute from "./protected.routes";
import EditEmployee from "../hr/pages/EditEmployee";
import Announcements from "../hr/pages/Announcements";
import Attendance from "../hr/pages/Attendance";
import LeaveManagement from "../hr/pages/LeaveManagement";
import PayRoll from "../hr/pages/PayRoll";
import PaySlips from "../hr/pages/PaySlips";
import Reports from "../hr/pages/Reports";
import AttendanceRequests from "../hr/pages/AttendanceRequests";

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
                    element={<EmployeeProfileHr />}
                />

                <Route
                    path="departments"
                    element={<DepartmentHr />}
                />

                <Route
                    path="departments/:id"
                    element={<DepartmentViewHr />}
                />
                <Route path='edit-employees/:id' element={<EditEmployee />} />
                <Route
                    path="announcements"
                    element={<Announcements />}
                />
                <Route
                    path="attendance"
                    element={<Attendance />}
                />
                <Route
                    path="attendance-requests"
                    element={<AttendanceRequests />}
                />
                <Route
                    path="leave-management"
                    element={<LeaveManagement />}
                />
                <Route
                    path="payroll"
                    element={<PayRoll />}
                />
                <Route
                    path="payslips"
                    element={<PaySlips />}
                />
                <Route
                    path="reports"
                    element={<Reports />}
                />
            </Route>
        </Route>
    </Route>
);

export default HrRoutes;