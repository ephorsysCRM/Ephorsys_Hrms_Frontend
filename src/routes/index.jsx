import { BrowserRouter, Routes } from "react-router-dom";
import AdminRoutes from "./admin.routes";


const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {AdminRoutes}
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;