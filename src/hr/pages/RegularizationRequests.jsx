
import { useMemo, useState } from "react";
import {
    Search,
    Filter,
    Eye,
    Clock,
    CheckCircle2,
    XCircle,
    FileText,
    ChevronLeft,
    ChevronRight,
    X,
    Check,
    User,
    CalendarDays,
    Building2,
    Briefcase,
    AlertCircle,
    MoreVertical
} from "lucide-react";

const regularizationData = [
    {
        _id: "6ae9de191e9bace821a59b9f",
        employee: {
            employeeId: "E/00989",
            firstName: "Manoj@123",
            middleName: "Kumar",
            lastName: "Das",
            profilePhoto:
                "https://res.cloudinary.com/devrmpo2p/image/upload/v1792153457/hrms/employees/zzzzhkgl5k4tilikqxk5.jpg",
            department: { name: "Hr" },
            designation: "Software Developer",
        },
        attendanceDate: "2026-11-03",
        reason: "I forgot to mark my attendance.",
        requestedStatus: "present",
        status: "approved",
        reviewedBy: "Rahul Kumar Sharma",
        reviewedAt: "2026-11-04T10:02:50.015Z",
        rejectionReason: "",
        createdAt: "2026-11-03T13:14:01.447Z",
    },
    {
        _id: "6aeb03696950e71b3ba163bb",
        employee: {
            employeeId: "EMP001",
            firstName: "Rahul",
            middleName: "Kumar",
            lastName: "Sharma",
            profilePhoto:
                "https://res.cloudinary.com/devrmpo2p/image/upload/v1791526376/hrms/employees/vdeu6yyxvpix4rnd3uog.png",
            department: null,
            designation: "Human Resource",
        },
        attendanceDate: "2026-11-02",
        reason: "I forgot to mark my attendance.",
        requestedStatus: "present",
        status: "approved",
        reviewedBy: "Rahul Kumar Sharma",
        reviewedAt: "2026-11-04T10:06:04.820Z",
        rejectionReason: "",
        createdAt: "2026-11-04T10:05:29.200Z",
    },
    {
        _id: "6aeb01200fcf6b3788fcab7e",
        employee: {
            employeeId: "E/00989",
            firstName: "Manoj@123",
            middleName: "Kumar",
            lastName: "Das",
            profilePhoto:
                "https://res.cloudinary.com/devrmpo2p/image/upload/v1792153457/hrms/employees/zzzzhkgl5k4tilikqxk5.jpg",
            department: { name: "Hr" },
            designation: "Software Developer",
        },
        attendanceDate: "2026-11-02",
        reason: "I forgot to mark my attendance.",
        requestedStatus: "present",
        status: "rejected",
        reviewedBy: "Rahul Kumar Sharma",
        reviewedAt: "2026-11-04T10:04:15.163Z",
        rejectionReason:
            "Your attendance proof is insufficient. Please provide valid supporting evidence.",
        createdAt: "2026-11-04T09:55:44.564Z",
    },
    {
        _id: "6aeb04136950e71b3ba163f3",
        employee: {
            employeeId: "E/00989",
            firstName: "Manoj@123",
            middleName: "Kumar",
            lastName: "Das",
            profilePhoto:
                "https://res.cloudinary.com/devrmpo2p/image/upload/v1792153457/hrms/employees/zzzzhkgl5k4tilikqxk5.jpg",
            department: { name: "Hr" },
            designation: "Software Developer",
        },
        attendanceDate: "2026-10-30",
        reason: "I forgot to mark my attendance.",
        requestedStatus: "present",
        status: "pending",
        reviewedBy: null,
        reviewedAt: null,
        rejectionReason: "",
        createdAt: "2026-11-04T10:08:19.344Z",
    },
];

