import React, { useMemo, useState } from "react";
import MarkAttendanceModal from "../hrModals/MarkAttendanceModal";

import {
  MoreHorizontal,
  Eye,
  Check,
  X,
  Search,
  CalendarDays,
  Clock3,
  MessageSquareText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
} from "lucide-react";

import Modal from "../../UI/Modal";
import AttendanceRequestModal from "../hrModals/AttendanceRequestsModal";

const initialRequests = [
  {
    id: 1,
    empId: "EMP-1024",
    name: "Rahul Kumar",
    department: "Engineering",
    date: "2026-10-07",
    requestedCheckIn: "09:00 AM",
    requestedCheckOut: "06:00 PM",
    reason: "Forgot to mark attendance while arriving at the office.",
    submittedOn: "2026-10-08",
    status: "Pending",
  },
  {
    id: 2,
    empId: "EMP-1056",
    name: "Priya Das",
    department: "HR",
    date: "2026-10-08",
    requestedCheckIn: "09:15 AM",
    requestedCheckOut: "06:10 PM",
    reason: "The attendance device was not responding.",
    submittedOn: "2026-10-08",
    status: "Pending",
  },
  {
    id: 3,
    empId: "EMP-1088",
    name: "Amit Sahu",
    department: "Finance",
    date: "2026-10-06",
    requestedCheckIn: "09:05 AM",
    requestedCheckOut: "05:45 PM",
    reason: "Network issue prevented attendance from syncing.",
    submittedOn: "2026-10-07",
    status: "Approved",
  },
  {
    id: 4,
    empId: "EMP-1102",
    name: "Sneha Patel",
    department: "Design",
    date: "2026-10-05",
    requestedCheckIn: "09:30 AM",
    requestedCheckOut: "06:00 PM",
    reason: "I was unable to record my check-in due to a device issue.",
    submittedOn: "2026-10-06",
    status: "Rejected",
  },
];

const statusStyles = {
  Pending: "bg-gray-100 text-gray-700",
  Approved: "bg-black text-white",
  Rejected: "bg-gray-200 text-gray-500",
};

