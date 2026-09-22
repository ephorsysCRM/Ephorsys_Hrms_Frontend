
import { Route } from "react-router-dom";
import NotFound from "../NotFound";
import MainLayout from "../layout/MainLayout";
import Home from "../website/pages/Home";




const PublicRoutes = (
    <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        {/* <Route path="about" element={<About />} /> */}
        <Route path="*" element={<NotFound />} />

    </Route>
);

export default PublicRoutes;