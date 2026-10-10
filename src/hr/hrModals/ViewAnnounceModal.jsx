import { X, CalendarDays, Users, Paperclip } from "lucide-react";

export default function ViewAnnounceModal({
  announcement,
  onClose,
}) {
  if (!announcement) return null;

  const audience = announcement.audience || { type: "all" };

  const audienceText =
    audience.type === "all"
      ? "All Employees"
      : audience.type === "department"
        ? audience.departments.join(", ") || "No departments selected"
        : `${audience.employeeIds.length} selected employee(s)`;

  const priorityStyle = {
    High: "bg-red-50 text-red-700",
    Medium: "bg-amber-50 text-amber-700",
    Low: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-gray-200 p-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Announcement Details
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              View the complete announcement information.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                {announcement.category}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  announcement.status === "Published"
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {announcement.status}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  priorityStyle[announcement.priority] || priorityStyle.Low
                }`}
              >
                {announcement.priority} Priority
              </span>
            </div>

            <h3 className="text-xl font-semibold text-gray-900">
              {announcement.title}
            </h3>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600">
              {announcement.description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-gray-500">Announcement Date</p>
              <p className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-800">
                <CalendarDays size={15} />
                {announcement.date || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Expiry Date</p>
              <p className="mt-1 text-sm font-medium text-gray-800">
                {announcement.expiryDate || "No expiry date"}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs text-gray-500">Audience</p>
              <p className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-800">
                <Users size={15} />
                {audienceText}
              </p>
            </div>

            {announcement.attachment && (
              <div className="sm:col-span-2">
                <p className="text-xs text-gray-500">Attachment</p>
                <p className="mt-1 flex items-center gap-2 text-sm text-gray-700">
                  <Paperclip size={15} />
                  {announcement.attachment}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-200 px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}