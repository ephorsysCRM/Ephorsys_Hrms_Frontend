import { useMemo, useState, useEffect } from 'react';

import {
  Users,
  UserCheck,
  UserX,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
} from 'lucide-react';

import Pagination from '../../UI/Pagination';
import CreateHRModal from '../adminModals/CreateHrModal';
import ViewHRDetailsModal from '../adminModals/ViewHrDetailsModal';

const initialHrList = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul@company.com',
    department: 'Human Resources',
    designation: 'HR Executive',
    joiningDate: '2026-01-15',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Priya Das',
    email: 'priya@company.com',
    department: 'Human Resources',
    designation: 'HR Manager',
    joiningDate: '2025-11-10',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Amit Kumar',
    email: 'amit@company.com',
    department: 'Human Resources',
    designation: 'HR Executive',
    joiningDate: '2025-08-20',
    status: 'Inactive'
  },
  {
    id: 4,
    name: 'Sneha Patnaik',
    email: 'sneha@company.com',
    department: 'Human Resources',
    designation: 'Senior HR Executive',
    joiningDate: '2025-07-12',
    status: 'Active'
  },
  {
    id: 5,
    name: 'Rakesh Das',
    email: 'rakesh@company.com',
    department: 'Human Resources',
    designation: 'HR Executive',
    joiningDate: '2025-06-05',
    status: 'Active'
  },
  {
    id: 6,
    name: 'Ananya Rout',
    email: 'ananya@company.com',
    department: 'Human Resources',
    designation: 'HR Manager',
    joiningDate: '2025-04-18',
    status: 'Inactive'
  },
  {
    id: 7,
    name: 'Suman Sahu',
    email: 'suman@company.com',
    department: 'Human Resources',
    designation: 'HR Executive',
    joiningDate: '2025-03-10',
    status: 'Active'
  },
  {
    id: 8,
    name: 'Puja Mohanty',
    email: 'puja@company.com',
    department: 'Human Resources',
    designation: 'Senior HR Executive',
    joiningDate: '2025-02-15',
    status: 'Active'
  },
  {
    id: 9,
    name: 'Deepak Kumar',
    email: 'deepak@company.com',
    department: 'Human Resources',
    designation: 'HR Executive',
    joiningDate: '2025-01-20',
    status: 'Active'
  },
  {
    id: 10,
    name: 'Swati Nayak',
    email: 'swati@company.com',
    department: 'Human Resources',
    designation: 'HR Executive',
    joiningDate: '2024-12-10',
    status: 'Inactive'
  },
  {
    id: 11,
    name: 'Rajesh Behera',
    email: 'rajesh@company.com',
    department: 'Human Resources',
    designation: 'HR Manager',
    joiningDate: '2024-11-05',
    status: 'Active'
  },
  {
    id: 12,
    name: 'Meera Das',
    email: 'meera@company.com',
    department: 'Human Resources',
    designation: 'HR Executive',
    joiningDate: '2024-10-12',
    status: 'Active'
  }
];

const initialFormData = {
  name: '',
  email: '',
  department: 'Human Resources',
  designation: 'HR Executive'
};

