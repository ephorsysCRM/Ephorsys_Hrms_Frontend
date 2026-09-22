import { useEffect } from "react";
import { useDispatch } from "react-redux";

import AppRoutes from "./routes";
import { restoreAdminSession } from "./Redux/features/auth/authThunk";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreAdminSession());
  }, [dispatch]);

  return (
    <div>
      <AppRoutes />
    </div>
  );
};

export default App;