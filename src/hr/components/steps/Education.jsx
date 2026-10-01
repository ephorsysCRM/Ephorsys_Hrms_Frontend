import { Trash } from "lucide-react";

const emptyEducation = {
  qualification: "",
  university: "",
  passingYear: "",
  score: "",
  scoreType: "percentage",
  specialization: "",
  documents: [],
};

export default function Education({
  data,
  onChange,
  errors = [],
}) {
  const educationList =
    Array.isArray(data) && data.length > 0
      ? data
      : [emptyEducation];

  // =========================================
  // UPDATE EDUCATION FIELD
  // =========================================

  const updateEducation = (
    index,
    field,
    value
  ) => {
    const updated = [...educationList];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    onChange(updated);
  };

  // =========================================
  // ADD EDUCATION
  // =========================================

  const addEducation = () => {
    onChange([
      ...educationList,
      {
        ...emptyEducation,
        documents: [],
      },
    ]);
  };

  // =========================================
  // REMOVE EDUCATION
  // =========================================

  const removeEducation = (index) => {
    if (educationList.length === 1) return;

    const updated = educationList.filter(
      (_, i) => i !== index
    );

    onChange(updated);
  };

  // =========================================
  // HANDLE DOCUMENTS
  // =========================================

  const handleDocuments = (
    index,
    files
  ) => {
    const pdfFiles = Array.from(files).filter(
      (file) =>
        file.type === "application/pdf"
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

  // =========================================
  // REMOVE DOCUMENT
  // =========================================

  const removeDocument = (
    educationIndex,
    documentIndex
  ) => {
    const updated = [...educationList];

    updated[educationIndex] = {
      ...updated[educationIndex],
      documents: updated[
        educationIndex
      ].documents.filter(
        (_, index) =>
          index !== documentIndex
      ),
    };

    onChange(updated);
  };

  // =========================================
  // FIELD ERROR HELPER
  // =========================================

  const fieldError = (index, field) => {
    return errors?.[index]?.[field];
  };

  // =========================================
  // INPUT CLASS
  // =========================================

  const inputClass = (index, field) =>
    `mt-2 w-full rounded-lg border px-3 py-2 outline-none transition ${
      fieldError(index, field)
        ? "border-red-500 focus:border-red-500"
        : "border-gray-300 focus:border-black"
    }`;

  return (
    <div>
      {/* Header */}

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-black">
          Education Details
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Add the employee's educational qualifications and
          supporting documents.
        </p>
      </div>

      {/* Education Forms */}

      <div className="space-y-6">
        {educationList.map(
          (education, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              {/* Education Header */}

              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-black">
                    Education {index + 1}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Enter qualification and academic details.
                  </p>
                </div>

                {/* Remove Button */}

                {educationList.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      removeEducation(index)
                    }
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <Trash/>
                  </button>
                )}
              </div>

              {/* Fields */}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                {/* Qualification */}

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Qualification{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    value={
                      education.qualification
                    }
                    onChange={(e) =>
                      updateEducation(
                        index,
                        "qualification",
                        e.target.value
                      )
                    }
                    placeholder="e.g. B.Tech, MBA, B.Sc"
                    className={inputClass(
                      index,
                      "qualification"
                    )}
                  />

                  {fieldError(
                    index,
                    "qualification"
                  ) && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldError(
                        index,
                        "qualification"
                      )}
                    </p>
                  )}
                </div>

                {/* University / Board */}

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    University / Board{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    value={
                      education.university
                    }
                    onChange={(e) =>
                      updateEducation(
                        index,
                        "university",
                        e.target.value
                      )
                    }
                    placeholder="Enter university or board"
                    className={inputClass(
                      index,
                      "university"
                    )}
                  />

                  {fieldError(
                    index,
                    "university"
                  ) && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldError(
                        index,
                        "university"
                      )}
                    </p>
                  )}
                </div>

                {/* Passing Year */}

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Passing Year{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="number"
                    min="1950"
                    max={
                      new Date().getFullYear()
                    }
                    value={
                      education.passingYear
                    }
                    onChange={(e) =>
                      updateEducation(
                        index,
                        "passingYear",
                        e.target.value
                      )
                    }
                    placeholder="e.g. 2024"
                    className={inputClass(
                      index,
                      "passingYear"
                    )}
                  />

                  {fieldError(
                    index,
                    "passingYear"
                  ) && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldError(
                        index,
                        "passingYear"
                      )}
                    </p>
                  )}
                </div>

                {/* Score Type */}

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Score Type{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    value={
                      education.scoreType
                    }
                    onChange={(e) =>
                      updateEducation(
                        index,
                        "scoreType",
                        e.target.value
                      )
                    }
                    className={inputClass(
                      index,
                      "scoreType"
                    )}
                  >
                    <option value="percentage">
                      Percentage
                    </option>

                    <option value="cgpa">
                      CGPA
                    </option>
                  </select>

                  {fieldError(
                    index,
                    "scoreType"
                  ) && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldError(
                        index,
                        "scoreType"
                      )}
                    </p>
                  )}
                </div>

                {/* Percentage / CGPA */}

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {education.scoreType ===
                    "cgpa"
                      ? "CGPA"
                      : "Percentage"}{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative mt-2">
                    <input
                      type="number"
                      min="0"
                      max={
                        education.scoreType ===
                        "percentage"
                          ? "100"
                          : "10"
                      }
                      step="0.01"
                      value={education.score}
                      onChange={(e) =>
                        updateEducation(
                          index,
                          "score",
                          e.target.value
                        )
                      }
                      placeholder={
                        education.scoreType ===
                        "cgpa"
                          ? "e.g. 8.5"
                          : "e.g. 85"
                      }
                      className={`w-full rounded-lg border px-3 py-2.5 pr-10 outline-none transition ${
                        fieldError(
                          index,
                          "score"
                        )
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 focus:border-black"
                      }`}
                    />

                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      {education.scoreType ===
                      "cgpa"
                        ? "CGPA"
                        : "%"}
                    </span>
                  </div>

                  {fieldError(
                    index,
                    "score"
                  ) && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldError(
                        index,
                        "score"
                      )}
                    </p>
                  )}
                </div>

                {/* Specialization */}

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Specialization
                  </label>

                  <input
                    type="text"
                    value={
                      education.specialization
                    }
                    onChange={(e) =>
                      updateEducation(
                        index,
                        "specialization",
                        e.target.value
                      )
                    }
                    placeholder="e.g. Computer Science"
                    className={inputClass(
                      index,
                      "specialization"
                    )}
                  />
                </div>

                {/* Documents */}

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Supporting Documents
                  </label>

                  <p className="mt-1 text-xs text-gray-500">
                    Upload marksheets, certificates, degree
                    documents, etc. Only PDF files are allowed.
                  </p>

                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    multiple
                    onChange={(e) => {
                      handleDocuments(
                        index,
                        e.target.files
                      );

                      // Allow the same file to be selected again
                      e.target.value = "";
                    }}
                    className="mt-3 block w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800"
                  />

                  {/* Uploaded Documents */}

                  {education.documents
                    ?.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        Uploaded Documents
                      </p>

                      {education.documents.map(
                        (
                          file,
                          documentIndex
                        ) => (
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
                              className="ml-3 shrink-0 text-sm font-medium text-red-600 hover:text-red-700"
                            >
                              <Trash />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {fieldError(
                    index,
                    "documents"
                  ) && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldError(
                        index,
                        "documents"
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Add Education */}

      <button
        type="button"
        onClick={addEducation}
        className="mt-5 inline-flex items-center gap-2 rounded-lg border border-black bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-black hover:text-white"
      >
        <span className="text-lg leading-none">
          +
        </span>

        Add Education
      </button>
    </div>
  );
}