import { BrowserRouter, Routes } from "react-router-dom";
import AdminRoutes from "./admin.routes";
import HrRoutes from "./hr.routes";


const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {AdminRoutes}
                {HrRoutes}
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;