import { Eye, MoreHorizontal, Pencil, Plus, Search } from "lucide-react";
import { useState } from "react";

const Department = () => {


    const departmentsData = [
        {
            id: "DEP001",
            name: "Development",
            manager: "Rahul Sharma",
            employees: 4,
            status: "Active",
        },
        {
            id: "DEP002",
            name: "Digital Marketing",
            manager: "Priya Das",
            employees: 1,
            status: "Active",
        },
        {
            id: "DEP003",
            name: "BDE",
            manager: "Sourav Mohanty",
            employees: 1,
            status: "Active",
        },
        {
            id: "DEP004",
            name: "Marketing",
            manager: "Rakesh Kumar",
            employees: 2,
            status: "Active",
        },
        {
            id: "DEP005",
            name: "Finance",
            manager: "Sourav Mohanty",
            employees: 0,
            status: "Active",
        },
        {
            id: "DEP006",
            name: "Sales",
            manager: "Sourav Mohanty",
            employees: 0,
            status: "Active",
        },
        {
            id: "DEP007",
            name: "IT Support",
            manager: "Sourav Mohanty",
            employees: 0,
            status: "Inactive",
        },

    ];
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

    const totalEmployees = departmentsData.reduce(
        (total, department) => total + department.employees,
        0
    );

    const [openMenu, setOpenMenu] = useState(null);

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-1 text-black sm:px-6 lg:px-2">

            {/* HEADER */}
            <div className="flex flex-col gap-4 py-5  sm:py-3 md:flex-row md:items-center md:justify-between">

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
                >
                    <Plus size={17} />
                    Add Department
                </button>

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
            <div className="mt-5 flex flex-row gap-1 overflow-x-auto">

                <div className="shrink-0 rounded-lg border border-gray-200 bg-black px-3 py-2 text-white">
                    <p className="text-xs text-gray-400">
                        Total Departments
                    </p>

                    <p className="mt-1 text-lg font-semibold text-center">
                        {totalDepartments}
                    </p>
                </div>

                <div className="shrink-0 rounded-lg border border-gray-200 bg-black px-3 py-2 text-white">
                    <p className="text-xs text-gray-400">
                        Active Departments
                    </p>

                    <p className="mt-1 text-lg font-semibold text-center">
                        {activeDepartments}
                    </p>
                </div>

                <div className="shrink-0 rounded-lg border border-gray-200 bg-black px-3 py-2 text-white">
                    <p className="text-xs text-gray-400">
                        Total Employees
                    </p>

                    <p className="mt-1 text-lg font-semibold text-center">
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
                                        {department.employees}
                                    </p>
                                </div>

                                {/* Status */}
                                <div>
                                    <span
                                        className={`
                inline-flex
                rounded-full
                px-2.5
                py-1
                text-xs
                font-medium
                text-center
                ${department.status === "Active"
                                                ? "bg-green-50 text-green-700"
                                                : "bg-gray-100 text-gray-500"
                                            }
              `}
                                    >
                                        {department.status}
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
                                                //   onClick={() => navigate(`/employees/${employee.id}`, {
                                                //     state: { employee },
                                                //   })}
                                                className="flex w-full items-center gap-2  rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100">
                                                <Eye size={16} />
                                                View
                                            </button>

                                            <button className="flex w-full items-center gap-2  rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100">
                                                <Pencil size={16} />
                                                Edit
                                            </button>
                                        </div>
                                    )}
                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </div>
        </div>
    );
};

export default Department;