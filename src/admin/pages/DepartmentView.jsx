import { ArrowLeft, Eye, MoreHorizontal, Pencil, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { employeesData } from "../data/employeesData";
import { departmentsData } from "../data/departmentsData";
import { useState } from "react";

const DepartmentView = () => {
    const { id } = useParams();
    const department = departmentsData.find(
        department => department.id === id
    );
    const departmentEmployees = employeesData.filter(
        employee => employee.department === department.name
    );

    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(null);

    return (
        <div className="min-h-screen bg-[#f7f7f7] text-black">

            {/* HEADER */}
            <div className="border-b border-gray-200 bg-white px-5 py-6 sm:px-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-4">

                        <div>
                            <div className="mb-1 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-black"></span>

                                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                    Department
                                </p>
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                Department Management
                            </h1>

                            <p className="mt-1.5 text-sm text-gray-500">
                                Manage department information and employees
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                Department ID:
                                <span className="ml-1 font-semibold text-gray-600">
                                    {id}
                                </span>
                            </p>
                        </div>

                    </div>

                    <button
                        className="
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-black
                            px-5
                            py-3
                            text-sm
                            font-semibold
                            text-white
                            shadow-lg
                            shadow-black/10
                            transition-all
                            duration-200
                            hover:-translate-y-0.5
                            hover:bg-gray-800
                            hover:shadow-xl
                            sm:w-auto
                        "
                        onClick={()=>navigate("/add-employee")}
                    >
                        <Plus size={17} />
                        Add Employee
                    </button>

                </div>
            </div>


            {/* MAIN CONTENT */}
            <div className="px-5 py-6 sm:px-8 lg:px-1">

                {/* DEPARTMENT DETAILS */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                    <div className="border-b border-gray-100 px-5 py-6 sm:px-7">

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <div className="flex items-center gap-2">

                                    <span className="rounded-lg bg-black px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                                        Department
                                    </span>

                                    <span className="text-xs text-gray-400">
                                        {id}
                                    </span>

                                </div>

                                <h2 className="mt-3 text-2xl font-bold tracking-tight">
                                    {department.name}
                                </h2>
                            </div>

                            <span className="flex w-fit items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3.5 py-2 text-xs font-semibold text-green-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                                {department.status}
                            </span>

                        </div>

                    </div>


                    {/* STATS */}
                    <div className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">

                        <div className="p-5 sm:p-6">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                Department Head
                            </p>

                            <p className="mt-3 text-base font-semibold text-gray-900">
                                {department.manager}
                            </p>
                        </div>


                        <div className="p-5 sm:p-6">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                Total Employees
                            </p>

                            <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900">
                                {departmentEmployees.length}
                            </p>
                        </div>


                        <div className="p-5 sm:p-6">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                Department ID
                            </p>

                            <p className="mt-3 text-base font-semibold text-gray-900">
                                {id}
                            </p>
                        </div>

                    </div>

                </div>


                {/* EMPLOYEES */}
                <div className="mt-8">

                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between px-5">

                        <div>

                            <div className="flex items-center gap-2">

                                <h2 className="text-xl font-bold tracking-tight">
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

                        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                            Department Members
                        </p>

                    </div>


                    {/* TABLE */}
                    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">

                        <div className="min-w-[800px]">

                            {/* TABLE HEADER */}
                            <div
                                className="
                                    grid
                                    grid-cols-5
                                    gap-4
                                    border-b
                                    border-gray-200
                                    bg-[#fafafa]
                                    px-5
                                    py-4
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.12em]
                                    text-gray-800
                                "
                            >
                                <div>Name & Role</div>
                                <div>Email</div>
                                <div>Manager</div>
                                <div>Status</div>
                                <div>Action</div>
                            </div>


                            {/* EMPLOYEE ROWS */}
                            {departmentEmployees.map(employee => (

                                <div
                                    key={employee.id}
                                    className="
                                        grid
                                        grid-cols-5
                                        gap-4
                                        border-b
                                        border-gray-100
                                        px-5
                                        py-5
                                        transition-colors
                                        duration-200
                                        last:border-b-0
                                        hover:bg-gray-50
                                    "
                                >

                                    {/* NAME & ROLE */}
                                    <div className="min-w-0">

                                        <div className="flex items-center gap-3">

                                            <div
                                                className="
                                                    flex
                                                    h-9
                                                    w-9
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    bg-black
                                                    text-xs
                                                    font-bold
                                                    text-white
                                                "
                                            >
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

                                                <p className="mt-0.5 text-xs text-gray-400">
                                                    {employee.role}
                                                </p>

                                            </div>

                                        </div>

                                    </div>


                                    {/* EMAIL */}
                                    <div className="min-w-0 flex items-center">

                                        <p className="truncate text-sm text-gray-600">
                                            {employee.email}
                                        </p>

                                    </div>


                                    {/* MANAGER */}
                                    <div className="min-w-0 flex items-center">

                                        <p className="truncate text-sm text-gray-600">
                                            {employee.manager}
                                        </p>

                                    </div>


                                    {/* STATUS */}
                                    <div className="flex items-center">

                                        <span
                                            className="
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                rounded-full
                                                border
                                                border-green-200
                                                bg-green-50
                                                px-3
                                                py-1.5
                                                text-xs
                                                font-semibold
                                                text-green-700
                                            "
                                        >
                                            <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>

                                            {employee.status}
                                        </span>

                                    </div>


                                    {/* ACTION */}
                                    <div className="relative flex items-center">

                                        <button
                                            onClick={() =>
                                                setOpenMenu(
                                                    openMenu === employee.id
                                                        ? null
                                                        : employee.id
                                                )
                                            }
                                            className="
                                                rounded-xl
                                                border
                                                border-transparent
                                                p-2
                                                text-gray-400
                                                transition-all
                                                duration-200
                                                hover:border-gray-200
                                                hover:bg-gray-100
                                                hover:text-black
                                            "
                                        >
                                            <MoreHorizontal size={20} />
                                        </button>


                                        {openMenu === employee.id && (

                                            <div
                                                className="
                                                    absolute
                                                    right-0
                                                    top-11
                                                    z-20
                                                    w-36
                                                    overflow-hidden
                                                    rounded-xl
                                                    border
                                                    border-gray-200
                                                    bg-white
                                                    p-1.5
                                                    shadow-2xl
                                                    shadow-black/10
                                                "
                                            >

                                                {/* VIEW */}
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/employees/${employee.id}`,
                                                            {
                                                                state: { employee }
                                                            }
                                                        )
                                                    }
                                                    className="
                                                        flex
                                                        w-full
                                                        items-center
                                                        gap-2
                                                        rounded-lg
                                                        px-3
                                                        py-2.5
                                                        text-left
                                                        text-sm
                                                        font-medium
                                                        text-gray-700
                                                        transition
                                                        hover:bg-gray-100
                                                        hover:text-black
                                                    "
                                                >
                                                    <Eye size={16} />
                                                    View
                                                </button>


                                                {/* EDIT */}
                                                <button
                                                    className="
                                                        flex
                                                        w-full
                                                        items-center
                                                        gap-2
                                                        rounded-lg
                                                        px-3
                                                        py-2.5
                                                        text-left
                                                        text-sm
                                                        font-medium
                                                        text-gray-700
                                                        transition
                                                        hover:bg-gray-100
                                                        hover:text-black
                                                    "
                                                >
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


                {/* BACK BUTTON */}
                <button
                    onClick={() => navigate(-1)}
                    className="
                        mt-6
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-gray-600
                        shadow-sm
                        transition-all
                        duration-200
                        hover:border-black
                        hover:bg-black
                        hover:text-white
                        hover:shadow-md
                    "
                >
                    <ArrowLeft size={18} />
                    Back to department
                </button>

            </div>

        </div>
    );
};

export default DepartmentView;