import { X } from "lucide-react";

const CreateHRModal = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
      <div className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Create HR
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter the details to add a new HR.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              placeholder="Enter full name"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Official Email
            </label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              placeholder="name@company.com"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Department
            </label>
            <input
              required
              value={formData.department}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  department: e.target.value,
                })
              }
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Designation
            </label>
            <select
              value={formData.designation}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  designation: e.target.value,
                })
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
            >
              <option value="HR Executive">HR Executive</option>
              <option value="Senior HR Executive">
                Senior HR Executive
              </option>
              <option value="HR Manager">HR Manager</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Create HR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHRModal;

