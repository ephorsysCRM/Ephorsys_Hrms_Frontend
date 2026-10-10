import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Megaphone,
  Send,
  FileText,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2
} from "lucide-react";
import CreateAnnounceModal from "../hrModals/CreateAnnounceModal";
import ViewAnnounceModal from "../hrModals/ViewAnnounceModal";
import EditAnnounceModal from "../hrModals/EditAnnounceModal";


const initialAnnouncements = [
  {
    id: 1,
    title: "Annual Holiday Notice",
    category: "Holiday",
    description:
      "Please review the upcoming company holiday schedule and plan your work accordingly.",
    date: "2026-12-20",
    expiryDate: "2026-12-31",
    priority: "Medium",
    status: "Published",
    audience: {
      type: "all",
      departments: [],
      employeeIds: [],
    },
    attachment: "",
  },
  {
    id: 2,
    title: "Developer Team Meeting",
    category: "Meeting",
    description:
      "The developer team will meet to discuss project progress and upcoming deliverables.",
    date: "2026-10-15",
    expiryDate: "",
    priority: "High",
    status: "Draft",
    audience: {
      type: "department",
      departments: ["Developer"],
      employeeIds: [],
    },
    attachment: "",
  },
];

const categories = [
  "General Notice",
  "Holiday",
  "Meeting",
  "Policy Update",
];

const statusClasses = {
  Published: "bg-green-50 text-green-700",
  Draft: "bg-gray-100 text-gray-600",
};

const priorityClasses = {
  High: "bg-red-50 text-red-700",
  Medium: "bg-amber-50 text-amber-700",
  Low: "bg-gray-100 text-gray-600",
};

