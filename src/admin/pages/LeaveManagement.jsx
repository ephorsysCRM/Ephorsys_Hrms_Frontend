import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  Check,
  X,
  ArrowLeft,
  Plus,
} from "lucide-react";
import ManageLeaveModal from "../adminModals/ManageLeaveModal";
import Modal from "../../UI/Modal";
import LeaveModal from "../adminModals/LeaveModal";

const leaveRequestsData = [
  {
    id: "LV-1001",
    employeeId: "EMP-1024",
    employee: "Rahul Kumar",
    department: "Engineering",
    leaveType: "Casual Leave",
    from: "2026-10-10",
    to: "2026-10-11",
    days: 2,
    reason: "Personal work",
    status: "Pending",
  },
  {
    id: "LV-1002",
    employeeId: "EMP-1025",
    employee: "Priya Das",
    department: "HR",
    leaveType: "Sick Leave",
    from: "2026-10-12",
    to: "2026-10-12",
    days: 1,
    reason: "Not feeling well",
    status: "Approved",
  },
  {
    id: "LV-1003",
    employeeId: "EMP-1026",
    employee: "Amit Sharma",
    department: "Marketing",
    leaveType: "Sick Leave",
    from: "2026-10-15",
    to: "2026-10-18",
    days: 4,
    reason: "Family function",
    status: "Rejected",
  },
  {
    id: "LV-1004",
    employeeId: "EMP-1027",
    employee: "Sneha Patel",
    department: "Finance",
    leaveType: "Casual Leave",
    from: "2026-10-20",
    to: "2026-10-20",
    days: 1,
    reason: "Personal work",
    status: "Pending",
  },
  {
    id: "LV-1005",
    employeeId: "EMP-1028",
    employee: "Arjun Mehta",
    department: "Engineering",
    leaveType: "Paid Leave",
    from: "2026-10-05",
    to: "2026-10-06",
    days: 2,
    reason: "Medical rest",
    status: "Approved",
  },
  {
    id: "LV-1006",
    employeeId: "EMP-1029",
    employee: "Neha Singh",
    department: "Sales",
    leaveType: "Unpaid Leave",
    from: "2026-10-22",
    to: "2026-10-24",
    days: 3,
    reason: "Personal reasons",
    status: "Pending",
  },
];

const departments = [
  "All Departments",
  "Engineering",
  "HR",
  "Marketing",
  "Finance",
  "Sales",
];

const leaveTypes = [
  "All Leave Types",
  "Casual Leave",
  "Sick Leave",
  "Paid Leave",
  "Unpaid Leave",
];

const statuses = [
  "All Status",
  "Pending",
  "Approved",
  "Rejected",
  "Cancelled",
];

