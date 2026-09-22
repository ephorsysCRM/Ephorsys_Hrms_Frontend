import { BrowserRouter, Routes } from "react-router-dom";
import AdminRoutes from "./admin.routes";
// import PublicRoutes from "./public.routes";


const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* {PublicRoutes} */}
                {AdminRoutes}
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;