function getAudienceText(audience = { type: "all" }) {
  if (audience.type === "all") return "All Employees";

  if (audience.type === "department") {
    return audience.departments?.join(", ") || "No department selected";
  }

  return `${audience.employeeIds?.length || 0} employee(s)`;
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState(
    initialAnnouncements
  );

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");

  const [createOpen, setCreateOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const stats = useMemo(
    () => ({
      total: announcements.length,
      published: announcements.filter(
        (item) => item.status === "Published"
      ).length,
      drafts: announcements.filter((item) => item.status === "Draft")
        .length,
    }),
    [announcements]
  );

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      const matchesSearch = [
        item.title,
        item.category,
        item.description,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "All Categories" ||
        item.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All Status" || item.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All Priorities" ||
        item.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [announcements, search, categoryFilter, statusFilter, priorityFilter]);

  const addAnnouncement = (data) => {
    setAnnouncements((prev) => [
      { ...data, id: Date.now() },
      ...prev,
    ]);
  };

  const updateAnnouncement = (data) => {
    setAnnouncements((prev) =>
      prev.map((item) =>
        item.id === editingAnnouncement.id
          ? { ...item, ...data, id: item.id }
          : item
      )
    );
    setEditingAnnouncement(null);
  };

  const toggleStatus = (item) => {
    setAnnouncements((prev) =>
      prev.map((announcement) =>
        announcement.id === item.id
          ? {
              ...announcement,
              status:
                announcement.status === "Published"
                  ? "Draft"
                  : "Published",
            }
          : announcement
      )
    );
    setMenuId(null);
  };

  const deleteAnnouncement = () => {
    setAnnouncements((prev) =>
      prev.filter((item) => item.id !== deleteTarget.id)
    );
    setDeleteTarget(null);
    setMenuId(null);
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-gray-500";

  return (
    <div className="min-h-screen bg-gray-50 px-1 py-2">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-xl font-semibold sm:text-2xl">
              Announcements
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Create and manage company announcements.
            </p>
          </div>

          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            <Plus size={18} />
            Create Announcement
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={<Megaphone size={20} />}
            title="Total Announcements"
            value={stats.total}
          />
          <StatCard
            icon={<Send size={20} />}
            title="Published"
            value={stats.published}
          />
          <StatCard
            icon={<FileText size={20} />}
            title="Drafts"
            value={stats.drafts}
          />
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search announcements..."
                className={`${inputClass} pl-9`}
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={inputClass}
            >
              <option>All Categories</option>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={inputClass}
            >
              <option>All Status</option>
              <option>Published</option>
              <option>Draft</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className={inputClass}
            >
              <option>All Priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>

        {/* Announcement table */}
        <div className="overflow-visible rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <div>
              <h2 className="font-semibold text-gray-900">
                Announcement List
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {filteredAnnouncements.length} announcement(s) found
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-250 text-left">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-5 py-3 font-medium">Announcement</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Audience</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredAnnouncements.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/70"
                  >
                    <td className="px-5 py-4">
                      <p className="max-w-xs truncate text-sm font-medium text-gray-900">
                        {item.title}
                      </p>
                      <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                        {item.description}
                      </p>
                    </td>

                    <td className="px-4 py-4 flex flex-col justify-centermt-2">
                      <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        {item.category}
                      </span>
                    </td>

                    <td className="max-w-48 px-4 py-4">
                      <p className="max-w-44 truncate text-sm text-gray-600">
                        {getAudienceText(item.audience)}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                        {item.date || "—"}
                      </span>
                    </td>

                    <td className="px-4 py-4 ">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          priorityClasses[item.priority]
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          statusClasses[item.status]
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() =>
                            setMenuId(menuId === item.id ? null : item.id)
                          }
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                          aria-label="Announcement actions"
                        >
                          <MoreHorizontal size={19} />
                        </button>

                        {menuId === item.id && (
                          <div className="absolute right-0 top-5 z-20 w-37 rounded-lg border border-gray-200 bg-white py-1 text-left shadow-lg">
                            <ActionButton
                              icon={<Eye size={15} />}
                              label="View"
                              onClick={() => {
                                setSelectedAnnouncement(item);
                                setMenuId(null);
                              }}
                            />
                            <ActionButton
                              icon={<Pencil size={15} />}
                              label="Edit"
                              onClick={() => {
                                setEditingAnnouncement(item);
                                setMenuId(null);
                              }}
                            />
                            <ActionButton
                              icon={
                                item.status === "Published" ? (
                                  <FileText size={15} />
                                ) : (
                                  <Send size={15} />
                                )
                              }
                              label={
                                item.status === "Published"
                                  ? "Move to Draft"
                                  : "Publish"
                              }
                              onClick={() => toggleStatus(item)}
                            />
                            <ActionButton
                              icon={<Trash2 size={15} />}
                              label="Delete"
                              danger
                              onClick={() => {
                                setDeleteTarget(item);
                                setMenuId(null);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredAnnouncements.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-14 text-center">
                      <Megaphone
                        size={30}
                        className="mx-auto mb-3 text-gray-300"
                      />
                      <p className="text-sm font-medium text-gray-700">
                        No announcements found
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Try changing the filters or create a new announcement.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create */}
      <CreateAnnounceModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={addAnnouncement}
      />

      {/* View */}
      <ViewAnnounceModal
        announcement={selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
      />

      {/* Edit */}
      <EditAnnounceModal
        open={Boolean(editingAnnouncement)}
        announcement={editingAnnouncement}
        onClose={() => setEditingAnnouncement(null)}
        onSave={updateAnnouncement}
      />

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={20} />
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              Delete Announcement?
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete "{deleteTarget.title}"? This
              action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={deleteAnnouncement}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close action menu when clicking outside */}
      {menuId !== null && (
        <button
          aria-label="Close actions menu"
          className="fixed inset-0 z-10 cursor-default"
          onClick={() => setMenuId(null)}
        />
      )}
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <span className="rounded-lg bg-gray-100 p-2 text-gray-600">
          {icon}
        </span>
      </div>
      <p className="mt-4 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function ActionButton({ icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 ${
        danger ? "text-red-600" : "text-gray-700"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}