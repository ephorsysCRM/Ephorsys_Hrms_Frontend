import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
    const location = useLocation();

    const { isAuthenticated, authChecked } = useSelector(
        (state) => state.auth
    );

    // Wait until authentication check is completed
    if (!authChecked) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // User is not authenticated
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/"
                replace
                state={{ from: location }}
            />
        );
    }

    // User is authenticated
    return <Outlet />;
};

export default ProtectedRoute;