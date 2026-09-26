import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomStepper from "../components/stepper/CustomStepper";
import BasicInformation from "../components/steps/BasicInfo";
import AccessPermissions from "../components/steps/AccessPermission";
import ContactInfo from "../components/steps/ContactInfo";
import BankInfo from "../components/steps/BankInfo";
import Education from "../components/steps/Education";
import ExperienceInfo from "../components/steps/ExperienceInfo";
import DocUpload from "../components/steps/DocUpload";
import JobInfo from "../components/steps/JobInfo";
import PayRollInfo from "../components/steps/PayRollInfo";


export default function AddEmployee() {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState({
    basic: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      address: "",
    },

    employment: {
      employeeId: "",
      department: "",
      designation: "",
      joiningDate: "",
      employmentType: "",
      experience: "",
    },

    role: {
      accountType: "",
      reportingManager: "",
      team: "",
      role: "",
      responsibilities: "",
    },

    payroll: {
      workLocation: "",
      payrollFrequency: "",
      basicSalary: "",
      allowances: "",
      deductions: "",
      bankAccount: "",
      bankName: "",
      ifsc: "",
    },

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
    {
      title: "Basic Information",
    },
    {
      title: "Employment Details",
    },
    {
      title: "Role & Reporting",
    },
    {
      title: "Work & Payroll Details",
    },
    {
      title: "Access & Permissions",
    },
    {
      title: "Review & Create",
    },
  ];

  const updateSection = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const nextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const previousStep = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const createEmployee = () => {
    console.log("Employee Data:", formData);

    // API call goes here
    // await createEmployee(formData);

    alert("Employee created successfully!");

    navigate("/employees");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="w-full">

        {/* Header */}
        
        {/* Main Card */}
        <div className="rounded-xl bg-white p-6 shadow-sm ">

          {/* Stepper */}
          <CustomStepper
            steps={steps}
            activeStep={activeStep}
            onStepClick={setActiveStep}
          />

          <div className="my-6 border-t border-gray-200" />

          {/* Step Content */}
          <div className="min-h-100">

            {activeStep === 0 && (
              <BasicInformation
                data={formData.basic}
                onChange={(data) =>
                  updateSection("basic", data)
                }
              />
            )}

            {activeStep === 1 && (
              <ContactInfo
                data={formData.employment}
                onChange={(data) =>
                  updateSection("employment", data)
                }
              />
            )}

            {activeStep === 2 && (
              <JobInfo
                data={formData.role}
                onChange={(data) =>
                  updateSection("role", data)
                }
              />
            )}

            {activeStep === 3 && (
              <PayRollInfo
                data={formData.payroll}
                onChange={(data) =>
                  updateSection("payroll", data)
                }
              />
            )}

            {activeStep === 4 && (
              <BankInfo
                data={formData.access}
                onChange={(data) =>
                  updateSection("access", data)
                }
              />
            )}

            {activeStep === 5 && (
              <Education
                formData={formData}
              />
            )}
            <ExperienceInfo/>
            <DocUpload/>
            <AccessPermissions/>
          </div>

          {/* Footer Buttons */}
          <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-5">

            <button
              type="button"
              onClick={previousStep}
              disabled={activeStep === 0}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>

            {activeStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
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