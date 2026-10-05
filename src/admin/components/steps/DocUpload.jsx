import { Trash } from "lucide-react";

const documentTypes = [
  {
    key: "aadhaar",
    label: "Aadhaar",
    description: "Upload Aadhaar card",
  },
  {
    key: "pan",
    label: "PAN",
    description: "Upload PAN card",
  },
  {
    key: "resume",
    label: "Resume",
    description: "Upload employee resume",
  },
  {
    key: "offerLetter",
    label: "Offer Letter",
    description: "Upload offer letter",
  },
  {
    key: "signedNda",
    label: "Signed NDA",
    description: "Upload signed NDA document",
  },
  {
    key: "idCard",
    label: "ID Card",
    description: "Upload employee ID card",
  },
];

const emptyDocuments = {
  aadhaar: [],
  pan: [],
  resume: [],
  offerLetter: [],
  signedNda: [],
  idCard: [],
};

export default function DocUpload({
  data,
  onChange,
  errors = {},
}) {
  const documents = {
    ...emptyDocuments,
    ...(data || {}),
  };

  const handleUpload = (
    documentType,
    files
  ) => {
    if (!files || files.length === 0) return;

    // Only PDF files
    const pdfFiles = Array.from(files).filter(
      (file) =>
        file.type === "application/pdf"
    );

    if (pdfFiles.length !== files.length) {
      alert("Only PDF files are allowed.");
    }

    if (pdfFiles.length === 0) return;

    onChange({
      ...documents,
      [documentType]: [
        ...(documents[documentType] || []),
        ...pdfFiles,
      ],
    });
  };

  const removeDocument = (
    documentType,
    index
  ) => {
    const updatedFiles = [
      ...documents[documentType],
    ];

    updatedFiles.splice(index, 1);

    onChange({
      ...documents,
      [documentType]: updatedFiles,
    });
  };

  return (
    <div>
      {/* Header */}

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-black">
          Document Verification
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Upload the required employee documents for verification.
          Only PDF files are allowed.
        </p>
      </div>

      {/* Documents */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ">
        {documentTypes.map(
          (document) => (
            <div
              key={document.key}
              className={`rounded-xl border bg-white p-4 ${
                errors[document.key]
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
            >
              {/* Document Header */}

              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-800">
                  {document.label}
                   {document.key !== "idCard" && (
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                   )}
                </label>

                <p className="mt-1 text-xs text-gray-500">
                  {document.description}
                </p>
              </div>

              {/* Upload */}

              <input
                type="file"
                accept="application/pdf,.pdf"
                multiple
                onChange={(e) => {
                  handleUpload(
                    document.key,
                    e.target.files
                  );

                  // Allows the same file
                  // to be selected again
                  e.target.value = "";
                }}
                className={`block w-full cursor-pointer rounded-lg border bg-white px-3 py-2 text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800 ${
                  errors[document.key]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />

              <p className="mt-2 text-xs text-gray-400">
                PDF only. You can upload multiple files.
              </p>

              {/* Error */}

              {errors[document.key] && (
                <p className="mt-2 text-xs text-red-500">
                  {errors[document.key]}
                </p>
              )}

              {/* Uploaded Files */}

              {documents[
                document.key
              ]?.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Uploaded Documents
                  </p>

                  {documents[
                    document.key
                  ].map(
                    (file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
                      >
                        {/* File Info */}

                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-black text-xs font-bold text-white">
                            PDF
                          </span>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-gray-700">
                              {file.name}
                            </p>

                            <p className="text-xs text-gray-400">
                              {(
                                file.size /
                                1024 /
                                1024
                              ).toFixed(2)}{" "}
                              MB
                            </p>
                          </div>
                        </div>

                        {/* Remove */}

                        <button
                          type="button"
                          onClick={() =>
                            removeDocument(
                              document.key,
                              index
                            )
                          }
                          className="ml-3 shrink-0 text-sm font-medium text-red-600 hover:text-red-700"
                        >
                          <Trash/>
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}