const ManageHr = () => {
  const [hrList, setHrList] = useState(initialHrList);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedHr, setSelectedHr] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const [formData, setFormData] = useState(initialFormData);

  const totalHr = hrList.length;

  const activeHr = hrList.filter(
    (hr) => hr.status === 'Active'
  ).length;

  const inactiveHr = totalHr - activeHr;

  // Search and status filtering
  const filteredHr = useMemo(() => {
    return hrList.filter((hr) => {
      const searchTerm = search.trim().toLowerCase();

      const matchesSearch =
        hr.name.toLowerCase().includes(searchTerm) ||
        hr.email.toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === 'All' || hr.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [hrList, search, statusFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredHr.length / itemsPerPage);

  // Reset page if filtering removes the current page
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [currentPage, totalPages]);

  // Get only the records for the current page
  const paginatedHr = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return filteredHr.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [filteredHr, currentPage]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
    setActiveMenu(null);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
    setActiveMenu(null);
  };

  // Open Create HR modal
  const openCreateModal = () => {
    setSelectedHr(null);
    setFormData(initialFormData);
    setShowCreateModal(true);
    setActiveMenu(null);
  };

  // Create HR - local demo only
  const handleCreateHr = (e) => {
    e.preventDefault();

    const newHr = {
      id: Date.now(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      department: formData.department.trim(),
      designation: formData.designation,
      joiningDate: new Date().toISOString().slice(0, 10),
      status: 'Active'
    };

    setHrList((prev) => [newHr, ...prev]);
    setCurrentPage(1);
    setSearch('');
    setStatusFilter('All');
    closeModal();
  };

  // Activate / Deactivate HR
  const handleToggleStatus = (id) => {
    setHrList((prev) =>
      prev.map((hr) =>
        hr.id === id
          ? {
            ...hr,
            status: hr.status === 'Active' ? 'Inactive' : 'Active'
          }
          : hr
      )
    );

    setActiveMenu(null);
  };


  const closeModal = () => {
    setShowCreateModal(false);
    setFormData(initialFormData);
  };

  const formatDate = (date) => {
    if (!date) return '-';

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 px-1 py-2">
      {/* Page Header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">

            <h1 className="text-xl font-semibold text-slate-900">
              Manage HR
            </h1>
          </div>

          <p className="text-sm text-slate-500">
            Manage HR staff, employee details and account status.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={18} />
          Create HR
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          title="Total HR"
          value={totalHr}
          icon={Users}
          iconClass="bg-blue-50 text-blue-700"
        />

        <SummaryCard
          title="Active HR"
          value={activeHr}
          icon={UserCheck}
          iconClass="bg-emerald-50 text-emerald-700"
        />

        <SummaryCard
          title="Inactive HR"
          value={inactiveHr}
          icon={UserX}
          iconClass="bg-rose-50 text-rose-700"
        />
      </div>

      {/* HR Directory */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Search and Filter */}
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              HR Directory
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredHr.length} HR record
              {filteredHr.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search name or email..."
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-slate-400 sm:w-64"
              />
            </div>

            <div className="relative">
              <Filter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <select
                value={statusFilter}
                onChange={(e) =>
                  handleStatusFilterChange(e.target.value)
                }
                className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm outline-none focus:border-slate-400 sm:w-36"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* HR Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  HR Details
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Department
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Designation
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Joining Date
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedHr.map((hr) => (
                <tr
                  key={hr.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                        {hr.name
                          .split(' ')
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {hr.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {hr.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {hr.department}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {hr.designation}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {formatDate(hr.joiningDate)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${hr.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                        }`}
                    >
                      <span
                        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${hr.status === 'Active'
                            ? 'bg-emerald-500'
                            : 'bg-slate-400'
                          }`}
                      />

                      {hr.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="relative inline-block">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenu(
                            activeMenu === hr.id ? null : hr.id
                          )
                        }
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        aria-label={`Actions for ${hr.name}`}
                      >
                        <MoreVertical size={19} />
                      </button>

                      {activeMenu === hr.id && (
                        <div className="absolute right-0 z-20 mt-1 w-44 rounded-lg border border-slate-200 bg-white py-1 text-left shadow-lg">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedHr(hr);
                              setActiveMenu(null);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <Eye size={16} />
                            View Details
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(hr.id)}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            {hr.status === 'Active' ? (
                              <UserX size={16} />
                            ) : (
                              <UserCheck size={16} />
                            )}

                            {hr.status === 'Active'
                              ? 'Deactivate'
                              : 'Activate'}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedHr.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <Users
                      size={34}
                      className="mx-auto mb-3 text-slate-300"
                    />

                    <p className="font-medium text-slate-700">
                      No HR records found
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your search or status filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <CreateHRModal
        isOpen={showCreateModal}
        onClose={closeModal}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleCreateHr}
      />

      <ViewHRDetailsModal
        hr={selectedHr}
        onClose={() => setSelectedHr(null)}
        formatDate={formatDate}
      />
    </div>
  );
};

const SummaryCard = ({ title, value, icon: Icon, iconClass }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="mt-2 text-3xl font-bold text-slate-900">
          {value}
        </h3>
      </div>

      <div className={`rounded-xl p-3 ${iconClass}`}>
        <Icon size={23} />
      </div>
    </div>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
    <span className="text-slate-500">{label}</span>
    <span className="text-right font-medium text-slate-800">
      {value}
    </span>
  </div>
);

export default ManageHr;