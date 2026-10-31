import {
  CalendarDays,
  Clock3,
  MessageSquareText,
  Check,
  X,
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

const AttendanceRequestModal = ({
  request,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!request) return null;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-sm text-white">
          {request.name
            .split(" ")
            .map((part) => part[0])
            .join("")}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900">{request.name}</p>
          <p className="mt-1 text-xs text-gray-500">
            {request.empId} · {request.department}
          </p>
        </div>

        <span
          className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
            statusStyles[request.status] || statusStyles.Pending
          }`}
        >
          {request.status}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Detail
          icon={<CalendarDays size={16} />}
          label="Attendance Date"
          value={formatDate(request.date)}
        />
        <Detail
          icon={<CalendarDays size={16} />}
          label="Submitted On"
          value={formatDate(request.submittedOn)}
        />
        <Detail
          icon={<Clock3 size={16} />}
          label="Requested Check In"
          value={request.requestedCheckIn || "—"}
        />
        <Detail
          icon={<Clock3 size={16} />}
          label="Requested Check Out"
          value={request.requestedCheckOut || "—"}
        />
      </div>

      <div className="rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <MessageSquareText size={15} />
          Reason for Request
        </div>
        <p className="mt-2 text-sm leading-6 text-gray-700">
          {request.reason || "No reason provided."}
        </p>
      </div>

      {request.status === "Pending" && (
        <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onReject}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition hover:bg-gray-50"
          >
            <X size={16} />
            Reject
          </button>
          <button
            type="button"
            onClick={onApprove}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm text-white transition hover:bg-gray-800"
          >
            <Check size={16} />
            Approve Request
          </button>
        </div>
      )}
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
      <p className="mt-2 text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}

export default AttendanceRequestModal;
