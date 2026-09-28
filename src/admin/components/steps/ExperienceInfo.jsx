import React from "react";

const emptyExperience = {
  companyName: "",
  designation: "",
  totalExperience: "",
  skills: "",
  startDate: "",
  endDate: "",
  reasonForLeaving: "",
};

export default function ExperienceInfo({ data, onChange }) {
  const experienceList =
    Array.isArray(data) && data.length > 0
      ? data
      : [emptyExperience];

  const updateExperience = (index, field, value) => {
    const updated = [...experienceList];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    onChange(updated);
  };

  const addExperience = () => {
    onChange([
      ...experienceList,
      {
        ...emptyExperience,
      },
    ]);
  };

  const removeExperience = (index) => {
    if (experienceList.length === 1) return;

    const updated = experienceList.filter(
      (_, i) => i !== index
    );

    onChange(updated);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-black">
          Experience Information
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Add the employee's previous work experience, if applicable.
        </p>

        <p className="mt-2 text-xs text-gray-400">
          This section is optional.
        </p>
      </div>

      {/* Experience List */}
      <div className="space-y-6">
        {experienceList.map((experience, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            {/* Section Header */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-black">
                  Work Experience {index + 1}
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Enter details of the employee's previous employment.
                </p>
              </div>

              {experienceList.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-sm font-medium text-red-600 transition hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {/* Company Name */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Company Name
                </label>

                <input
                  type="text"
                  value={experience.companyName}
                  onChange={(e) =>
                    updateExperience(
                      index,
                      "companyName",
                      e.target.value
                    )
                  }
                  placeholder="Enter company name"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-black"
                />
              </div>

              {/* Designation */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Designation
                </label>

                <input
                  type="text"
                  value={experience.designation}
                  onChange={(e) =>
                    updateExperience(
                      index,
                      "designation",
                      e.target.value
                    )
                  }
                  placeholder="e.g. Software Developer"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-black"
                />
              </div>

              {/* Total Experience */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Total Experience
                </label>

                <input
                  type="text"
                  value={experience.totalExperience}
                  onChange={(e) =>
                    updateExperience(
                      index,
                      "totalExperience",
                      e.target.value
                    )
                  }
                  placeholder="e.g. 2 years 6 months"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-black"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Skills
                </label>

                <input
                  type="text"
                  value={experience.skills}
                  onChange={(e) =>
                    updateExperience(
                      index,
                      "skills",
                      e.target.value
                    )
                  }
                  placeholder="e.g. React, Node.js, SQL"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-black"
                />

                <p className="mt-1 text-xs text-gray-400">
                  Separate multiple skills with commas.
                </p>
              </div>

              {/* Start Date */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Start Date
                </label>

                <input
                  type="date"
                  value={experience.startDate}
                  onChange={(e) =>
                    updateExperience(
                      index,
                      "startDate",
                      e.target.value
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-black"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  End Date
                </label>

                <input
                  type="date"
                  value={experience.endDate}
                  onChange={(e) =>
                    updateExperience(
                      index,
                      "endDate",
                      e.target.value
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-black"
                />
              </div>

              {/* Reason for Leaving */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Reason for Leaving
                </label>

                <textarea
                  value={experience.reasonForLeaving}
                  onChange={(e) =>
                    updateExperience(
                      index,
                      "reasonForLeaving",
                      e.target.value
                    )
                  }
                  placeholder="Enter reason for leaving previous employment"
                  rows={3}
                  className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-black"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Experience */}
      <button
        type="button"
        onClick={addExperience}
        className="mt-5 inline-flex items-center gap-2 rounded-lg border border-black bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-black hover:text-white"
      >
        <span className="text-lg leading-none">
          +
        </span>

        Add Experience
      </button>
    </div>
  );
}