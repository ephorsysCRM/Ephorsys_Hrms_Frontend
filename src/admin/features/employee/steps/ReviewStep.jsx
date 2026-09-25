export default function ReviewStep({ data }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">
          Review & Create
        </h2>

        <p className="text-sm text-gray-500">
          Review all details and create the account
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-lg border p-4 sm:grid-cols-2">
        <p>
          <b>Name:</b>{" "}
          {data.firstName} {data.lastName}
        </p>

        <p>
          <b>Email:</b> {data.email}
        </p>

        <p>
          <b>Phone:</b> {data.phone}
        </p>

        <p>
          <b>Employee ID:</b> {data.id}
        </p>

        <p>
          <b>Department:</b> {data.department}
        </p>

        <p>
          <b>Designation:</b> {data.designation}
        </p>

        <p>
          <b>Joining Date:</b> {data.joiningDate}
        </p>

        <p>
          <b>Role:</b> {data.role}
        </p>

        <p>
          <b>Manager:</b> {data.manager}
        </p>

        <p>
          <b>Team:</b> {data.team}
        </p>

        <p>
          <b>Work Location:</b> {data.workLocation}
        </p>

        <p>
          <b>Employment Type:</b> {data.employmentType}
        </p>

        <p>
          <b>Salary:</b> {data.salary}
        </p>

        <p>
          <b>Pay Frequency:</b> {data.payFrequency}
        </p>

        <p>
          <b>Login Email:</b> {data.loginEmail}
        </p>

        <p>
          <b>System Access:</b> {data.systemAccess}
        </p>
      </div>
    </div>
  );
}