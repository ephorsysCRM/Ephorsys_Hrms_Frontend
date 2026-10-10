import {
  CalendarDays,
  Clock3,
  MessageSquareText,
  UserRound,
} from "lucide-react";

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

const LeaveModal = ({ leave, onClose }) => {
  if (!leave) return null;

  return (
    <div className="space-y-5">
      {/* Employee Details */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-sm text-white">
          {leave.name
            ?.split(" ")
            .map((part) => part[0])
            .join("") || "NA"}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900">
            {leave.name || "—"}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {leave.empId || leave.id || "—"} · {leave.department || "—"}
          </p>
        </div>

        <span
          className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
            statusStyles[leave.status] || statusStyles.Pending
          }`}
        >
          {leave.status || "Pending"}
        </span>
      </div>

      {/* Leave Details */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Detail
          icon={<UserRound size={16} />}
          label="Leave Type"
          value={leave.leaveType || leave.type || "—"}
        />

        <Detail
          icon={<CalendarDays size={16} />}
          label="Applied On"
          value={formatDate(leave.appliedOn || leave.submittedOn)}
        />

        <Detail
          icon={<CalendarDays size={16} />}
          label="Start Date"
          value={formatDate(leave.startDate || leave.fromDate)}
        />

        <Detail
          icon={<CalendarDays size={16} />}
          label="End Date"
          value={formatDate(leave.endDate || leave.toDate)}
        />

        <Detail
          icon={<Clock3 size={16} />}
          label="Total Leave Days"
          value={
            leave.totalDays != null
              ? `${leave.totalDays} day${Number(leave.totalDays) === 1 ? "" : "s"}`
              : "—"
          }
        />
      </div>

      {/* Leave Reason */}
      <div className="rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <MessageSquareText size={15} />
          Reason for Leave
        </div>

        <p className="mt-2 text-sm leading-6 text-gray-700">
          {leave.reason || "No reason provided."}
        </p>
      </div>

      {/* Close Button */}
      <div className="flex justify-end border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
  );
};

function Detail({ icon, label, value }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>{icon}</span>
        {label}
      </div>

      <p className="mt-2 text-sm font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}

export default LeaveModal;

