import {
  ArrowLeft,

} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 text-black sm:px-6 lg:px-8">


      {/* Profile Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">

        <div className="flex flex-col items-center text-center">

          {/* Profile Picture */}
          <div className="h-28 w-28 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
            {/* Actual profile image will come from Stepper */}
            <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-black">
              A
            </div>
          </div>

          {/* Employee Name */}
          <h1 className="mt-4 text-2xl font-semibold text-black">
            Employee Name
          </h1>

          {/* Employee ID + Designation */}
          <p className="mt-1 text-sm text-gray-500">
            {id} • Designation
          </p>

          {/* Status */}
          <div className="mt-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />

            <span className="text-sm font-medium text-green-600">
              Active
            </span>
          </div>

        </div>

      </div>

      {/* Personal Information */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">

        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-base font-semibold text-black">
              Personal Information
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Personal details of the employee
            </p>
          </div>

          <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-black">
            Edit
          </button>
        </div>


        {/* Details */}
        <div className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">

          {/* Name */}
          <div>
            <p className="text-xs font-medium text-black">
              Name
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              —
            </p>
          </div>


          {/* Gender */}
          <div>
            <p className="text-xs font-medium text-black">
              Gender
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              —
            </p>
          </div>


          {/* Date of Birth */}
          <div>
            <p className="text-xs font-medium text-black">
              Date of Birth
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              —
            </p>
          </div>


          {/* Marital Status */}
          <div>
            <p className="text-xs font-medium text-black">
              Marital Status
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              —
            </p>
          </div>


          {/* Blood Group */}
          <div>
            <p className="text-xs font-medium text-black">
              Blood Group
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              —
            </p>
          </div>

        </div>

      </div>

      {/* Work Information */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">

        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-black">
            Work Information
          </h2>

          <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100">
            Edit
          </button>
        </div>

        {/* Information */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          <div>
            <p className="text-xs font-medium uppercase text-black">
              Employee ID
            </p>
            <p className="mt-2 text-sm font-medium text-black">
              {id}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-black">
              Designation
            </p>
            <p className="mt-2 text-sm font-medium text-black">
              —
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-black">
              Department
            </p>
            <p className="mt-2 text-sm font-medium text-black">
              —
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-black">
              Manager
            </p>
            <p className="mt-2 text-sm font-medium text-black">
              —
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-black">
              Status
            </p>
            <p className="mt-2 text-sm font-medium text-black">
              —
            </p>
          </div>

        </div>
      </div>

      {/* Education */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">

        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-black">
            Education
          </h2>

          <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100">
            Edit
          </button>
        </div>

        {/* Education Records */}
        <div className="mt-6 space-y-4">

          {/* Education 1 */}
          <div className="rounded-lg border border-gray-200 p-5">

            <h3 className="font-medium text-black">
              —
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              <div>
                <p className="text-xs font-medium uppercase text-black">
                  Institution
                </p>
                <p className="mt-2 text-sm font-medium text-black">
                  —
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-black">
                  Field of Study
                </p>
                <p className="mt-2 text-sm font-medium text-black">
                  —
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-black">
                  Passing Year
                </p>
                <p className="mt-2 text-sm font-medium text-black">
                  —
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Experience */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">

        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-black">
            Experience
          </h2>

          <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100">
            Edit
          </button>
        </div>

        {/* Experience Records */}
        <div className="mt-6 space-y-4">

          {/* Experience 1 */}
          <div className="rounded-lg border border-gray-200 p-5">

            <h3 className="font-medium text-black">
              —
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              <div>
                <p className="text-xs font-medium uppercase text-black">
                  Company
                </p>
                <p className="mt-2 text-sm font-medium text-black">
                  —
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-black">
                  Start Date
                </p>
                <p className="mt-2 text-sm font-medium text-black">
                  —
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-black">
                  End Date
                </p>
                <p className="mt-2 text-sm font-medium text-black">
                  —
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Payroll */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">

        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-black">
            Payroll
          </h2>

          <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100">
            Edit
          </button>
        </div>

        {/* Earnings */}
        <div className="mt-6">
          <h3 className="font-medium text-black">
            Earnings
          </h3>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">

            <div>
              <p className="text-xs font-medium uppercase text-black">
                Basic Salary
              </p>
              <p className="mt-2 text-sm font-medium text-black">
                —
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-black">
                HRA
              </p>
              <p className="mt-2 text-sm font-medium text-black">
                —
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-black">
                Conveyance Allowance
              </p>
              <p className="mt-2 text-sm font-medium text-black">
                —
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-black">
                Special Allowance
              </p>
              <p className="mt-2 text-sm font-medium text-black">
                —
              </p>
            </div>

          </div>

          {/* Gross Salary */}
          <div className="mt-5 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-black">
                  Gross Salary
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Automatically calculated from total earnings
                </p>
              </div>

              <p className="font-semibold text-black">
                —
              </p>
            </div>
          </div>
        </div>

        {/* Deductions */}
        <div className="mt-8">
          <h3 className="font-medium text-black">
            Deductions
          </h3>

          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            <div>
              <p className="text-xs font-medium uppercase text-black">
                EPF
              </p>
              <p className="mt-2 text-sm font-medium text-black">
                —
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-black">
                Professional Tax
              </p>
              <p className="mt-2 text-sm font-medium text-black">
                —
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-black">
                TDS
              </p>
              <p className="mt-2 text-sm font-medium text-black">
                —
              </p>
            </div>

          </div>

          {/* Total Deductions */}
          <div className="mt-5 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-black">
                  Total Deductions
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  EPF + Professional Tax + TDS
                </p>
              </div>

              <p className="font-semibold text-black">
                —
              </p>
            </div>
          </div>

          {/* Net Salary */}
          <div className="mt-3 rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-black">
                  Net Salary
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Take-home pay after deductions
                </p>
              </div>

              <p className="font-semibold text-black">
                —
              </p>
            </div>
          </div>
        </div>

        {/* Employer Contributions */}
        <div className="mt-8">
          <h3 className="font-medium text-black">
            Employer Contributions
          </h3>

          <div className="mt-4">
            <p className="text-xs font-medium uppercase text-black">
              Employer PF Contribution
            </p>

            <p className="mt-2 text-sm font-medium text-black">
              —
            </p>
          </div>

          {/* CTC */}
          <div className="mt-5 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-black">
                  CTC
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Gross salary + employer contributions
                </p>
              </div>

              <p className="font-semibold text-black">
                —
              </p>
            </div>
          </div>
        </div>

      </div>

      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate("/all-employees")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-black"
        >
          <ArrowLeft size={17} />
          Back to Employees
        </button>
      </div>
    </div>
  );
};

export default EmployeeProfile;