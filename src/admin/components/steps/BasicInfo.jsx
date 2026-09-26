import { useEffect, useState } from "react";

/* -----------------------------
   Validation
----------------------------- */

export const validateBasicInformation = (data) => {
    const errors = {};

    // Employee ID
    if (!data.employeeId?.trim()) {
        errors.employeeId = "Employee ID is required.";
    } else if (!/^[A-Za-z0-9-_]+$/.test(data.employeeId.trim())) {
        errors.employeeId =
            "Employee ID can contain only letters, numbers, hyphens and underscores.";
    }

    // First Name
    if (!data.firstName?.trim()) {
        errors.firstName = "First name is required.";
    } else if (!/^[A-Za-z\s'-]+$/.test(data.firstName.trim())) {
        errors.firstName = "Please enter a valid first name.";
    }

    // Middle Name
    if (!data.middleName?.trim()) {
        errors.middleName = "Middle name is required.";
    } else if (!/^[A-Za-z\s'-]+$/.test(data.middleName.trim())) {
        errors.middleName = "Please enter a valid middle name.";
    }

    // Last Name
    if (!data.lastName?.trim()) {
        errors.lastName = "Last name is required.";
    } else if (!/^[A-Za-z\s'-]+$/.test(data.lastName.trim())) {
        errors.lastName = "Please enter a valid last name.";
    }

    // Gender
    if (!data.gender) {
        errors.gender = "Please select gender.";
    }

    // Marital Status
    if (!data.maritalStatus) {
        errors.maritalStatus = "Please select marital status.";
    }

    // Blood Group
    if (!data.bloodGroup) {
        errors.bloodGroup = "Please select blood group.";
    }

    // Profile Photo
    if (!data.profilePhoto) {
        errors.profilePhoto = "Profile photo is required.";
    } else if (data.profilePhoto instanceof File) {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(data.profilePhoto.type)) {
            errors.profilePhoto =
                "Only JPG, PNG or WEBP images are allowed.";
        }

        if (data.profilePhoto.size > 5 * 1024 * 1024) {
            errors.profilePhoto =
                "Profile photo must be smaller than 5 MB.";
        }
    }

    // Date of Birth
    if (!data.dateOfBirth) {
        errors.dateOfBirth = "Date of birth is required.";
    } else {
        const dob = new Date(data.dateOfBirth);
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (Number.isNaN(dob.getTime())) {
            errors.dateOfBirth = "Please enter a valid date.";
        } else if (dob > today) {
            errors.dateOfBirth =
                "Date of birth cannot be in the future.";
        }
    }

    return errors;
};


/* -----------------------------
   Component
----------------------------- */

export default function BasicInformation({
    data,
    onChange,
}) {
    const [errors, setErrors] = useState({});
    const [photoPreview, setPhotoPreview] = useState(null);

    /* -----------------------------
       Photo Preview
    ----------------------------- */

    useEffect(() => {
        if (!data.profilePhoto) {
            setPhotoPreview(null);
            return;
        }

        if (data.profilePhoto instanceof File) {
            const url = URL.createObjectURL(data.profilePhoto);

            setPhotoPreview(url);

            return () => {
                URL.revokeObjectURL(url);
            };
        }
    }, [data.profilePhoto]);


    /* -----------------------------
       Update Field
    ----------------------------- */

    const update = (field, value) => {
        onChange({
            ...data,
            [field]: value,
        });

        // Clear error while user is correcting the field
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };


    /* -----------------------------
       Validate Individual Field
    ----------------------------- */

    const validateField = (field) => {
        const fieldErrors = validateBasicInformation(data);

        setErrors((prev) => ({
            ...prev,
            [field]: fieldErrors[field] || "",
        }));
    };


    /* -----------------------------
       Required Label
    ----------------------------- */

    const Label = ({ children }) => (
        <label className="text-sm font-medium text-gray-800">
            {children}

            <span className="ml-1 text-red-500">*</span>
        </label>
    );


    /* -----------------------------
       Input Class
    ----------------------------- */

    const inputClass = (field) =>
        `mt-2 w-full rounded-lg border px-3 py-2.5 outline-none transition ${errors[field]
            ? "border-red-500 focus:border-red-500"
            : "border-gray-300 focus:border-black"
        }`;


    return (
        <div>

            {/* Header */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-black">
                    Personal Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Enter the employee's personal information.
                </p>
            </div>


            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">


                {/* --------------------------------
            Employee ID
        -------------------------------- */}

                <div>
                    <Label>Employee ID</Label>

                    <input
                        type="text"
                        value={data.employeeId || ""}
                        onChange={(e) =>
                            update("employeeId", e.target.value)
                        }
                        onBlur={() =>
                            validateField("employeeId")
                        }
                        placeholder="EMP-001"
                        className={inputClass("employeeId")}
                    />

                    {errors.employeeId && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.employeeId}
                        </p>
                    )}
                </div>


                {/* --------------------------------
            First Name
        -------------------------------- */}

                <div>
                    <Label>First Name</Label>

                    <input
                        type="text"
                        value={data.firstName || ""}
                        onChange={(e) =>
                            update("firstName", e.target.value)
                        }
                        onBlur={() =>
                            validateField("firstName")
                        }
                        placeholder="Enter first name"
                        className={inputClass("firstName")}
                    />

                    {errors.firstName && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.firstName}
                        </p>
                    )}
                </div>


                {/* --------------------------------
            Middle Name
        -------------------------------- */}

                <div>
                    <Label>Middle Name</Label>

                    <input
                        type="text"
                        value={data.middleName || ""}
                        onChange={(e) =>
                            update("middleName", e.target.value)
                        }
                        onBlur={() =>
                            validateField("middleName")
                        }
                        placeholder="Enter middle name"
                        className={inputClass("middleName")}
                    />

                    {errors.middleName && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.middleName}
                        </p>
                    )}
                </div>


                {/* --------------------------------
            Last Name
        -------------------------------- */}

                <div>
                    <Label>Last Name</Label>

                    <input
                        type="text"
                        value={data.lastName || ""}
                        onChange={(e) =>
                            update("lastName", e.target.value)
                        }
                        onBlur={() =>
                            validateField("lastName")
                        }
                        placeholder="Enter last name"
                        className={inputClass("lastName")}
                    />

                    {errors.lastName && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.lastName}
                        </p>
                    )}
                </div>


                {/* --------------------------------
            Gender
        -------------------------------- */}

                <div>
                    <Label>Gender</Label>

                    <select
                        value={data.gender || ""}
                        onChange={(e) =>
                            update("gender", e.target.value)
                        }
                        onBlur={() =>
                            validateField("gender")
                        }
                        className={inputClass("gender")}
                    >
                        <option value="">
                            Select gender
                        </option>

                        <option value="male">
                            Male
                        </option>

                        <option value="female">
                            Female
                        </option>

                        <option value="other">
                            Other
                        </option>

                        <option value="prefer_not_to_say">
                            Prefer not to say
                        </option>
                    </select>

                    {errors.gender && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.gender}
                        </p>
                    )}
                </div>


                {/* --------------------------------
            Marital Status
        -------------------------------- */}

                <div>
                    <Label>Marital Status</Label>

                    <select
                        value={data.maritalStatus || ""}
                        onChange={(e) =>
                            update("maritalStatus", e.target.value)
                        }
                        onBlur={() =>
                            validateField("maritalStatus")
                        }
                        className={inputClass("maritalStatus")}
                    >
                        <option value="">
                            Select marital status
                        </option>

                        <option value="single">
                            Single
                        </option>

                        <option value="married">
                            Married
                        </option>

                        <option value="divorced">
                            Divorced
                        </option>

                        <option value="widowed">
                            Widowed
                        </option>
                    </select>

                    {errors.maritalStatus && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.maritalStatus}
                        </p>
                    )}
                </div>


                {/* --------------------------------
            Blood Group
        -------------------------------- */}

                <div>
                    <Label>Blood Group</Label>

                    <select
                        value={data.bloodGroup || ""}
                        onChange={(e) =>
                            update("bloodGroup", e.target.value)
                        }
                        onBlur={() =>
                            validateField("bloodGroup")
                        }
                        className={inputClass("bloodGroup")}
                    >
                        <option value="">
                            Select blood group
                        </option>

                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>

                    {errors.bloodGroup && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.bloodGroup}
                        </p>
                    )}
                </div>


                {/* --------------------------------
            Date of Birth
        -------------------------------- */}

                <div>
                    <Label>Date of Birth</Label>

                    <input
                        type="date"
                        value={data.dateOfBirth || ""}
                        max={new Date().toISOString().split("T")[0]}
                        onChange={(e) =>
                            update("dateOfBirth", e.target.value)
                        }
                        onBlur={() =>
                            validateField("dateOfBirth")
                        }
                        className={inputClass("dateOfBirth")}
                    />

                    {errors.dateOfBirth && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.dateOfBirth}
                        </p>
                    )}
                </div>


                {/* --------------------------------
            Profile Photo
        -------------------------------- */}

                <div className="md:col-span-2">

                    <Label>Profile Photo</Label>

                    <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">

                        {/* Preview */}
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-gray-100">
                            {photoPreview ? (
                                <img
                                    src={photoPreview}
                                    alt="Profile preview"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-xs text-gray-400">
                                    No photo
                                </span>
                            )}
                        </div>


                        {/* Upload */}
                        <div className="flex-1">
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];

                                    update("profilePhoto", file || null);

                                    if (file) {
                                        // Validate immediately
                                        const fileErrors =
                                            validateBasicInformation({
                                                ...data,
                                                profilePhoto: file,
                                            });

                                        setErrors((prev) => ({
                                            ...prev,
                                            profilePhoto:
                                                fileErrors.profilePhoto || "",
                                        }));
                                    }
                                }}
                                className="block w-full cursor-pointer rounded-lg border border-gray-300 text-sm file:mr-4 file:border-0 file:bg-black file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800"
                            />

                            <p className="mt-1 text-xs text-gray-500">
                                JPG, PNG or WEBP. Maximum size 5 MB.
                            </p>

                            {errors.profilePhoto && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.profilePhoto}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}