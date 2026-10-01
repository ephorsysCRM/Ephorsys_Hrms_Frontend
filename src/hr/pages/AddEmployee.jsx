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



import { validateInfo } from "../utils/ValidateInfo";
import { validateContactInfo } from "../utils/ValidateContactInfo";
import { validateBankInfo } from "../utils/ValidateBankInfo";
import { validatePayRoll } from "../utils/ValidatePayRoll";
import { validateEducation } from "../utils/ValidateEducation";
import { validateExperience } from "../utils/ValidateExperience";
import { validateDoc } from "../utils/ValidateDoc";
// import { validatePermission } from "../utils/ValidatePermission";
import { validateJobInfo } from "../utils/ValidateJobInfo";

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
      personalEmail: "",
      officialEmail: "",
      mobile: "",
      alternateMobile: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      city: "",
      state: "",
      pinCode: "",
      currentAddress: "",
      permanentAddress: "",
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
      aadhaar: [],
      pan: [],
      resume: [],
      offerLetter: [],
      experienceLetter: [],
      signedNda: [],
      idCard: [],
    },

    // Step 9: Access & Permissions
    // access: {
    //   password: "",
    //   confirmPassword: "",
    // },
  });

  const handleContinue = () => {
    let errors = {};

    switch (activeStep) {
      case 0:
        errors = validateInfo(formData.basic);
        break;

      case 1:
        errors = validateContactInfo(formData.contact);
        break;

      case 2:
        errors = validateJobInfo(formData.employment);
        break;

      case 3:
        errors = validatePayRoll(formData.payroll);
        break;

      case 4:
        errors = validateBankInfo(formData.bank);
        break;

      case 5:
        errors = validateEducation(formData.education);
        break;
      case 6:
        errors = validateExperience(formData.experience);
        break;
      case 7:
        errors = validateDoc(
          formData.documents
        );
        break;
      default:
        errors = {};
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setActiveStep((prev) =>
      Math.min(prev + 1, steps.length - 1)
    );

    setValidationErrors({});
  };

  const steps = [
    { title: "Basic Information" },
    { title: "Contact Information" },
    { title: "Job Information" },
    { title: "Payroll" },
    { title: "Bank Information" },
    { title: "Education" },
    { title: "Experience" },
    { title: "Document Verification" },
  ];

  const [validationErrors, setValidationErrors] = useState({});

  // Update a section without overwriting other sections
  const updateSection = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
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

    navigate("/hr/all-employees");
  };

  return (
    <div className="min-h-screen w-full px-2">
      <div className="w-full">
        <div className="w-full">

          {/* Stepper */}
          <CustomStepper
            steps={steps}
            activeStep={activeStep}
            onStepClick={handleStepClick}
          />


          {/* Active Step Content */}
          <div className="min-h-100 py-2">

            {/* Step 1 */}
            {activeStep === 0 && (
              <BasicInformation
                data={formData.basic}
                errors={validationErrors}
                onChange={(data) =>
                  updateSection("basic", data)
                }
              />
            )}

            {/* Step 2 */}
            {activeStep === 1 && (
              <ContactInfo
                data={formData.contact}
                errors={validationErrors}
                onChange={(data) =>
                  updateSection("contact", data)
                }
              />
            )}

            {/* Step 3 */}
            {activeStep === 2 && (
              <JobInfo
                data={formData.employment}
                errors={validationErrors}
                onChange={(data) =>
                  updateSection("employment", data)
                }
              />
            )}

            {/* Step 4 */}
            {activeStep === 3 && (
              <PayRollInfo
                data={formData.payroll}
                errors={validationErrors}
                onChange={(data) =>
                  updateSection("payroll", data)
                }
              />
            )}

            {/* Step 5 */}
            {activeStep === 4 && (
              <BankInfo
                data={formData.bank}
                errors={validationErrors}
                onChange={(data) =>
                  updateSection("bank", data)
                }
              />
            )}

            {/* Step 6 */}
            {activeStep === 5 && (
              <Education
                data={formData.education}
                errors={validationErrors}
                onChange={(data) =>
                  updateSection("education", data)
                }
              />
            )}

            {/* Step 7 */}
            {activeStep === 6 && (
              <ExperienceInfo
                data={formData.experience}
                errors={validationErrors}
                onChange={(data) =>
                  updateSection("experience", data)
                }
              />
            )}

            {/* Step 8 */}
            {activeStep === 7 && (
              <DocUpload
                data={formData.documents}
                errors={validationErrors}
                onChange={(data) =>
                  updateSection("documents", data)
                }
              />
            )}

            {/* Step 9 */}
            {/* {activeStep === 8 && (
              <AccessPermissions
                data={formData.access}
                errors={validationErrors}
                onChange={(data) =>
                  updateSection("access", data)
                }
              />
            )} */}

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