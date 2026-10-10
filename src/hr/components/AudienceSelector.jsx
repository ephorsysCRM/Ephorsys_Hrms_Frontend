import { useState } from "react";
import { Search, Users } from "lucide-react";

const departments = [
  "Developer",
  "Design",
  "Sales",
  "Marketing",
  "HR",
  "Finance",
];

const employees = [
  { id: "EMP-102", name: "Rahul Das", department: "Developer" },
  { id: "EMP-118", name: "Priya Sahu", department: "Design" },
  { id: "EMP-125", name: "Amit Nayak", department: "Developer" },
  { id: "EMP-130", name: "Sneha Das", department: "Sales" },
  { id: "EMP-140", name: "Rohan Patnaik", department: "Marketing" },
];

const optionClass = (active) =>
  `flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition ${
    active
      ? "border-gray-900 bg-gray-50"
      : "border-gray-200 hover:border-gray-400"
  }`;

export default function AudienceSelector({
  value,
  onChange,
}) {
  const [search, setSearch] = useState("");
  const audience = value || {
    type: "all",
    departments: [],
    employeeIds: [],
  };

  const update = (changes) =>
    onChange({ ...audience, ...changes });

  const toggleDepartment = (department) => {
    const selected = audience.departments.includes(department);

    update({
      departments: selected
        ? audience.departments.filter((d) => d !== department)
        : [...audience.departments, department],
    });
  };

  const toggleEmployee = (id) => {
    const selected = audience.employeeIds.includes(id);

    update({
      employeeIds: selected
        ? audience.employeeIds.filter((item) => item !== id)
        : [...audience.employeeIds, id],
    });
  };

  const filteredEmployees = employees.filter((employee) =>
    `${employee.name} ${employee.id} ${employee.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">
          Announcement Audience
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          Choose who can see this announcement.
        </p>
      </div>

      <label className={optionClass(audience.type === "all")}>
        <input
          type="radio"
          name="audience"
          checked={audience.type === "all"}
          onChange={() =>
            update({
              type: "all",
              departments: [],
              employeeIds: [],
            })
          }
          className="mt-1 accent-black"
        />
        <div>
          <p className="text-sm font-medium text-gray-900">
            All Employees
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Company holidays and general notices.
          </p>
        </div>
      </label>

      <label className={optionClass(audience.type === "department")}>
        <input
          type="radio"
          name="audience"
          checked={audience.type === "department"}
          onChange={() => update({ type: "department" })}
          className="mt-1 accent-black"
        />
        <div>
          <p className="text-sm font-medium text-gray-900">
            Specific Department(s)
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Select one or more departments.
          </p>
        </div>
      </label>

      {audience.type === "department" && (
        <div className="rounded-lg border border-gray-200 p-3">
          <p className="mb-3 text-sm font-medium text-gray-700">
            Select Departments
          </p>

          <div className="grid grid-cols-2 gap-3">
            {departments.map((department) => (
              <label
                key={department}
                className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
              >
                <input
                  type="checkbox"
                  checked={audience.departments.includes(department)}
                  onChange={() => toggleDepartment(department)}
                  className="accent-black"
                />
                {department}
              </label>
            ))}
          </div>

          <p className="mt-3 text-xs text-gray-500">
            {audience.departments.length} department(s) selected
          </p>
        </div>
      )}

      <label className={optionClass(audience.type === "individual")}>
        <input
          type="radio"
          name="audience"
          checked={audience.type === "individual"}
          onChange={() => update({ type: "individual" })}
          className="mt-1 accent-black"
        />
        <div>
          <p className="text-sm font-medium text-gray-900">
            Specific Employees
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Search and select individual employees.
          </p>
        </div>
      </label>

      {audience.type === "individual" && (
        <div className="rounded-lg border border-gray-200 p-3">
          <div className="relative mb-3">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, ID or department..."
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <div className="max-h-48 space-y-3 overflow-y-auto">
            {filteredEmployees.map((employee) => (
              <label
                key={employee.id}
                className="flex cursor-pointer items-start gap-3"
              >
                <input
                  type="checkbox"
                  checked={audience.employeeIds.includes(employee.id)}
                  onChange={() => toggleEmployee(employee.id)}
                  className="mt-1 accent-black"
                />

                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {employee.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {employee.id} · {employee.department}
                  </p>
                </div>
              </label>
            ))}

            {filteredEmployees.length === 0 && (
              <p className="py-3 text-center text-sm text-gray-500">
                No employees found.
              </p>
            )}
          </div>

          <p className="mt-3 text-xs text-gray-500">
            {audience.employeeIds.length} employee(s) selected
          </p>
        </div>
      )}

      <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-3">
        <Users size={16} className="mt-0.5 text-gray-500" />
        <p className="text-xs text-gray-600">
          {audience.type === "all"
            ? "This announcement is intended for all employees."
            : audience.type === "department"
              ? audience.departments.length
                ? `Selected: ${audience.departments.join(", ")}`
                : "Please select at least one department."
              : audience.employeeIds.length
                ? `${audience.employeeIds.length} employee(s) selected.`
                : "Please select at least one employee."}
        </p>
      </div>
    </div>
  );
}