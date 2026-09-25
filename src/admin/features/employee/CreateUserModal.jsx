import React from "react";
import Stepper from "../../components/stepper/Stepper";
import { employeeSteps } from "./employeeSteps";

import BasicInfoStep from "./steps/BasicInfoStep";
import EmploymentStep from "./steps/EmploymentStep";
import RoleStep from "./steps/RoleStep";
import PayrollStep from "./steps/PayrollStep";
import AccessStep from "./steps/AccessStep";
import ReviewStep from "./steps/ReviewStep";

export default function CreateUserModal({
  role,
  onClose,
  onCreate,
}) {
  const [data, setData] = React.useState({
    name: "",
    email: "",
    phone: "",
    employeeId: "",
    joiningDate: "",
    employmentType: "",
    jobTitle: "",
    department: "",
    manager: "",
    location: "",
    salary: "",
    payroll: "",
    access: role,
    emailAccess: false,
    attendanceAccess: false,
  });

  const steps = [
    <BasicInfoStep data={data} setData={setData} />,
    <EmploymentStep data={data} setData={setData} />,
    <RoleStep data={data} setData={setData} />,
    <PayrollStep data={data} setData={setData} />,
    <AccessStep data={data} setData={setData} />,
    <ReviewStep data={data} />,
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
      <Stepper
        steps={employeeSteps}
        onCancel={onClose}
        onComplete={() => onCreate(data)}
      >
        {steps}
      </Stepper>
    </div>
  );
}