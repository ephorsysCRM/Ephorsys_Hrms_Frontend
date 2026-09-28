import {
  ArrowLeft,
  Pencil,
  UserRound,
  Mail,
  Phone,
  MapPin,
  BriefcaseBusiness,
  WalletCards,
  Landmark,
  GraduationCap,
  Building2,
  FileText,
  LockKeyhole,
  Eye,
} from "lucide-react";

import { useState } from "react";
import DocumentModal from "../adminModals/DocumentModal";
import { useNavigate, useParams } from "react-router-dom";

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDocument, setSelectedDocument] = useState(null);

  const sectionClass =
    "mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm";

  const sectionHeaderClass =
    "flex flex-col gap-4 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6";

  const editButtonClass =
    "inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 transition-all duration-200 hover:border-black hover:bg-black hover:text-white";

  const labelClass =
    "text-[11px] font-semibold uppercase tracking-[0.08em] text-black";

  const valueClass =
    "mt-1.5 text-sm font-semibold text-gray-900";

  return (
    <div className="min-h-screen bg-[#f7f7f7] px-4 py-2 text-black sm:px-6 lg:px-8">

      {/* Back Button */}
      <div className="mx-auto mb-5 max-w-6xl">
        <button
          onClick={() => navigate("/all-employees")}
          className="group inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-500 transition-all duration-200 hover:bg-white hover:text-black"
        >
          <ArrowLeft
            size={17}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          Back to Employees
        </button>
      </div>

      <div className="mx-auto max-w-6xl">

        {/* ================= PROFILE HEADER ================= */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Black Top Line */}
          <div className="h-2 bg-black" />

          <div className="p-6 sm:p-8">

            <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">

              {/* Employee Identity */}
              <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">

                {/* Profile Picture */}
                <div className="relative">

                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-black text-white shadow-md sm:h-28 sm:w-28">
                    <UserRound size={42} strokeWidth={1.5} />
                  </div>

                  {/* Status Dot */}
                  <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-black">
                    <span className="h-2 w-2 rounded-full bg-white" />
                  </div>

                </div>

                {/* Employee Name */}
                <div className="text-center sm:text-left">

                  <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
                    Employee Profile
                  </p>

                  <h1 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
                    Employee Name
                  </h1>

                  <p className="mt-1 text-sm text-gray-500">
                    {id}
                    <span className="mx-1.5 text-gray-300">•</span>
                    Designation
                  </p>

                  <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5">

                    <span className="h-2 w-2 rounded-full bg-green-700" />

                    <span className="text-xs font-semibold text-green-700">
                      Active
                    </span>

                  </div>

                </div>

              </div>

              {/* Header Edit */}
              <div className="flex justify-center sm:justify-end">

                <button className={editButtonClass}>
                  <Pencil size={14} />
                  Edit Profile
                </button>

              </div>

            </div>

          </div>

        </div>


        {/* ================= PERSONAL INFORMATION ================= */}
        <div className={sectionClass}>

          <div className={sectionHeaderClass}>

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white">
                <UserRound size={17} />
              </div>

              <div>

                <h2 className="text-base font-bold text-black">
                  Personal Information
                </h2>

                <p className="mt-0.5 text-xs text-gray-400">
                  Personal details of the employee
                </p>

              </div>

            </div>

            <button className={editButtonClass}>
              <Pencil size={13} />
              Edit
            </button>

          </div>


          <div className="grid gap-x-10 gap-y-7 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:p-6">

            <div>
              <p className={labelClass}>
                Name
              </p>

              <p className={valueClass}>
                —
              </p>
            </div>

            <div>
              <p className={labelClass}>
                Gender
              </p>

              <p className={valueClass}>
                —
              </p>
            </div>

            <div>
              <p className={labelClass}>
                Date of Birth
              </p>

              <p className={valueClass}>
                —
              </p>
            </div>

            <div>
              <p className={labelClass}>
                Marital Status
              </p>

              <p className={valueClass}>
                —
              </p>
            </div>

            <div>
              <p className={labelClass}>
                Blood Group
              </p>

              <p className={valueClass}>
                —
              </p>
            </div>

          </div>

        </div>


        {/* ================= CONTACT INFORMATION ================= */}
        <div className={sectionClass}>

          <div className={sectionHeaderClass}>

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white">
                <Phone size={17} />
              </div>

              <div>

                <h2 className="text-base font-bold text-black">
                  Contact Information
                </h2>

                <p className="mt-0.5 text-xs text-gray-400">
                  Contact and address details
                </p>

              </div>

            </div>

            <button className={editButtonClass}>
              <Pencil size={13} />
              Edit
            </button>

          </div>


          <div className="p-5 sm:p-6">

            {/* Email & Phone */}
            <h3 className="mb-5 flex items-center gap-2 text-sm font-bold text-gray-800">
              <Mail size={15} />
              Email & Phone
            </h3>

            <div className="grid gap-6 sm:grid-cols-2">

              <div>
                <p className={labelClass}>
                  Personal Email
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div>
                <p className={labelClass}>
                  Official Email
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div>
                <p className={labelClass}>
                  Mobile No.
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div>
                <p className={labelClass}>
                  Alternate Mobile No.
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div>
                <p className={labelClass}>
                  Emergency Contact Name
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div>
                <p className={labelClass}>
                  Emergency Contact No.
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

            </div>


            {/* Address */}
            <div className="my-8 border-t border-gray-100" />

            <h3 className="mb-5 flex items-center gap-2 text-sm font-bold text-gray-800">
              <MapPin size={15} />
              Address
            </h3>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              <div>
                <p className={labelClass}>
                  City
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div>
                <p className={labelClass}>
                  State
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div>
                <p className={labelClass}>
                  PIN Code
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div className="sm:col-span-2 lg:col-span-3">

                <p className={labelClass}>
                  Current Address
                </p>

                <p className={valueClass}>
                  —
                </p>

              </div>

              <div className="sm:col-span-2 lg:col-span-3">

                <p className={labelClass}>
                  Permanent Address
                </p>

                <p className={valueClass}>
                  —
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* ================= JOB INFORMATION ================= */}
        <div className={sectionClass}>

          <div className={sectionHeaderClass}>

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white">
                <BriefcaseBusiness size={17} />
              </div>

              <div>

                <h2 className="text-base font-bold text-black">
                  Job Information
                </h2>

                <p className="mt-0.5 text-xs text-gray-400">
                  Employment and work details
                </p>

              </div>

            </div>

            <button className={editButtonClass}>
              <Pencil size={13} />
              Edit
            </button>

          </div>


          <div className="p-5 sm:p-6">

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              <div>
                <p className={labelClass}>
                  Department
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div>
                <p className={labelClass}>
                  Designation
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div>
                <p className={labelClass}>
                  Employment Type
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div>
                <p className={labelClass}>
                  Work Location
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div>
                <p className={labelClass}>
                  Joining Date
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div>
                <p className={labelClass}>
                  Probation End Date
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

            </div>


            {/* Shift Timing */}
            <div className="my-8 border-t border-gray-100" />

            <h3 className="mb-5 text-sm font-bold text-gray-800">
              Shift Timing
            </h3>

            <div className="grid gap-6 sm:grid-cols-2">

              <div>
                <p className={labelClass}>
                  From
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div>
                <p className={labelClass}>
                  To
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

            </div>


            {/* Work Mode */}
            <div className="my-8 border-t border-gray-100" />

            <h3 className="mb-4 text-sm font-bold text-gray-800">
              Work Mode
            </h3>

            <p className="text-sm font-semibold text-gray-900">
              —
            </p>


            {/* Employment Status */}
            <div className="my-8 border-t border-gray-100" />

            <h3 className="mb-4 text-sm font-bold text-gray-800">
              Employment Status
            </h3>

            <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700">
              —
            </span>

          </div>

        </div>


        {/* ================= PAYROLL ================= */}
        <div className={sectionClass}>

          <div className={sectionHeaderClass}>

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white">
                <WalletCards size={17} />
              </div>

              <div>

                <h2 className="text-base font-bold text-black">
                  Payroll
                </h2>

                <p className="mt-0.5 text-xs text-gray-400">
                  Salary, deductions and compensation
                </p>

              </div>

            </div>

            <button className={editButtonClass}>
              <Pencil size={13} />
              Edit
            </button>

          </div>


          <div className="p-5 sm:p-6">

            {/* Earnings */}
            <h3 className="mb-5 text-sm font-bold text-gray-800">
              Earnings
            </h3>

            <div className="grid gap-6 sm:grid-cols-2">

              <div>
                <p className={labelClass}>
                  Basic Salary
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div>
                <p className={labelClass}>
                  HRA
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div>
                <p className={labelClass}>
                  Conveyance Allowance
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div>
                <p className={labelClass}>
                  Special Allowance
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

            </div>


            {/* Gross Salary */}
            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <p className="text-sm font-bold text-black">
                    Gross Salary
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Automatically calculated from total earnings
                  </p>

                </div>

                <p className="text-sm font-bold text-black">
                  —
                </p>

              </div>

            </div>


            {/* Deductions */}
            <div className="my-8 border-t border-gray-100" />

            <h3 className="mb-5 text-sm font-bold text-gray-800">
              Deductions
            </h3>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              <div>
                <p className={labelClass}>
                  EPF
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div>
                <p className={labelClass}>
                  Professional Tax
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div>
                <p className={labelClass}>
                  TDS
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

            </div>


            {/* Total Deductions */}
            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <p className="text-sm font-bold text-black">
                    Total Deductions
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    EPF + Professional Tax + TDS
                  </p>

                </div>

                <p className="text-sm font-bold text-black">
                  —
                </p>

              </div>

            </div>


            {/* Net Salary */}
            <div className="mt-3 rounded-xl border border-black bg-black p-4 text-white">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <p className="text-sm font-bold">
                    Net Salary
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Take-home pay after deductions
                  </p>

                </div>

                <p className="text-sm font-bold">
                  —
                </p>

              </div>

            </div>


            {/* Employer Contributions */}
            <div className="my-8 border-t border-gray-100" />

            <h3 className="mb-5 text-sm font-bold text-gray-800">
              Employer Contributions
            </h3>

            <div>

              <p className={labelClass}>
                Employer PF Contribution
              </p>

              <p className={valueClass}>
                —
              </p>

            </div>


            {/* CTC */}
            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <p className="text-sm font-bold text-black">
                    CTC
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Gross salary + employer contributions
                  </p>

                </div>

                <p className="text-sm font-bold text-black">
                  —
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* ================= BANK INFORMATION ================= */}
        <div className={sectionClass}>

          <div className={sectionHeaderClass}>

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white">
                <Landmark size={17} />
              </div>

              <div>

                <h2 className="text-base font-bold text-black">
                  Bank Information
                </h2>

                <p className="mt-0.5 text-xs text-gray-400">
                  Employee banking details
                </p>

              </div>

            </div>

            <button className={editButtonClass}>
              <Pencil size={13} />
              Edit
            </button>

          </div>


          <div className="p-5 sm:p-6">

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              <div>
                <p className={labelClass}>
                  Bank Name
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div>
                <p className={labelClass}>
                  Account Holder Name
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div>
                <p className={labelClass}>
                  Account Number
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div>
                <p className={labelClass}>
                  IFSC Code
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div>
                <p className={labelClass}>
                  Branch
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

            </div>


            {/* Passbook */}
            <div className="mt-8 border-t border-gray-100 pt-6">

              <p className={labelClass}>
                Passbook
              </p>

              <div className="mt-3 flex items-center justify-between rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">

                <div className="flex items-center gap-3">

                  <FileText
                    size={18}
                    className="text-gray-400"
                  />

                  <p className="text-sm font-medium text-gray-500">
                    PDF not available
                  </p>

                </div>

                <Eye
                  size={17}
                  className="text-gray-300"
                />

              </div>

            </div>

          </div>

        </div>


        {/* ================= EDUCATION ================= */}
        <div className={sectionClass}>

          <div className={sectionHeaderClass}>

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white">
                <GraduationCap size={17} />
              </div>

              <div>

                <h2 className="text-base font-bold text-black">
                  Education
                </h2>

                <p className="mt-0.5 text-xs text-gray-400">
                  Academic qualification details
                </p>

              </div>

            </div>

            <button className={editButtonClass}>
              <Pencil size={13} />
              Edit
            </button>

          </div>


          <div className="p-5 sm:p-6">

            <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5">

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                <div>
                  <p className={labelClass}>
                    Qualification
                  </p>

                  <p className={valueClass}>
                    —
                  </p>
                </div>

                <div>
                  <p className={labelClass}>
                    University / Board
                  </p>

                  <p className={valueClass}>
                    —
                  </p>
                </div>

                <div>
                  <p className={labelClass}>
                    Passing Year
                  </p>

                  <p className={valueClass}>
                    —
                  </p>
                </div>

                <div>
                  <p className={labelClass}>
                    10 / CGPA
                  </p>

                  <p className={valueClass}>
                    —
                  </p>
                </div>

                <div>
                  <p className={labelClass}>
                    Specialization
                  </p>

                  <p className={valueClass}>
                    —
                  </p>
                </div>

              </div>


              {/* Certificate */}
              <div className="mt-7 border-t border-gray-200 pt-6">

                <p className={labelClass}>
                  Certificate
                </p>

                <div className="mt-3 flex items-center gap-3">

                  <FileText
                    size={17}
                    className="text-gray-400"
                  />

                  <p className="text-sm font-medium text-gray-500">
                    Certificate not uploaded
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ================= EXPERIENCE ================= */}
        <div className={sectionClass}>

          <div className={sectionHeaderClass}>

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white">
                <Building2 size={17} />
              </div>

              <div>

                <h2 className="text-base font-bold text-black">
                  Experience Information
                </h2>

                <p className="mt-0.5 text-xs text-gray-400">
                  Previous employment details
                </p>

              </div>

            </div>

            <button className={editButtonClass}>
              <Pencil size={13} />
              Edit
            </button>

          </div>


          <div className="p-5 sm:p-6">

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              <div>
                <p className={labelClass}>
                  Company Name
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div>
                <p className={labelClass}>
                  Designation
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div>
                <p className={labelClass}>
                  Total Experience
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div>
                <p className={labelClass}>
                  Skills
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div>
                <p className={labelClass}>
                  Start Date
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div>
                <p className={labelClass}>
                  End Date
                </p>

                <p className={valueClass}>
                  —
                </p>
              </div>

              <div className="sm:col-span-2 lg:col-span-3">

                <p className={labelClass}>
                  Reason for Leaving
                </p>

                <p className={valueClass}>
                  —
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* ================= DOCUMENTS ================= */}
        <div className={sectionClass}>

          <div className={sectionHeaderClass}>

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white">
                <FileText size={17} />
              </div>

              <div>

                <h2 className="text-base font-bold text-black">
                  Documents
                </h2>

                <p className="mt-0.5 text-xs text-gray-400">
                  Employee verification documents
                </p>

              </div>

            </div>

            <button className={editButtonClass}>
              <Pencil size={13} />
              Edit
            </button>

          </div>


          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">

            {/* Aadhaar */}
            <button
              onClick={() => setSelectedDocument("Aadhaar")}
              className="group text-left"
            >

              <div className="rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:shadow-sm">

                <div className="flex items-start justify-between">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 transition-colors duration-200 group-hover:bg-black group-hover:text-white">
                    <FileText size={17} />
                  </div>

                  <Eye
                    size={16}
                    className="text-gray-300 transition-colors duration-200 group-hover:text-black"
                  />

                </div>

                <p className="mt-4 text-sm font-bold text-black">
                  Aadhaar
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Document not uploaded
                </p>

              </div>

            </button>


            {/* PAN */}
            <button
              onClick={() => setSelectedDocument("PAN")}
              className="group text-left"
            >

              <div className="rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:shadow-sm">

                <div className="flex items-start justify-between">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 transition-colors duration-200 group-hover:bg-black group-hover:text-white">
                    <FileText size={17} />
                  </div>

                  <Eye
                    size={16}
                    className="text-gray-300 transition-colors duration-200 group-hover:text-black"
                  />

                </div>

                <p className="mt-4 text-sm font-bold text-black">
                  PAN
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Document not uploaded
                </p>

              </div>

            </button>


            {/* Resume */}
            <button
              onClick={() => setSelectedDocument("Resume")}
              className="group text-left"
            >

              <div className="rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:shadow-sm">

                <div className="flex items-start justify-between">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 transition-colors duration-200 group-hover:bg-black group-hover:text-white">
                    <FileText size={17} />
                  </div>

                  <Eye
                    size={16}
                    className="text-gray-300 transition-colors duration-200 group-hover:text-black"
                  />

                </div>

                <p className="mt-4 text-sm font-bold text-black">
                  Resume
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Document not uploaded
                </p>

              </div>

            </button>


            {/* Offer Letter */}
            <button
              onClick={() => setSelectedDocument("Offer Letter")}
              className="group text-left"
            >

              <div className="rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:shadow-sm">

                <div className="flex items-start justify-between">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 transition-colors duration-200 group-hover:bg-black group-hover:text-white">
                    <FileText size={17} />
                  </div>

                  <Eye
                    size={16}
                    className="text-gray-300 transition-colors duration-200 group-hover:text-black"
                  />

                </div>

                <p className="mt-4 text-sm font-bold text-black">
                  Offer Letter
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Document not uploaded
                </p>

              </div>

            </button>


            {/* Experience Letter */}
            <button
              onClick={() => setSelectedDocument("Experience Letter")}
              className="group text-left"
            >

              <div className="rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:shadow-sm">

                <div className="flex items-start justify-between">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 transition-colors duration-200 group-hover:bg-black group-hover:text-white">
                    <FileText size={17} />
                  </div>

                  <Eye
                    size={16}
                    className="text-gray-300 transition-colors duration-200 group-hover:text-black"
                  />

                </div>

                <p className="mt-4 text-sm font-bold text-black">
                  Experience Letter
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Document not uploaded
                </p>

              </div>

            </button>


            {/* Signed NDA */}
            <button
              onClick={() => setSelectedDocument("Signed NDA")}
              className="group text-left"
            >

              <div className="rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:shadow-sm">

                <div className="flex items-start justify-between">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 transition-colors duration-200 group-hover:bg-black group-hover:text-white">
                    <FileText size={17} />
                  </div>

                  <Eye
                    size={16}
                    className="text-gray-300 transition-colors duration-200 group-hover:text-black"
                  />

                </div>

                <p className="mt-4 text-sm font-bold text-black">
                  Signed NDA
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Document not uploaded
                </p>

              </div>

            </button>


            {/* ID Card */}
            <button
              onClick={() => setSelectedDocument("ID Card")}
              className="group text-left"
            >

              <div className="rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:shadow-sm">

                <div className="flex items-start justify-between">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 transition-colors duration-200 group-hover:bg-black group-hover:text-white">
                    <FileText size={17} />
                  </div>

                  <Eye
                    size={16}
                    className="text-gray-300 transition-colors duration-200 group-hover:text-black"
                  />

                </div>

                <p className="mt-4 text-sm font-bold text-black">
                  ID Card
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Document not uploaded
                </p>

              </div>

            </button>

          </div>

        </div>


        {/* Document Modal */}
        {selectedDocument && (
          <DocumentModal
            document={selectedDocument}
            onClose={() => setSelectedDocument(null)}
          />
        )}


        {/* ================= ACCESS ================= */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-100 px-5 py-5 sm:px-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white">
                  <LockKeyhole size={17} />
                </div>

                <div>

                  <h2 className="text-base font-bold text-black">
                    Access
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-400">
                    Account access and security
                  </p>

                </div>

              </div>

              <button className={editButtonClass}>
                Change Password
              </button>

            </div>

          </div>


          <div className="p-5 sm:p-6">

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">
                Password
              </p>

              <div className="flex items-center justify-between">

                <p className="text-sm font-semibold tracking-widest text-black">
                  ••••••••••
                </p>

                <Eye
                  size={17}
                  className="text-gray-400"
                />

              </div>

            </div>

          </div>

        </section>


        {/* Bottom Back Button */}
        <div className="py-8">

          <button
            onClick={() => navigate("/all-employees")}
            className="group mx-auto flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition-all duration-200 hover:border-black hover:bg-black hover:text-white"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />

            Back to Employees

          </button>

        </div>

      </div>

    </div>
  );
};

export default EmployeeProfile;