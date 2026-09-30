import { Eye, MoreHorizontal, Pencil, Plus, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { departmentsData } from "../data/departmentsData";
import { employeesData } from "../data/employeesData";
import Modal from "../../UI/Modal";
import AddDepartment from "../adminModals/AddDepartment";
import Pagination from "../../UI/Pagination";
import DepartmentEditModal from "../adminModals/DepartmentEditModal";

const Department = () => {

    const [search, setSearch] = useState("");

    const filteredDepartments = departmentsData.filter((department) => {
        const searchText = search.toLowerCase();

        return (
            department.id.toLowerCase().includes(searchText) ||
            department.name.toLowerCase().includes(searchText) ||
            department.manager.toLowerCase().includes(searchText) ||
            department.employees.toString().includes(searchText) ||
            department.status.toLowerCase().includes(searchText)
        );
    });

    const totalDepartments = departmentsData.length;

    const activeDepartments = departmentsData.filter(
        (department) => department.status === "Active"
    ).length;

    const totalEmployees = employeesData.length;

    const [openMenu, setOpenMenu] = useState(null);

    const navigate = useNavigate();

    const getDepartmentEmployeeCount = (departmentName) => {
        return employeesData.filter(
            employee => employee.department === departmentName
        ).length;
    };

    const [departmentStatus, setDepartmentStatus] = useState(
        departmentsData.reduce((status, department) => {
            status[department.id] = department.status;
            return status;
        }, {})
    );

    const handleStatusToggle = (departmentId) => {
        setDepartmentStatus((prev) => ({
            ...prev,
            [departmentId]:
                prev[departmentId] === "Active" ? "Inactive" : "Active",
        }));
    };
    const [addDepartmentOpen, setAddDepartmentOpen] = useState(false);
    const [addDepartmentEdit, setAddDepartmentEdit] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    return (
        <div className="min-h-screen bg-gray-50 px-1 py-0 text-black sm:px-6 lg:px-1">

            {/* HEADER */}
            <div className="flex flex-col gap-4 py-3  sm:py-3 md:flex-row md:items-center md:justify-between">

                <div>
                    <h1 className="text-xl font-semibold sm:text-2xl">
                        All Department
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your department and organization members
                    </p>
                </div>

                <button
                    className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-black
            px-4
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:bg-gray-800
            sm:w-auto
          "
                    onClick={() => setAddDepartmentOpen(true)}
                >
                    <Plus size={17} />
                    Add Department
                </button>
                <Modal
                    isOpen={addDepartmentOpen}
                    onClose={() => setAddDepartmentOpen(false)}
                    title="Add Department"
                    size="md"
                >
                    <AddDepartment
                        onClose={() => setAddDepartmentOpen(false)}
                    />
                </Modal>
            </div>


            {/* SEARCH */}
            <div className="">

                <div className="rounded-xl border border-gray-200 p-1">

                    <div className="relative">

                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={search}
                            placeholder="Search employees..."
                            onChange={(e) => setSearch(e.target.value)}
                            className="
                w-full
                rounded-lg
                bg-gray-100
                py-2 sm:py-3
                pl-10
                pr-4
                text-sm
                outline-none
                transition
                focus:ring-2
                focus:ring-black/10
              "
                        />

                    </div>

                </div>

            </div>

            {/* DEPARTMENT STATS */}
            <div className="mt-5 grid grid-cols-2 gap-1 sm:flex sm:flex-row sm:overflow-x-auto">

                <div className="shrink-0 rounded-lg border border-gray-200 bg-black px-3 py-2 text-white text-center">
                    <p className="text-xs text-gray-300">
                        Total Departments
                    </p>

                    <p className="mt-1 text-lg font-semibold text-center">
                        {totalDepartments}
                    </p>
                </div>

                <div className="shrink-0 rounded-lg border border-gray-200 bg-black px-3 py-2 text-white text-center">
                    <p className="text-xs text-gray-300">
                        Active Departments
                    </p>

                    <p className="mt-1 text-lg font-semibold text-center">
                        {activeDepartments}
                    </p>
                </div>

                <div className="col-span-2 shrink-0 rounded-lg border border-gray-200 bg-black px-3 py-2 text-white sm:col-span-1 text-center">
                    <p className="text-xs text-gray-300 ">
                        Total Employees
                    </p>

                    <p className="mt-1 text-lg font-semibold ">
                        {totalEmployees}
                    </p>
                </div>

            </div>

            {/* DEPARTMENT TABLE */}
            <div className="mt-5 pb-6">

                {/* Horizontal scroll only when required */}
                <div className="w-full overflow-x-auto rounded-xl border border-gray-200">

                    <div className="min-w-200 bg-white">

                        {/* TABLE HEADING */}
                        <div
                            className="
          grid
          grid-cols-5
          gap-4
          border-b
          border-gray-200
          bg-gray-50
          p-4
          text-sm
          font-medium
          text-gray-500
        "
                        >
                            <div>Department</div>
                            <div>Head / Manager</div>
                            <div>Employees</div>
                            <div>Status</div>
                            <div>Action</div>
                        </div>

                        {/* DEPARTMENTS */}
                        {filteredDepartments.map((department) => (

                            <div
                                key={department.id}
                                className="
            grid
            grid-cols-5
            gap-4
            border-b
            border-gray-200
            p-4
            last:border-b-0
          "
                            >

                                {/* Department */}
                                <div className="min-w-0">
                                    <p className="truncate font-semibold">
                                        {department.name}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {department.id}
                                    </p>
                                </div>

                                {/* Manager */}
                                <div className="min-w-0">
                                    <p className="truncate text-sm">
                                        {department.manager}
                                    </p>
                                </div>

                                {/* Employees */}
                                <div>
                                    <p className="text-sm">
                                        {getDepartmentEmployeeCount(department.name)}
                                    </p>
                                </div>

                                {/* Status */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleStatusToggle(department.id)}
                                        className={`relative h-6 w-11 rounded-full transition ${departmentStatus[department.id] === "Active"
                                            ? "bg-black"
                                            : "bg-gray-300"
                                            }`}
                                    >
                                        <span
                                            className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${departmentStatus[department.id] === "Active"
                                                ? "left-6"
                                                : "left-1"
                                                }`}
                                        />
                                    </button>

                                    <span className="text-sm">
                                        {departmentStatus[department.id]}
                                    </span>
                                </div>
                                {/* Action */}
                                <div className="relative">
                                    <button
                                        className="
                rounded-md
                p-2
                text-gray-500
                transition
                hover:bg-gray-100
                hover:text-black
              "
                                        onClick={() =>
                                            setOpenMenu(
                                                openMenu === department.id ? null : department.id
                                            )
                                        }
                                    >
                                        <MoreHorizontal size={20} />
                                    </button>
                                    {openMenu === department.id && (
                                        <div className="absolute right-10 top-4 z-20 w-28 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
                                            <button
                                                onClick={() => navigate(`/departments/${department.id}`)}

                                                className="flex w-full items-center gap-2  rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100">
                                                <Eye size={16} />
                                                View
                                            </button>

                                            <button className="flex w-full items-center gap-2  rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100"
                                                onClick={() => {
                                                    setSelectedDepartment(department);
                                                    setAddDepartmentEdit(true)
                                                }}
                                            >
                                                <Pencil size={16} />
                                                Edit
                                            </button>
                                        </div>
                                    )}


                                </div>

                            </div>

                        ))}
                        <Modal
                            isOpen={addDepartmentEdit}
                            onClose={() => setAddDepartmentEdit(false)}
                            title="Edit Department"
                            size="md"
                        >
                            <DepartmentEditModal
                                department={selectedDepartment}
                                onClose={() => setAddDepartmentEdit(false)}
                            />
                        </Modal>
                    </div>

                </div>

            </div>
            {/* Pagination */}
            <Pagination currentPage={1} totalPages={10} onPageChange={5} />

        </div>
    );
};

export default Department;