const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatStatus = (status) => {
    if (!status) return "—";

    return status
        .replace("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getEmployeeName = (employee) =>
    [
        employee?.firstName,
        employee?.middleName,
        employee?.lastName,
    ]
        .filter(Boolean)
        .join(" ");

const StatusBadge = ({ status }) => {
    const styles = {
        approved: "bg-green-100 text-green-700 border-green-200",
        pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
        rejected: "bg-red-100 text-red-700 border-red-200",
    };

    const icons = {
        approved: <CheckCircle2 size={13} />,
        pending: <Clock size={13} />,
        rejected: <XCircle size={13} />,
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${styles[status] || styles.pending
                }`}
        >
            {icons[status]}
            {formatStatus(status)}
        </span>
    );
};

const StatCard = ({ title, count, icon: Icon }) => (
    <div className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-black">
        <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="rounded-lg bg-gray-100 p-2">
                <Icon size={19} className="text-black" />
            </div>
        </div>
        <h2 className="mt-4 text-3xl font-semibold text-black">
            {count}
        </h2>
    </div>
);

const RegularizationRequests = () => {
    const [requests, setRequests] = useState(regularizationData);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [rejectRequest, setRejectRequest] = useState(null);

    const [openMenuId, setOpenMenuId] = useState(null);

    const pageSize = 5;

    const stats = {
        total: requests.length,
        approved: requests.filter((r) => r.status === "approved").length,
        pending: requests.filter((r) => r.status === "pending").length,
        rejected: requests.filter((r) => r.status === "rejected").length,
    };

    const filteredRequests = useMemo(() => {
        return requests.filter((request) => {
            const employeeName = getEmployeeName(request.employee);

            const matchesSearch =
                employeeName.toLowerCase().includes(search.toLowerCase()) ||
                request.employee?.employeeId?.toLowerCase().includes(search.toLowerCase()) ||
                request.reason.toLowerCase().includes(search.toLowerCase()) ||
                request.attendanceDate.includes(search);

            const matchesStatus =
                statusFilter === "all" || request.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [requests, search, statusFilter]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredRequests.length / pageSize)
    );

    const paginatedRequests = filteredRequests.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleFilter = (value) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

    // Approve request
    const handleApprove = (requestId) => {
        setRequests((prev) =>
            prev.map((request) =>
                request._id === requestId
                    ? {
                        ...request,
                        status: "approved",
                        reviewedBy: "Current HR User",
                        reviewedAt: new Date().toISOString(),
                        rejectionReason: "",
                    }
                    : request
            )
        );

        setSelectedRequest(null);
    };

    // Open rejection modal
    const openRejectModal = (request) => {
        setRejectRequest(request);
        setRejectReason("");
        setShowRejectModal(true);
    };

    // Reject request with mandatory reason
    const handleReject = () => {
        if (!rejectReason.trim()) return;

        setRequests((prev) =>
            prev.map((request) =>
                request._id === rejectRequest._id
                    ? {
                        ...request,
                        status: "rejected",
                        reviewedBy: "Current HR User",
                        reviewedAt: new Date().toISOString(),
                        rejectionReason: rejectReason.trim(),
                    }
                    : request
            )
        );

        setShowRejectModal(false);
        setRejectRequest(null);
        setRejectReason("");
        setSelectedRequest(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 px-3 sm:px-5 lg:px-7">
            <div className="mx-auto max-w-[1600px] space-y-7">

                {/* Header */}
                <div>
                    <h1 className="text-lg font-bold tracking-tight text-black sm:text-3xl">
                        Attendance Regularization
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Review and manage employee attendance regularization requests.
                    </p>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard title="Total Requests" count={stats.total} icon={FileText} />
                    <StatCard title="Approved" count={stats.approved} icon={CheckCircle2} />
                    <StatCard title="Pending" count={stats.pending} icon={Clock} />
                    <StatCard title="Rejected" count={stats.rejected} icon={XCircle} />
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

                    <div className="flex flex-col justify-between gap-4 border-b border-gray-200 p-5 lg:flex-row lg:items-center">
                        <div>
                            <h2 className="text-lg font-semibold text-black">
                                Employee Requests
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Review employee requests and take appropriate action.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative">
                                <Search
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Search employee..."
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-black sm:w-64"
                                />
                            </div>

                            <div className="relative">
                                <Filter
                                    size={16}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => handleFilter(e.target.value)}
                                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-8 text-sm outline-none focus:border-black sm:w-40"
                                >
                                    <option value="all">All Status</option>
                                    <option value="approved">Approved</option>
                                    <option value="pending">Pending</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[1100px] text-left">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    {[
                                        "Employee",
                                        "Attendance Date",
                                        "Reason",
                                        "Requested Status",
                                        "Request Status",
                                        "Action",
                                    ].map((heading) => (
                                        <th
                                            key={heading}
                                            className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                                        >
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {paginatedRequests.length > 0 ? (
                                    paginatedRequests.map((request) => (
                                        <tr
                                            key={request._id}
                                            className="transition hover:bg-gray-50"
                                        >
                                            <td className="whitespace-nowrap px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    {request.employee?.profilePhoto ? (
                                                        <img
                                                            src={request.employee.profilePhoto}
                                                            alt=""
                                                            className="h-10 w-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                                            <User size={18} />
                                                        </div>
                                                    )}

                                                    <div>
                                                        <p className="text-sm font-semibold text-black">
                                                            {getEmployeeName(request.employee)}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {request.employee?.employeeId}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-black">
                                                {formatDate(request.attendanceDate)}
                                            </td>

                                            <td className="max-w-48 px-5 py-4 text-sm text-gray-600">
                                                <span className="line-clamp-2">
                                                    {request.reason}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                                                {formatStatus(request.requestedStatus)}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4">
                                                <StatusBadge status={request.status} />
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="relative flex justify-center">
                                                    <button
                                                        onClick={() =>
                                                            setOpenMenuId(
                                                                openMenuId === request._id ? null : request._id
                                                            )
                                                        }
                                                        title="More options"
                                                        className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-black hover:bg-gray-100"
                                                    >
                                                        <MoreVertical size={18} />
                                                    </button>

                                                    {openMenuId === request._id && (
                                                        <div className="absolute right-8 bottom-0 z-30 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">

                                                            {/* View */}
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedRequest(request);
                                                                    setOpenMenuId(null);
                                                                }}
                                                                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                                                            >
                                                                <Eye size={15} />
                                                                View Details
                                                            </button>

                                                            {request.status === "pending" && (
                                                                <>
                                                                    {/* Approve */}
                                                                    <button
                                                                        onClick={() => {
                                                                            handleApprove(request._id);
                                                                            setOpenMenuId(null);
                                                                        }}
                                                                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-green-700 hover:bg-green-50"
                                                                    >
                                                                        <Check size={15} />
                                                                        Approve
                                                                    </button>

                                                                    {/* Reject */}
                                                                    <button
                                                                        onClick={() => {
                                                                            openRejectModal(request);
                                                                            setOpenMenuId(null);
                                                                        }}
                                                                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                                                                    >
                                                                        <X size={15} />
                                                                        Reject
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-5 py-16 text-center">
                                            <FileText
                                                size={32}
                                                className="mx-auto mb-3 text-gray-300"
                                            />
                                            <p className="font-medium text-black">
                                                No requests found
                                            </p>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Try changing your search or filters.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col justify-between gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center mr-16">
                        <p className="text-sm text-gray-500">
                            Showing{" "}
                            <span className="font-medium text-black">
                                {filteredRequests.length === 0
                                    ? 0
                                    : (currentPage - 1) * pageSize + 1}
                                {" - "}
                                {Math.min(currentPage * pageSize, filteredRequests.length)}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium text-black">
                                {filteredRequests.length}
                            </span>{" "}
                            requests
                        </p>

                        <div className="flex items-center">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                                className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:border-black disabled:opacity-30"
                            >
                                <ChevronLeft size={17} />
                            </button>

                            <span className="px-3 text-sm font-medium text-black">
                                {currentPage} / {totalPages}
                            </span>

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => p + 1)}
                                className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:border-black disabled:opacity-30"
                            >
                                <ChevronRight size={17} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Request Details Modal */}
            {selectedRequest && (
                <div
                    className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
                    onClick={() => setSelectedRequest(null)}
                >
                    <div
                        className="my-8 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-5 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-black">
                                    Request Details
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Employee attendance regularization information
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-5 flex items-center gap-3 rounded-lg border border-gray-200 p-4">
                            <img
                                src={selectedRequest.employee?.profilePhoto}
                                alt=""
                                className="h-14 w-14 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-semibold text-black">
                                    {getEmployeeName(selectedRequest.employee)}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {selectedRequest.employee?.employeeId}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    {selectedRequest.employee?.designation}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                ["Department", selectedRequest.employee?.department?.name || "—"],
                                ["Attendance Date", formatDate(selectedRequest.attendanceDate)],
                                ["Requested Status", formatStatus(selectedRequest.requestedStatus)],
                                ["Employee Reason", selectedRequest.reason],
                                ["Reviewed By", selectedRequest.reviewedBy || "Not reviewed yet"],
                                ["Reviewed At", formatDate(selectedRequest.reviewedAt)],
                                ["Submitted At", formatDate(selectedRequest.createdAt)],
                            ].map(([label, value]) => (
                                <div key={label} className="border-b border-gray-100 pb-3">
                                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                                        {label}
                                    </p>
                                    <p className="break-words text-sm font-medium text-gray-800">
                                        {value}
                                    </p>
                                </div>
                            ))}

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                    Request Status
                                </span>
                                <StatusBadge status={selectedRequest.status} />
                            </div>

                            {selectedRequest.rejectionReason && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                                    <p className="mb-1 text-xs font-semibold uppercase text-red-600">
                                        Rejection Reason
                                    </p>
                                    <p className="text-sm text-red-700">
                                        {selectedRequest.rejectionReason}
                                    </p>
                                </div>
                            )}
                        </div>

                        {selectedRequest.status === "pending" && (
                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleApprove(selectedRequest._id)}
                                    className="flex items-center justify-center gap-2 rounded-lg bg-green-600 py-3 text-sm font-medium text-white transition hover:bg-green-700"
                                >
                                    <Check size={17} />
                                    Approve
                                </button>

                                <button
                                    onClick={() => openRejectModal(selectedRequest)}
                                    className="flex items-center justify-center gap-2 rounded-lg bg-red-600 py-3 text-sm font-medium text-white transition hover:bg-red-700"
                                >
                                    <X size={17} />
                                    Reject
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => setSelectedRequest(null)}
                            className="mt-3 w-full rounded-lg border border-gray-200 py-3 text-sm font-medium text-black transition hover:bg-gray-50"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Reject Confirmation Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="rounded-full bg-red-100 p-3 text-red-600">
                                <AlertCircle size={22} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-black">
                                    Reject Request
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Provide a reason for rejecting this request.
                                </p>
                            </div>
                        </div>

                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Rejection Reason <span className="text-red-500">*</span>
                        </label>

                        <textarea
                            rows="4"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Enter the reason for rejection..."
                            className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-black"
                        />

                        <p className="mt-1 text-xs text-gray-400">
                            A rejection reason is mandatory.
                        </p>

                        <div className="mt-5 flex gap-3">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectRequest(null);
                                    setRejectReason("");
                                }}
                                className="flex-1 rounded-lg border border-gray-200 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleReject}
                                disabled={!rejectReason.trim()}
                                className="flex-1 rounded-lg bg-red-600 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegularizationRequests;
