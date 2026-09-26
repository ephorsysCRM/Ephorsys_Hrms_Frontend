import { useParams } from "react-router-dom";

const EmployeeProfile = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Employee Profile</h1>

      <p>Employee ID: {id}</p>
    </div>
  );
};

export default EmployeeProfile;