const LeaveManagement = () => {
  const navigate = useNavigate();
  const [selectedLeave, setSelectedLeave] = useState(null);

  const [openMenu, setOpenMenu] = useState(null);
  const [manageLeaveOpen, setManageLeaveOpen] = useState(false);

  const [leaveRequests, setLeaveRequests] = useState(
    leaveRequestsData
  );

  const [search, setSearch] = useState("");
  const [department, setDepartment] =
    useState("All Departments");
  const [leaveType, setLeaveType] =
    useState("All Leave Types");
  const [status, setStatus] =
    useState("All Status");

  // ----------------------------------
  // FILTER
  // ----------------------------------

  const filteredRequests = useMemo(() => {
    return leaveRequests.filter((leave) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        leave.employee
          .toLowerCase()
          .includes(searchText) ||
        leave.employeeId
          .toLowerCase()
          .includes(searchText);

      const matchesDepartment =
        department === "All Departments" ||
        leave.department === department;

      const matchesLeaveType =
        leaveType === "All Leave Types" ||
        leave.leaveType === leaveType;

      const matchesStatus =
        status === "All Status" ||
        leave.status === status;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesLeaveType &&
        matchesStatus
      );
    });
  }, [
    leaveRequests,
    search,
    department,
    leaveType,
    status,
  ]);

  // ----------------------------------
  // STATS
  // ----------------------------------

  const totalRequests = leaveRequests.length;

  const pendingCount = leaveRequests.filter(
    (leave) => leave.status === "Pending"
  ).length;

  const approvedCount = leaveRequests.filter(
    (leave) => leave.status === "Approved"
  ).length;

  const rejectedCount = leaveRequests.filter(
    (leave) => leave.status === "Rejected"
  ).length;

  // ----------------------------------
  // APPROVE
  // ----------------------------------

  const handleApprove = (id) => {
    setLeaveRequests((prev) =>
      prev.map((leave) =>
        leave.id === id
          ? {
            ...leave,
            status: "Approved",
          }
          : leave
      )
    );
  };

  // ----------------------------------
  // REJECT
  // ----------------------------------

  const handleReject = (id) => {
    setLeaveRequests((prev) =>
      prev.map((leave) =>
        leave.id === id
          ? {
            ...leave,
            status: "Rejected",
          }
          : leave
      )
    );
  };

  const handleAddLeave = (newLeave) => {
    setLeaveRequests((prev) => [
      ...prev,
      {
        ...newLeave,
        id: `LV-${1001 + prev.length}`,
      },
    ]);
  };

  // ----------------------------------
  // STATUS BADGE
  // ----------------------------------

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "bg-gray-100 text-gray-800";

      case "Rejected":
        return "bg-gray-900 text-white";

      case "Pending":
        return "border border-gray-300 bg-white text-gray-700";

      case "Cancelled":
        return "bg-gray-200 text-gray-500";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ==========================================
  // STAT COMPONENT
  // ==========================================

  const Stat = ({ label, value }) => {
    return (
      <div
        className="
        rounded-xl
        border border-gray-200
        bg-white p-5
      "
      >

        <p className="text-sm text-gray-500">
          {label}
        </p>

        <p
          className="
          mt-2 text-2xl
          font-semibold text-gray-900
        "
        >
          {value}
        </p>

      </div>
    );
  };

  // ==========================================
  // DATE FORMATTER
  // ==========================================

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-1 py-2">

        <div>
          {/* <button
            type="button"
            onClick={() =>
              navigate("/hr/dashboard")
            }
            className="
              group mb-3 inline-flex items-center
              gap-2 rounded-lg py-1.5
              text-sm font-medium text-gray-500
              transition-all duration-200
              hover:bg-white hover:text-black
            "
          >
            <ArrowLeft
              size={17}
              className="
                transition-transform
                duration-200
                group-hover:-translate-x-0.5
              "
            />

            Back to dashboard
          </button> */}

          <h1 className="text-xl font-semibold text-gray-900 ">
            Leave Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage employee leave requests
          </p>
        </div>

        <button
          type="button"
          onClick={() => setManageLeaveOpen(true)}
          className="
            flex gap-2 justify-center items-center w-full rounded-lg bg-black
            px-4 py-2.5 text-sm font-medium
            text-white transition
            hover:bg-gray-800
            sm:w-auto
          "
        >
          <Plus size={17} /> Manage Leave
        </button>

      </div>

      {/* ================= STATS ================= */}

      <div
        className="
          grid grid-cols-2 gap-4
          sm:grid-cols-2
          xl:grid-cols-4
          text-center
        "
      >

        <Stat
          label="Total Requests"
          value={totalRequests}
        />

        <Stat
          label="Pending"
          value={pendingCount}
        />

        <Stat
          label="Approved"
          value={approvedCount}
        />

        <Stat
          label="Rejected"
          value={rejectedCount}
        />

      </div>

      {/* ================= FILTERS ================= */}

      <div className="rounded-xl border border-gray-200 bg-white p-4">

        <div
          className="
            grid grid-cols-1 gap-3
            md:grid-cols-2
            xl:grid-cols-4
          "
        >

          {/* Search */}

          <div className="relative">

            <Search
              size={18}
              className="
                absolute left-3 top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                w-full rounded-lg
                border border-gray-200
                bg-white py-2.5
                pl-10 pr-3
                text-sm outline-none
                focus:border-black
              "
            />

          </div>

          {/* Department */}

          <select
            value={department}
            onChange={(e) =>
              setDepartment(e.target.value)
            }
            className="
              rounded-lg border border-gray-200
              bg-white px-3 py-2.5
              text-sm outline-none
              focus:border-black
            "
          >
            {departments.map((item) => (
              <option key={item}>
                {item}
              </option>
            ))}
          </select>

          {/* Leave Type */}

          <select
            value={leaveType}
            onChange={(e) =>
              setLeaveType(e.target.value)
            }
            className="
              rounded-lg border border-gray-200
              bg-white px-3 py-2.5
              text-sm outline-none
              focus:border-black
            "
          >
            {leaveTypes.map((item) => (
              <option key={item}>
                {item}
              </option>
            ))}
          </select>

          {/* Status */}

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="
              rounded-lg border border-gray-200
              bg-white px-3 py-2.5
              text-sm outline-none
              focus:border-black
            "
          >
            {statuses.map((item) => (
              <option key={item}>
                {item}
              </option>
            ))}
          </select>

        </div>

      </div>

      {/* ================= TABLE ================= */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

        <div className="overflow-x-auto">

          <table className="min-w-250 w-full text-sm">

            <thead className="border-b border-gray-200 bg-gray-50">

              <tr
                className="
                  text-left text-xs
                  font-medium uppercase
                  text-gray-500
                "
              >

                <th className="px-5 py-4">
                  Employee
                </th>

                <th className="px-5 py-4">
                  Department
                </th>

                <th className="px-5 py-4">
                  Leave Type
                </th>

                <th className="px-5 py-4">
                  From
                </th>

                <th className="px-5 py-4">
                  To
                </th>

                <th className="px-5 py-4">
                  Days
                </th>

                <th className="px-8 py-4">
                  Status
                </th>

                <th className="px-15 py-4 ">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-100">

              {filteredRequests.length > 0 ? (
                filteredRequests.map((leave) => (

                  <tr
                    key={leave.id}
                    className="transition hover:bg-gray-50"
                  >

                    {/* Employee */}

                    <td className="px-5 py-4">

                      <div className="font-medium text-gray-900">
                        {leave.employee}
                      </div>

                      <div className="mt-0.5 text-xs text-gray-500">
                        {leave.employeeId}
                      </div>

                    </td>

                    {/* Department */}

                    <td className="px-5 py-4 text-gray-600">
                      {leave.department}
                    </td>

                    {/* Leave Type */}

                    <td className="px-5 py-4 text-gray-600">
                      {leave.leaveType}
                    </td>

                    {/* From */}

                    <td className="px-5 py-4 text-gray-600">
                      {formatDate(leave.from)}
                    </td>

                    {/* To */}

                    <td className="px-5 py-4 text-gray-600">
                      {formatDate(leave.to)}
                    </td>

                    {/* Days */}

                    <td className="px-8 py-4 font-medium text-gray-900">
                      {leave.days}
                    </td>

                    {/* Status */}

                    <td className="px-5 py-4">

                      <span
                        className={`
                          inline-flex rounded-full
                          px-2.5 py-1
                          text-xs font-medium
                          ${getStatusClass(
                          leave.status
                        )}
                        `}
                      >
                        {leave.status}
                      </span>

                    </td>

                    {/* Action */}

                    <td className="px-5 py-4">
                      <div className="relative flex justify-center">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenu(
                              openMenu === leave.id ? null : leave.id
                            )
                          }
                          className="
                            rounded-lg p-2 text-gray-500
                            transition hover:bg-gray-100
                            hover:text-gray-900
                          "
                          title="Actions"
                          aria-label={`Actions for ${leave.employee}`}
                        >
                          <span className="text-xl font-semibold leading-none">
                            ⋯
                          </span>
                        </button>

                        {openMenu === leave.id && (
                          <div
                            className="
                              absolute right-0 top-7 z-50 w-36
                              rounded-lg border border-gray-200
                              bg-white p-1 shadow-lg
                            "
                          >
                            {/* View */}
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenu(null);
                                setSelectedLeave(leave);
                              }}
                              className="
                                flex w-full items-center rounded-md
                                px-3 py-2 text-left text-sm
                                text-gray-700 transition hover:bg-gray-100
                              "
                            >
                              <Eye size={15} className="mr-2" />
                              View
                            </button>

                            {/* Accept */}
                            {leave.status === "Pending" && (
                              <button
                                type="button"
                                onClick={() => {
                                  handleApprove(leave.id);
                                  setOpenMenu(null);
                                }}
                                className="
                                  flex w-full items-center rounded-md
                                  px-3 py-2 text-left text-sm
                                  text-gray-700 transition hover:bg-gray-100
                                "
                              >
                                <Check size={15} className="mr-2" />
                                Accept
                              </button>
                            )}

                            {/* Reject */}
                            {leave.status === "Pending" && (
                              <button
                                type="button"
                                onClick={() => {
                                  handleReject(leave.id);
                                  setOpenMenu(null);
                                }}
                                className="
                                  flex w-full items-center rounded-md
                                  px-3 py-2 text-left text-sm
                                  text-gray-700 transition hover:bg-gray-100
                                "
                              >
                                <X size={15} className="mr-2" />
                                Reject
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (

                <tr>

                  <td
                    colSpan="8"
                    className="
                      px-5 py-12
                      text-center
                      text-sm text-gray-500
                    "
                  >
                    No leave requests found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      <ManageLeaveModal
        isOpen={manageLeaveOpen}
        onClose={() => setManageLeaveOpen(false)}
        onSubmit={handleAddLeave}
      />

      <Modal
        isOpen={Boolean(selectedLeave)}
        onClose={() => setSelectedLeave(null)}
        title="Employee Leave Details"
        size="lg"
      >
        {selectedLeave && (
          <LeaveModal
            leave={selectedLeave}
            onClose={() => setSelectedLeave(null)}
          />
        )}
      </Modal>

    </div>
  );
};

export default LeaveManagement;