function formatDate(date) {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function AttendanceRequests() {
  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [markAttendanceOpen, setMarkAttendanceOpen] = useState(false);

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        request.name.toLowerCase().includes(query) ||
        request.empId.toLowerCase().includes(query);

      const matchesDepartment =
        department === "All Departments" ||
        request.department === department;

      const matchesStatus =
        statusFilter === "All Statuses" ||
        request.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [requests, search, department, statusFilter]);

  const pendingCount = requests.filter(
    (request) => request.status === "Pending"
  ).length;

  const approvedCount = requests.filter(
    (request) => request.status === "Approved"
  ).length;

  const rejectedCount = requests.filter(
    (request) => request.status === "Rejected"
  ).length;

  const updateStatus = (requestId, status) => {
    setRequests((current) =>
      current.map((request) =>
        request.id === requestId ? { ...request, status } : request
      )
    );

    setConfirmAction(null);
    setSelectedRequest(null);
    setOpenMenuId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="mx-auto w-full max-w-7xl px-1 py-2 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold sm:text-2xl">
              Attendance Requests
            </h1>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Review and manage employee attendance requests
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">

            {/* Mark Attendance */}
            <button
              type="button"
              onClick={() => setMarkAttendanceOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm text-white transition hover:bg-gray-800 sm:w-auto"
            >
              <Plus size={17} />
              Mark Attendance
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <Stat title="Total Requests" value={requests.length} />
          <Stat title="Pending Requests" value={pendingCount} />
          <Stat title="Approved Requests" value={approvedCount} />
          <Stat title="Rejected Requests" value={rejectedCount} />
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600">
              <AlertCircle size={16} />

              <span>
                {pendingCount} pending request
                {pendingCount === 1 ? "" : "s"}
              </span>
            </div>

        {/* Requests table */}
        <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white sm:mt-6">
          <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-sm font-medium sm:text-base">
                Employee Requests
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Attendance corrections submitted by employees
              </p>
            </div>

            {/* Filters */}
            <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
              <div className="relative w-full sm:w-56">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search employee..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-black"
                />
              </div>

              <select
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-black sm:w-44"
              >
                <option>All Departments</option>
                <option>Engineering</option>
                <option>HR</option>
                <option>Finance</option>
                <option>Design</option>
              </select>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-black sm:w-40"
              >
                <option>All Statuses</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="min-w-170 w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Sl. No.",
                    "Emp ID",
                    "Name",
                    "Department",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap px-4 py-3 text-xs font-medium text-gray-500 sm:px-5"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request, index) => (
                    <tr
                      key={request.id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 sm:px-5">
                        {String(index + 1).padStart(2, "0")}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm font-medium sm:px-5">
                        {request.empId}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 sm:px-5">
                        {request.name}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600 sm:px-5">
                        {request.department}
                      </td>

                      <td className="px-4 py-4 sm:px-5">
                        <div className="relative">
                          <button
                            type="button"
                            aria-label={`Actions for ${request.name}`}
                            aria-expanded={openMenuId === request.id}
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === request.id
                                  ? null
                                  : request.id
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-black"
                          >
                            <MoreHorizontal size={20} />
                          </button>

                          {openMenuId === request.id && (
                            <>
                              <button
                                type="button"
                                aria-label="Close action menu"
                                className="fixed inset-0 z-10 cursor-default"
                                onClick={() => setOpenMenuId(null)}
                              />

                              <div className="absolute right-0 top-9 z-20 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
                                <MenuItem
                                  icon={<Eye size={15} />}
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setOpenMenuId(null);
                                  }}
                                >
                                  View 
                                </MenuItem>

                                <MenuItem
                                  icon={<Check size={15} />}
                                  disabled={request.status !== "Pending"}
                                  onClick={() => {
                                    setConfirmAction({
                                      request,
                                      status: "Approved",
                                    });

                                    setOpenMenuId(null);
                                  }}
                                >
                                  Approve
                                </MenuItem>

                                <MenuItem
                                  icon={<X size={15} />}
                                  disabled={request.status !== "Pending"}
                                  onClick={() => {
                                    setConfirmAction({
                                      request,
                                      status: "Rejected",
                                    });

                                    setOpenMenuId(null);
                                  }}
                                >
                                  Reject
                                </MenuItem>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center">
                      <div className="mx-auto flex max-w-xs flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                          <Search size={18} />
                        </div>

                        <p className="mt-3 text-sm font-medium">
                          No requests found
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Try changing your search or filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Attendance Request Details Modal */}
      <Modal
        isOpen={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        title="Attendance Request Details"
        size="lg"
      >
        {selectedRequest && (
          <AttendanceRequestModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
          />
        )}
      </Modal>

      {/* Mark Attendance Modal */}
      <Modal
        isOpen={markAttendanceOpen}
        onClose={() => setMarkAttendanceOpen(false)}
        title="Mark Attendance"
        size="md"
      >
        <MarkAttendanceModal
          onClose={() => setMarkAttendanceOpen(false)}
          onSave={(attendanceData) => {
            console.log("Attendance saved:", attendanceData);
            setMarkAttendanceOpen(false);
          }}
        />
      </Modal>

      {/* Approve / reject confirmation */}
      {confirmAction && (
        <ModalShell
          title={`${
            confirmAction.status === "Approved" ? "Approve" : "Reject"
          } Request`}
          onClose={() => setConfirmAction(null)}
          compact
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-700">
              {confirmAction.status === "Approved" ? (
                <CheckCircle2 size={20} />
              ) : (
                <XCircle size={20} />
              )}
            </div>

            <div>
              <p className="text-sm font-medium">
                {confirmAction.status === "Approved"
                  ? `Approve ${confirmAction.request.name}'s attendance request?`
                  : `Reject ${confirmAction.request.name}'s attendance request?`}
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                {confirmAction.status === "Approved"
                  ? "This request will be marked as approved."
                  : "This request will be marked as rejected."}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setConfirmAction(null)}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() =>
                updateStatus(
                  confirmAction.request.id,
                  confirmAction.status
                )
              }
              className="rounded-lg bg-black px-4 py-2.5 text-sm text-white transition hover:bg-gray-800"
            >
              Confirm{" "}
              {confirmAction.status === "Approved"
                ? "Approval"
                : "Rejection"}
            </button>
          </div>
        </ModalShell>
      )}
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 text-center sm:p-5">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="mt-2 text-xl font-semibold sm:text-2xl">{value}</p>
    </div>
  );
}

function MenuItem({ icon, children, onClick, disabled = false }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50 hover:text-black disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
    >
      <span className="text-gray-500">{icon}</span>
      {children}
    </button>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

function Detail({ icon, label, value }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>{icon}</span>
        {label}
      </div>

      <p className="mt-2 text-sm font-medium">{value}</p>
    </div>
  );
}

function ModalShell({ title, onClose, children, compact = false }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="attendance-request-modal-title"
        className={`max-h-[90vh] w-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-5 shadow-xl sm:p-6 ${
          compact ? "max-w-md" : "max-w-xl"
        }`}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2
            id="attendance-request-modal-title"
            className="text-base font-semibold"
          >
            {title}
          </h2>

          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-black"
          >
            <X size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default AttendanceRequests;