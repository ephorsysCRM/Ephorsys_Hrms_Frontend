import { useState } from "react";

const AddDepartment = ({ onClose }) => {

    const [departmentName, setDepartmentName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log({
            departmentName,
            description,
        });

        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">

            {/* Department Name */}
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Department Name
                </label>

                <input
                    type="text"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    placeholder="Enter department name"
                    className="
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        px-4
                        py-3
                        text-sm
                        outline-none
                        transition
                        focus:border-black
                        focus:ring-1
                        focus:ring-black
                    "
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Department Description
                </label>

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter department description"
                    rows={4}
                    className="
                        w-full
                        resize-none
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        px-4
                        py-3
                        text-sm
                        outline-none
                        transition
                        focus:border-black
                        focus:ring-1
                        focus:ring-black
                    "
                    required
                />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">

                <button
                    type="button"
                    onClick={onClose}
                    className="
                        rounded-xl
                        border
                        border-gray-200
                        px-5
                        py-2.5
                        text-sm
                        font-medium
                        text-gray-700
                        transition
                        hover:bg-gray-100
                    "
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="
                        rounded-xl
                        bg-black
                        px-5
                        py-2.5
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-gray-800
                    "
                >
                    Add Department
                </button>

            </div>

        </form>
    );
};

export default AddDepartment;