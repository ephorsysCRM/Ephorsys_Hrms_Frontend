import { useEffect, useState } from "react";
import { X, CalendarDays, Upload } from "lucide-react";
import AudienceSelector from "../components/AudienceSelector";


const emptyForm = {
  title: "",
  category: "General Notice",
  description: "",
  date: "",
  expiryDate: "",
  priority: "Medium",
  audience: {
    type: "all",
    departments: [],
    employeeIds: [],
  },
};

export default function CreateAnnounceModal({
  open,
  onClose,
  onSave,
  initialData = null,
}) {
  const [form, setForm] = useState(emptyForm);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? {
              ...emptyForm,
              ...initialData,
              audience: initialData.audience || emptyForm.audience,
            }
          : emptyForm
      );
      setFileName(initialData?.attachment || "");
    }
  }, [open, initialData]);

  if (!open) return null;

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (status) => {
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.date
    ) {
      alert("Please fill in the title, description and date.");
      return;
    }

    if (
      form.audience.type === "department" &&
      form.audience.departments.length === 0
    ) {
      alert("Please select at least one department.");
      return;
    }

    if (
      form.audience.type === "individual" &&
      form.audience.employeeIds.length === 0
    ) {
      alert("Please select at least one employee.");
      return;
    }

    onSave({
      ...form,
      attachment: fileName,
      status,
    });

    onClose();
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-gray-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {initialData ? "Edit Announcement" : "Create Announcement"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Add announcement details and choose the audience.
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

        <div className="space-y-5 overflow-y-auto px-7 py-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Announcement Title *
            </label>
            <input
              className={inputClass}
              placeholder="Enter announcement title"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                className={inputClass}
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
              >
                <option>General Notice</option>
                <option>Holiday</option>
                <option>Meeting</option>
                <option>Policy Update</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                className={inputClass}
                value={form.priority}
                onChange={(e) => updateField("priority", e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Announcement Date *
              </label>
              <div className="relative">
                <CalendarDays
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="date"
                  className={`${inputClass} pl-9`}
                  value={form.date}
                  onChange={(e) => updateField("date", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="date"
                min={form.date || undefined}
                className={inputClass}
                value={form.expiryDate}
                onChange={(e) =>
                  updateField("expiryDate", e.target.value)
                }
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              rows={4}
              className={`${inputClass} resize-y`}
              placeholder="Write announcement details..."
              value={form.description}
              onChange={(e) =>
                updateField("description", e.target.value)
              }
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Attachment (Optional)
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 p-4 hover:bg-gray-50">
              <Upload size={20} className="text-gray-500" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-700">
                  Choose a file
                </p>
                <p className="truncate text-xs text-gray-500">
                  {fileName || "PDF, JPG or PNG"}
                </p>
              </div>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) =>
                  setFileName(e.target.files?.[0]?.name || "")
                }
              />
            </label>
            <p className="mt-1 text-xs text-gray-500">
              Frontend demo: file name is recorded, but the file is not uploaded or stored.
            </p>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <AudienceSelector
              value={form.audience}
              onChange={(audience) => updateField("audience", audience)}
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-gray-200 bg-white px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSubmit("Draft")}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSubmit("Published")}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            {initialData ? "Save Changes" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}