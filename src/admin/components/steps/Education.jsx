import React from "react";

const emptyEducation = {
  qualification: "",
  university: "",
  passingYear: "",
  score: "",
  scoreType: "percentage",
  specialization: "",
  documents: [],
};

export default function Education({ data, onChange }) {
  // Make sure education is always an array
  const educationList =
    Array.isArray(data) && data.length > 0
      ? data
      : [emptyEducation];

  const updateEducation = (index, field, value) => {
    const updated = [...educationList];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    onChange(updated);
  };

  const addEducation = () => {
    onChange([
      ...educationList,
      {
        ...emptyEducation,
        documents: [],
      },
    ]);
  };

  const removeEducation = (index) => {
    if (educationList.length === 1) return;

    const updated = educationList.filter(
      (_, i) => i !== index
    );

    onChange(updated);
  };

  const handleDocuments = (index, files) => {
    const pdfFiles = Array.from(files).filter(
      (file) => file.type === "application/pdf"
    );

    const updated = [...educationList];

    updated[index] = {
      ...updated[index],
      documents: [
        ...(updated[index].documents || []),
        ...pdfFiles,
      ],
    };

    onChange(updated);
  };

  const removeDocument = (educationIndex, documentIndex) => {
    const updated = [...educationList];

    updated[educationIndex] = {
      ...updated[educationIndex],
      documents: updated[educationIndex].documents.filter(
        (_, index) => index !== documentIndex
      ),
    };

    onChange(updated);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-black">
          Education
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Add the employee's educational qualifications and
          supporting documents.
        </p>
      </div>

      {/* Education Sections */}
      <div className="space-y-6">
        {educationList.map((education, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            {/* Section Header */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-black">
                  Education {index + 1}
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Enter qualification details.
                </p>
              </div>

              {educationList.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Qualification */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Qualification{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={education.qualification}
                  onChange={(e) =>
                    updateEducation(
                      index,
                      "qualification",
                      e.target.value
                    )
                  }
                  placeholder="e.g. B.Tech, MBA, B.Sc"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-black"
                />
              </div>

              {/* University / Board */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  University / Board{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={education.university}
                  onChange={(e) =>
                    updateEducation(
                      index,
                      "university",
                      e.target.value
                    )
                  }
                  placeholder="Enter university or board"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-black"
                />
              </div>

              {/* Passing Year */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Passing Year{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="number"
                  min="1950"
                  max={new Date().getFullYear()}
                  value={education.passingYear}
                  onChange={(e) =>
                    updateEducation(
                      index,
                      "passingYear",
                      e.target.value
                    )
                  }
                  placeholder="e.g. 2024"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-black"
                />
              </div>

              {/* Score Type */}
              <div>
                <label>
                  Percentage/CGPA
                </label>
                <input type="number"
                  placeholder="e.g 8.5 or 85%"
                />

              </div>

              {/* Specialization */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Specialization
                </label>

                <input
                  type="text"
                  value={education.specialization}
                  onChange={(e) =>
                    updateEducation(
                      index,
                      "specialization",
                      e.target.value
                    )
                  }
                  placeholder="e.g. Computer Science"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-black"
                />
              </div>

              {/* Documents */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Supporting Documents
                </label>

                <p className="mt-1 text-xs text-gray-500">
                  Upload marksheets, certificates, or degree
                  documents. Only PDF files are allowed.
                </p>

                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  multiple
                  onChange={(e) => {
                    handleDocuments(index, e.target.files);
                    e.target.value = "";
                  }}
                  className="mt-3 block w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800"
                />

                {/* Uploaded Documents */}
                {education.documents?.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Uploaded Documents
                    </p>

                    {education.documents.map(
                      (file, documentIndex) => (
                        <div
                          key={`${file.name}-${documentIndex}`}
                          className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-black text-xs font-bold text-white">
                              PDF
                            </span>

                            <span className="truncate text-sm text-gray-700">
                              {file.name}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeDocument(
                                index,
                                documentIndex
                              )
                            }
                            className="ml-3 text-sm font-medium text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Education */}
      <button
        type="button"
        onClick={addEducation}
        className="mt-5 inline-flex items-center gap-2 rounded-lg border border-black bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-black hover:text-white"
      >
        <span className="text-lg leading-none">+</span>
        Add Education
      </button>
    </div>
  );
}