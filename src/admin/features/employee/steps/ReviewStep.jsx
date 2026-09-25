export default function ReviewStep({ data }) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">
        Review & Create
      </h2>

      <div className="space-y-2">
        <p><b>Name:</b> {data.name}</p>
        <p><b>Email:</b> {data.email}</p>
        <p><b>Phone:</b> {data.phone}</p>

        <p><b>Employee ID:</b> {data.employeeId}</p>
        <p><b>Joining Date:</b> {data.joiningDate}</p>
        <p><b>Employment Type:</b> {data.employmentType}</p>

        <p><b>Job Title:</b> {data.jobTitle}</p>
        <p><b>Department:</b> {data.department}</p>
        <p><b>Manager:</b> {data.manager}</p>

        <p><b>Location:</b> {data.location}</p>
        <p><b>Salary:</b> {data.salary}</p>
        <p><b>Payroll:</b> {data.payroll}</p>

        <p><b>Access:</b> {data.access}</p>
      </div>
    </div>
  );
}