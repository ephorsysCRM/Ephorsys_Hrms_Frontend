import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CustomStepper from "../components/stepper/CustomStepper";
import BasicInformation from "../components/steps/BasicInfo";
import ContactInfo from "../components/steps/ContactInfo";
import JobInfo from "../components/steps/JobInfo";
import PayRollInfo from "../components/steps/PayRollInfo";
import BankInfo from "../components/steps/BankInfo";
import Education from "../components/steps/Education";
import ExperienceInfo from "../components/steps/ExperienceInfo";
import DocUpload from "../components/steps/DocUpload";
import AccessPermission from "../components/steps/AccessPermission";

import { validateInfo } from "../utils/ValidateInfo";

export default function AddEmployee() {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    basic: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      address: "",
    },

    // Step 2: Contact Information
    contact: {
      emergencyContactName: "",
      emergencyContactNumber: "",
      relationship: "",
      alternateEmail: "",
      alternatePhone: "",
    },

    // Step 3: Job Information
    employment: {
      employeeId: "",
      department: "",
      designation: "",
      joiningDate: "",
      employmentType: "",
      reportingManager: "",
      workLocation: "",
    },

    // Step 4: Payroll
    payroll: {
      basicSalary: "",
      allowances: "",
      deductions: "",
      pf: "",
      pt: "",
      payrollFrequency: "",
    },

    // Step 5: Bank Information
    bank: {
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      confirmAccountNumber: "",
      ifsc: "",
      branchName: "",
      passbookDocument: null,
    },

    // Step 6: Education
    education: [
      {
        qualification: "",
        university: "",
        passingYear: "",
        score: "",
        scoreType: "percentage",
        specialization: "",
        documents: [],
      },
    ],

    // Step 7: Experience
    experience: [
      {
        companyName: "",
        designation: "",
        totalExperience: "",
        skills: "",
        startDate: "",
        endDate: "",
        reasonForLeaving: "",
      },
    ],

    // Step 8: Document Verification
    documents: {
      files: [],
    },

    // Step 9: Access & Permissions
    access: {
      loginEmail: "",
      username: "",
      password: "",
      confirmPassword: "",
      systemRole: "",
      permissions: [],
    },
  });

  const steps = [
    { title: "Basic Information" },
    { title: "Contact Information" },
    { title: "Job Information" },
    { title: "Payroll" },
    { title: "Bank Information" },
    { title: "Education" },
    { title: "Experience" },
    { title: "Document Verification" },
    { title: "Access" },
  ];

  const [validationErrors, setValidationErrors] = useState({});

  // Update a section without overwriting other sections
  const updateSection = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  // Receive validation errors from child component
  const handleValidation = (errors) => {
    setValidationErrors(errors);
  };

  // Continue button
  const handleContinue = () => {
    let errors = {};

    /*
     * Validate the current step.
     *
     * Currently Basic Information has the validation
     * function validateInfo(), so validate formData.basic.
     */
    if (activeStep === 0) {
      errors = validateInfo(formData.basic);

      setValidationErrors(errors);

      // Stop here if validation errors exist
      if (Object.keys(errors).length > 0) {
        return;
      }
    }

    // Move to next step only when current step is valid
    setActiveStep((prev) =>
      Math.min(prev + 1, steps.length - 1)
    );

    // Clear errors after successfully moving forward
    setValidationErrors({});
  };

  // Back button
  const previousStep = () => {
    setValidationErrors({});

    setActiveStep((prev) =>
      Math.max(prev - 1, 0)
    );
  };

  // Stepper click
  const handleStepClick = (stepIndex) => {
    /*
     * Do not allow jumping forward without completing
     * the current Basic Information step.
     */
    if (stepIndex > activeStep) {
      if (activeStep === 0) {
        const errors = validateInfo(formData.basic);

        setValidationErrors(errors);

        if (Object.keys(errors).length > 0) {
          return;
        }
      }
    }

    setValidationErrors({});
    setActiveStep(stepIndex);
  };

  // Final submit
  const createEmployee = () => {
    /*
     * Validate Basic Information one more time
     * before creating the employee.
     */
    const basicErrors = validateInfo(formData.basic);

    if (Object.keys(basicErrors).length > 0) {
      setActiveStep(0);
      setValidationErrors(basicErrors);
      return;
    }

    console.log("Employee Data:", formData);

    // Send formData to your backend API here.
    // Remember to convert uploaded File objects to FormData
    // or upload the files separately.

    alert("Employee form submitted successfully!");

    navigate("/employees");
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 md:p-6">
      <div className="w-full">
        <div className="w-full rounded-xl bg-white p-4 shadow-sm md:p-6">

          {/* Stepper */}
          <CustomStepper
            steps={steps}
            activeStep={activeStep}
            onStepClick={handleStepClick}
          />

          <div className="my-6 border-t border-gray-200" />

          {/* Active Step Content */}
          <div className="min-h-100">

            {/* Step 1 */}
            {activeStep === 0 && (
              <BasicInformation
                data={formData.basic}
                onChange={(data) =>
                  updateSection("basic", data)
                }
                onValidation={handleValidation}
              />
            )}

            {/* Step 2 */}
            {activeStep === 1 && (
              <ContactInfo
                data={formData.contact}
                onChange={(data) =>
                  updateSection("contact", data)
                }
              />
            )}

            {/* Step 3 */}
            {activeStep === 2 && (
              <JobInfo
                data={formData.employment}
                onChange={(data) =>
                  updateSection("employment", data)
                }
              />
            )}

            {/* Step 4 */}
            {activeStep === 3 && (
              <PayRollInfo
                data={formData.payroll}
                onChange={(data) =>
                  updateSection("payroll", data)
                }
              />
            )}

            {/* Step 5 */}
            {activeStep === 4 && (
              <BankInfo
                data={formData.bank}
                onChange={(data) =>
                  updateSection("bank", data)
                }
              />
            )}

            {/* Step 6 */}
            {activeStep === 5 && (
              <Education
                data={formData.education}
                onChange={(data) =>
                  updateSection("education", data)
                }
              />
            )}

            {/* Step 7 */}
            {activeStep === 6 && (
              <ExperienceInfo
                data={formData.experience}
                onChange={(data) =>
                  updateSection("experience", data)
                }
              />
            )}

            {/* Step 8 */}
            {activeStep === 7 && (
              <DocUpload
                data={formData.documents}
                onChange={(data) =>
                  updateSection("documents", data)
                }
              />
            )}

            {/* Step 9 */}
            {activeStep === 8 && (
              <AccessPermission
                data={formData.access}
                onChange={(data) =>
                  updateSection("access", data)
                }
              />
            )}

          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-5">

            {/* Back */}
            <button
              type="button"
              onClick={previousStep}
              disabled={activeStep === 0}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>

            {/* Continue / Create Employee */}
            {activeStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleContinue}
                className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={createEmployee}
                className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Create Employee
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}