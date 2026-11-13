
import {
  Plus,
} from "lucide-react";

import { useState } from "react";

import Modal from "../../UI/Modal";
import LeaveModal from "../employeeModal/LeaveModal";
import Pagination from "../../UI/Pagination";

const leaveRequests = [
  {
    id: 1,
    type: "Casual Leave",
    from: "10 Oct 2026",
    to: "11 Oct 2026",
    days: 2,
    reason: "Personal work",
    status: "Pending",
  },
  {
    id: 2,
    type: "Sick Leave",
    from: "02 Oct 2026",
    to: "02 Oct 2026",
    days: 1,
    reason: "Not feeling well",
    status: "Approved",
  },
  {
    id: 3,
    type: "Work From Home",
    from: "28 Sep 2026",
    to: "28 Sep 2026",
    days: 1,
    reason: "Personal work",
    status: "Rejected",
  },
];

const getStatusStyle = (status) => {
  if (status === "Approved") {
    return "border-green-200 bg-green-50 text-green-700";
  }

  if (status === "Rejected") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
};

const EmpLeaveReq = () => {
  const [applyLeaveOpen, setApplyLeaveOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const limit = 5;
  const totalPages = Math.ceil(leaveRequests.length / limit);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Get leave requests for the current page
  const currentLeaveRequests = leaveRequests.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  const handleCloseApplyLeave = () => {
    setApplyLeaveOpen(false);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-1">
      {/* Header */}
      <div className="mb-7 flex flex-col gap-4 px-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
            My Leave Requests
          </h1>

          <p className="mt-1.5 text-sm text-gray-500">
            View your leave applications and track their status.
          </p>
        </div>

        <button
          onClick={() => setApplyLeaveOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-gray-800"
        >
          <Plus size={18} />
          Apply Leave
        </button>
      </div>

      {/* Leave Requests Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Table Heading */}
        <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
          <h2 className="text-lg font-bold text-black">
            Leave Request History
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Recent leave applications and their approval status.
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Leave Type
                </th>

                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Duration
                </th>

                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Days
                </th>

                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Reason
                </th>

                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {currentLeaveRequests.map((request) => (
                <tr
                  key={request.id}
                  className="transition hover:bg-gray-50/70"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-900">
                      {request.type}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700">
                      {request.from}
                    </p>

                    {request.from !== request.to && (
                      <p className="mt-0.5 text-xs text-gray-400">
                        to {request.to}
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {request.days}{" "}
                      {request.days === 1 ? "day" : "days"}
                    </span>
                  </td>

                  <td className="max-w-[240px] px-6 py-4">
                    <p className="truncate text-sm text-gray-600">
                      {request.reason}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-bold ${getStatusStyle(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-3 p-4 md:hidden">
          {currentLeaveRequests.map((request) => (
            <div
              key={request.id}
              className="rounded-xl border border-gray-200 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-black">
                    {request.type}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {request.from}
                    {request.from !== request.to &&
                      ` → ${request.to}`}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${getStatusStyle(
                    request.status
                  )}`}
                >
                  {request.status}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                <p className="max-w-[70%] truncate text-xs text-gray-500">
                  {request.reason}
                </p>

                <p className="text-xs font-bold text-black">
                  {request.days}{" "}
                  {request.days === 1 ? "day" : "days"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={applyLeaveOpen}
        onClose={handleCloseApplyLeave}
        title="Apply Leave"
        size="md"
      >
        <LeaveModal onClose={handleCloseApplyLeave} />
      </Modal>
    </div>
  );
};

export default EmpLeaveReq;
