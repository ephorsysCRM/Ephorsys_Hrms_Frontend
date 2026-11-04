import { useMemo, useState } from "react";
import {
    Search,
    Plus,
    Filter,
    Eye,
    CalendarDays,
    Clock,
    CheckCircle2,
    XCircle,
    FileText,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";

const regularizationData = [
    {
        _id: "6ae9de191e9bace821a59b9f",
        attendanceDate: "2026-11-03",
        reason: "I forgot to mark my attendance.",
        requestedStatus: "present",
        status: "approved",
        reviewedBy: {
            firstName: "Rahul",
            middleName: "Kumar",
            lastName: "Sharma",
        },
        reviewedAt: "2026-11-04T10:02:50.015Z",
        rejectionReason: "",
        createdAt: "2026-11-03T13:14:01.447Z",
    },
    {
        _id: "6aeb0da56950e71b3ba164e4",
        attendanceDate: "2026-11-02",
        reason: "ffff",
        requestedStatus: "half_day",
        status: "pending",
        reviewedBy: null,
        reviewedAt: null,
        rejectionReason: "",
        createdAt: "2026-11-04T10:49:09.193Z",
    },
    {
        _id: "6aeb01200fcf6b3788fcab7e",
        attendanceDate: "2026-11-02",
        reason: "I forgot to mark my attendance.",
        requestedStatus: "present",
        status: "rejected",
        reviewedBy: {
            firstName: "Rahul",
            middleName: "Kumar",
            lastName: "Sharma",
        },
        reviewedAt: "2026-11-04T10:04:15.163Z",
        rejectionReason:
            "Your attendance proof is insufficient. Please provide valid supporting evidence.",
        createdAt: "2026-11-04T09:55:44.564Z",
    },
    {
        _id: "6aeb04136950e71b3ba163f3",
        attendanceDate: "2026-10-30",
        reason: "I forgot to mark my attendance.",
        requestedStatus: "present",
        status: "approved",
        reviewedBy: {
            firstName: "Rahul",
            middleName: "Kumar",
            lastName: "Sharma",
        },
        reviewedAt: "2026-11-04T10:09:09.966Z",
        rejectionReason: "",
        createdAt: "2026-11-04T10:08:19.344Z",
    },
    {
        _id: "6ae9de191e9bace821a59b9f",
        attendanceDate: "2026-11-03",
        reason: "I forgot to mark my attendance.",
        requestedStatus: "present",
        status: "approved",
        reviewedBy: {
            firstName: "Rahul",
            middleName: "Kumar",
            lastName: "Sharma",
        },
        reviewedAt: "2026-11-04T10:02:50.015Z",
        rejectionReason: "",
        createdAt: "2026-11-03T13:14:01.447Z",
    },
    {
        _id: "6ae9de191e9bace821a59b9f",
        attendanceDate: "2026-11-03",
        reason: "I forgot to mark my attendance.",
        requestedStatus: "present",
        status: "approved",
        reviewedBy: {
            firstName: "Rahul",
            middleName: "Kumar",
            lastName: "Sharma",
        },
        reviewedAt: "2026-11-04T10:02:50.015Z",
        rejectionReason: "",
        createdAt: "2026-11-03T13:14:01.447Z",
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

const Regularization = () => {
    const [requests] = useState(regularizationData);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const pageSize = 5;

    const stats = {
        total: requests.length,
        approved: requests.filter((r) => r.status === "approved").length,
        pending: requests.filter((r) => r.status === "pending").length,
        rejected: requests.filter((r) => r.status === "rejected").length,
    };

    const filteredRequests = useMemo(() => {
        return requests.filter((request) => {
            const matchesSearch =
                request.reason.toLowerCase().includes(search.toLowerCase()) ||
                request.attendanceDate.includes(search) ||
                request.requestedStatus.toLowerCase().includes(search.toLowerCase());

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

    return (
        <div className="min-h-screen bg-gray-50 px-3 sm:px-5 lg:px-7">
            <div className="mx-auto max-w-[1600px] space-y-7">

                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-black sm:text-3xl">
                            Regularization Requests
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            View and manage your attendance regularization requests.
                        </p>
                    </div>

                    <button className="flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800">
                        <Plus size={18} />
                        New Request
                    </button>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Total Requests"
                        count={stats.total}
                        icon={FileText}
                    />
                    <StatCard
                        title="Approved"
                        count={stats.approved}
                        icon={CheckCircle2}
                    />
                    <StatCard
                        title="Pending"
                        count={stats.pending}
                        icon={Clock}
                    />
                    <StatCard
                        title="Rejected"
                        count={stats.rejected}
                        icon={XCircle}
                    />
                </div>

                {/* Table Container */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

                    {/* Table Header */}
                    <div className="flex flex-col justify-between gap-4 border-b border-gray-200 p-5 lg:flex-row lg:items-center">
                        <div>
                            <h2 className="text-lg font-semibold text-black">
                                All Requests
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                A complete history of your regularization requests.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            {/* Search */}
                            <div className="relative">
                                <Search
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Search requests..."
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-black sm:w-64"
                                />
                            </div>

                            {/* Status Filter */}
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

                    {/* Responsive Table */}
                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-312.5 text-left">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    {[
                                        "Attendance Date",
                                        "Reason",
                                        "Requested Status",
                                        "Request Status",
                                        "Reviewed By",
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
                                            <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-black">
                                                <div className="flex items-center gap-2">
                                                    {formatDate(request.attendanceDate)}
                                                </div>
                                            </td>

                                            <td className="max-w-50 px-5 py-4 text-sm text-gray-600">
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

                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                                                {request.reviewedBy
                                                    ? [
                                                        request.reviewedBy.firstName,
                                                        request.reviewedBy.middleName,
                                                        request.reviewedBy.lastName,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(" ")
                                                    : "—"}
                                            </td>

                                            <td className="px-5 py-4">
                                                <button
                                                    onClick={() => setSelectedRequest(request)}
                                                    title="View details"
                                                    className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-black hover:bg-black hover:text-white"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="9"
                                            className="px-5 py-16 text-center"
                                        >
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
                    <div className="flex flex-col justify-between gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center">
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

                        <div className="flex items-center mr-20">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                                className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:border-black disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                <ChevronLeft size={17} />
                            </button>

                            <span className="px-3 text-sm font-medium text-black">
                                {currentPage} / {totalPages}
                            </span>

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => p + 1)}
                                className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:border-black disabled:cursor-not-allowed disabled:opacity-30"
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
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
                    onClick={() => setSelectedRequest(null)}
                >
                    <div className="my-8 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-5 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-6 flex items-center justify-between ">
                            <div>
                                <h2 className="text-xl font-bold text-black">
                                    Request Details
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Attendance regularization information
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-black"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                    Request Status
                                </span>
                                <StatusBadge status={selectedRequest.status} />
                            </div>

                            {[
                                ["Attendance Date", formatDate(selectedRequest.attendanceDate)],
                                ["Requested Status", formatStatus(selectedRequest.requestedStatus)],
                                ["Reason", selectedRequest.reason],
                                [
                                    "Reviewed By",
                                    selectedRequest.reviewedBy
                                        ? [
                                            selectedRequest.reviewedBy.firstName,
                                            selectedRequest.reviewedBy.middleName,
                                            selectedRequest.reviewedBy.lastName,
                                        ].filter(Boolean).join(" ")
                                        : "Not reviewed yet",
                                ],
                                ["Reviewed At", formatDate(selectedRequest.reviewedAt)],
                                ["Submitted At", formatDate(selectedRequest.createdAt)],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="border-b border-gray-100 pb-3"
                                >
                                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                                        {label}
                                    </p>
                                    <p className="wrap-break-word text-sm font-medium text-gray-800">
                                        {value}
                                    </p>
                                </div>
                            ))}

                            {selectedRequest.rejectionReason && (
                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    <p className="mb-1 text-xs font-semibold uppercase text-gray-500">
                                        Rejection Reason
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        {selectedRequest.rejectionReason}
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setSelectedRequest(null)}
                            className="mt-6 w-full rounded-lg bg-black py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Regularization;
