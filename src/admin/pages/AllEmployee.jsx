import {
  Search,
  Plus,
  Eye,
} from "lucide-react";
import { useState } from "react";
import CreateUserModal from "../features/employees/CreateUserModal";
const employeesData = [
  {
    id: "EMP001",
    name: "Ananya Pradhan",
    email: "ananya@gmail.com",
    role: "Employee",
    department: "Development",
    manager: "Rahul Sharma",
    status: "Active",
  },
  {
    id: "EMP002",
    name: "Rahul Sharma",
    email: "rahul@company.com",
    role: "Manager",
    department: "Development",
    manager: "Admin",
    status: "Active",
  },
  {
    id: "EMP003",
    name: "Priya Das",
    email: "priya@company.com",
    role: "HR",
    department: "Human Resources",
    manager: "Admin",
    status: "Active",
  },
  {
    id: "EMP004",
    name: "Sourav Mohanty",
    email: "sourav@company.com",
    role: "Employee",
    department: "Design",
    manager: "Rahul Sharma",
    status: "Active",
  },
  {
    id: "EMP005",
    name: "Sneha Patnaik",
    email: "sneha@company.com",
    role: "Employee",
    department: "Marketing",
    manager: "Rahul Sharma",
    status: "Inactive",
  },
  {
    id: "EMP006",
    name: "Rakesh Kumar",
    email: "rakesh@company.com",
    role: "Manager",
    department: "Marketing",
    manager: "Admin",
    status: "Active",
  },
  {
    id: "EMP007",
    name: "Neha Singh",
    email: "neha@company.com",
    role: "Employee",
    department: "Development",
    manager: "Rakesh Kumar",
    status: "Active",
  },
  {
    id: "EMP008",
    name: "Arjun Das",
    email: "arjun@company.com",
    role: "Employee",
    department: "Development",
    manager: "Rahul Sharma",
    status: "Active",
  },
];

const AllEmployee = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const filteredEmployees = employeesData.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.email.toLowerCase().includes(search.toLowerCase()) ||
      employee.role.toLowerCase().includes(search.toLowerCase()) ||
      employee.department.toLowerCase().includes(search.toLowerCase()) ||
      employee.manager.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      employee.role === filter ||
      (filter === "Manager & HR" &&
        (employee.role === "Manager" || employee.role === "HR"));

    return matchesSearch && matchesFilter;
  });


  const [showModal, setShowModal] = useState(false);
   const [employees, setEmployees] = useState(employeesData);
  return (
    <div className="min-h-screen text-black">

      {/* HEADER */}
      <div className="flex flex-col gap-4 py-5  sm:py-3 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-xl font-semibold sm:text-2xl">
            All Employees
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your employees and organization members
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
           onClick={() => setShowModal(true)}
        >
          <Plus size={17} />
          Add Employee
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


      {/* FILTER TYPE */}
      <div className="mt-5">

        <div
          className="
            flex
            w-full
            overflow-x-auto
            rounded-lg
            border
            border-gray-200
            p-1
            gap-2
            sm:w-fit
          "
        >

          <button
            className={`shrink-0 rounded-md px-4 py-1 sm:py-2 text-sm ${filter === "All"
              ? "bg-black text-white"
              : "text-gray-500 hover:bg-gray-100"
              }`}
            onClick={() => setFilter("All")}
          >
            All
          </button>

          <button
            className={`shrink-0 rounded-md px-4 py-1 sm:py-2 text-sm ${filter === "Employee"
              ? "bg-black text-white"
              : "text-gray-500 hover:bg-gray-100"
              }`}
            onClick={() => setFilter("Employee")}
          >
            Employee
          </button>

          <button
            className={`shrink-0 rounded-md px-4 py-1 sm:py-2 text-sm ${filter === "Manager & HR"
              ? "bg-black text-white"
              : "text-gray-500 hover:bg-gray-100"
              }`}
            onClick={() => setFilter("Manager & HR")}
          >
            Manager & HR
          </button>

        </div>

      </div>

      {/* Employee count */}
      <p className="mt-3 text-sm text-gray-500">
        {filteredEmployees.length}{" "}
        {filteredEmployees.length === 1 ? "Employee" : "Employees"}
      </p>
      {/* EMPLOYEE TABLE */}
      <div className="mt-5  pb-6">

        {/* Horizontal scroll only when required */}
        <div className="w-full overflow-x-auto rounded-xl border border-gray-200">

          <div className="min-w-[850px] bg-white">

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
              <div>Name & Role</div>
              <div>Email</div>
              <div>Department</div>
              <div>Manager</div>
              <div>Status</div>
            </div>


            {/* EMPLOYEES */}
            {filteredEmployees.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                No employees found.
              </div>
            ) : (
              filteredEmployees.map((employee) => (

                <div
                  key={employee.id}
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

                  {/* Name + Role */}
                  <div className="min-w-0">

                    <h3 className="truncate font-semibold">
                      {employee.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {employee.role}
                    </p>

                  </div>


                  {/* Email */}
                  <div className="min-w-0">

                    <p className="truncate text-sm">
                      {employee.email}
                    </p>

                  </div>


                  {/* Department */}
                  <div className="min-w-0">

                    <p className="truncate text-sm">
                      {employee.department}
                    </p>

                  </div>


                  {/* Manager */}
                  <div className="min-w-0">

                    <p className="truncate text-sm">
                      {employee.manager}
                    </p>

                  </div>


                  {/* Status */}
                  <div className=" flex gap-4">

                    <span
                      className={`
            inline-flex
            rounded-full
            px-2.5
            py-1
            text-xs
            font-medium
            text-center w-15 h-8
            ${employee.status === "Active"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                        }
          `}
                    >
                      {employee.status}
                    </span>
                    <Eye className="cursor-pointer text-green-900 transition hover:text-black" size={19}
                    onClick={() => console.log(employee)}
                    />
                  </div>

                </div>

              ))
            )}
          </div>

        </div>

      </div>
       {showModal && (
  <CreateUserModal
    role="Employee"
    onClose={() => setShowModal(false)}
    onCreate={(data) => {
      setEmployees([...employees, data]);
      setShowModal(false);
    }}
  />
)}
    </div>
    
  );
};

export default AllEmployee;