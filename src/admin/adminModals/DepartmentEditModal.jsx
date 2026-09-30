import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useState } from "react";
import { employeesData } from "../data/employeesData";

const DepartmentEditModal = ({ department, onClose }) => {
    const [showEmployees, setShowEmployees] = useState(false);

    const [name, setName] = useState(department.name);
    const [manager, setManager] = useState(department.manager);
    const [description, setDescription] = useState(
        department.description || ""
    );
    const [status, setStatus] = useState(department.status);

    const [departmentEmployees, setDepartmentEmployees] = useState(
        employeesData.filter(
            employee => employee.department === department.name
        )
    );

    const handleRemoveEmployee = (employeeId) => {
        setDepartmentEmployees(prev =>
            prev.filter(employee => employee.id !== employeeId)
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedDepartment = {
            ...department,
            name,
            manager,
            description,
            status,
        };

        console.log("Updated Department:", updatedDepartment);
        console.log("Department Employees:", departmentEmployees);

        onClose();
    };

    return (
        <div className="w-full">

            {/* FORM */}
            <form onSubmit={handleSubmit}>

                {/* Department Information */}
                <div className="rounded-2xl border border-gray-200 bg-white">

                    <div className="border-b border-gray-100 px-5 py-2 sm:px-7">
                        <h2 className="text-lg font-semibold text-black">
                            Update department details
                        </h2>
                    </div>

                    <div className="space-y-5 px-5 py-4 sm:px-7">

                        {/* Department Name */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Department Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:bg-white"
                            />
                        </div>

                        {/* Department Head */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Department Head
                            </label>

                            <input
                                type="text"
                                value={manager}
                                onChange={(e) => setManager(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:bg-white"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Description
                            </label>

                            <textarea
                                rows="4"
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                placeholder="Enter department description"
                                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:bg-white"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Status
                            </label>

                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:bg-white"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        {/* Department ID */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Department ID
                            </label>

                            <div className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm font-medium text-gray-500">
                                {department.id}
                            </div>
                        </div>

                    </div>
                </div>


                {/* EMPLOYEES */}
                <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white">

                    <button
                        type="button"
                        onClick={() => setShowEmployees(!showEmployees)}
                        className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-gray-50 sm:px-7"
                    >
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold text-black">
                                    Employees
                                </h2>

                                <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-bold text-white">
                                    {departmentEmployees.length}
                                </span>
                            </div>

                            <p className="mt-1 text-sm text-gray-500">
                                Employees working under this department
                            </p>
                        </div>

                        {showEmployees ? (
                            <ChevronUp size={20} />
                        ) : (
                            <ChevronDown size={20} />
                        )}
                    </button>


                    {/* EMPLOYEE LIST */}
                    {showEmployees && (
                        <div className="border-t border-gray-100">

                            {departmentEmployees.length > 0 ? (
                                departmentEmployees.map((employee) => (
                                    <div
                                        key={employee.id}
                                        className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-4 last:border-b-0 sm:px-7"
                                    >

                                        {/* Employee */}
                                        <div className="flex min-w-0 items-center gap-3">

                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-xs font-bold text-white">
                                                {employee.name
                                                    .split(" ")
                                                    .map(word => word[0])
                                                    .join("")
                                                    .slice(0, 2)}
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-gray-900">
                                                    {employee.name}
                                                </p>

                                                <p className="truncate text-xs text-gray-500">
                                                    {employee.email}
                                                </p>
                                            </div>

                                        </div>


                                        {/* Role + Remove */}
                                        <div className="flex shrink-0 items-center gap-3">

                                            <span className="hidden rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 sm:inline-flex">
                                                {employee.role}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveEmployee(
                                                        employee.id
                                                    )
                                                }
                                                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-red-500 transition hover:bg-red-50"
                                            >
                                                <Trash2 size={15} />
                                                <span className="hidden sm:inline">
                                                    Remove
                                                </span>
                                            </button>

                                        </div>

                                    </div>
                                ))
                            ) : (
                                <div className="px-5 py-10 text-center sm:px-7">
                                    <p className="text-sm font-medium text-gray-500">
                                        No employees in this department
                                    </p>
                                </div>
                            )}

                        </div>
                    )}

                </div>


                {/* BUTTONS */}
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:border-black hover:bg-black hover:text-white sm:w-auto"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 sm:w-auto"
                    >
                        Save Changes
                    </button>

                </div>

            </form>

        </div>
    );
};

export default DepartmentEditModal;