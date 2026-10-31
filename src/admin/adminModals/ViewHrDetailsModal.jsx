import { X } from "lucide-react";

const ViewHRDetailsModal = ({
  hr,
  onClose,
  formatDate,
}) => {
  if (!hr) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            HR Details
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
            aria-label="Close details"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-700">
            {hr.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>

          <div>
            <p className="font-semibold text-slate-900">
              {hr.name}
            </p>
            <p className="text-sm text-slate-500">
              {hr.designation}
            </p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <DetailRow label="Email" value={hr.email} />
          <DetailRow
            label="Department"
            value={hr.department}
          />
          <DetailRow
            label="Joining Date"
            value={formatDate(hr.joiningDate)}
          />
          <DetailRow label="Status" value={hr.status} />
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
    <span className="text-slate-500">{label}</span>
    <span className="text-right font-medium text-slate-800">
      {value}
    </span>
  </div>
);

export default ViewHRDetailsModal;

