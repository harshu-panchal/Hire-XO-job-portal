import { Outlet } from "react-router-dom";
import SellNavbar from "../components/SellNavbar";

const SellLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
            <div className="max-w-[430px] mx-auto px-6 pt-4 pb-24">
                <Outlet />
            </div>
            <SellNavbar />
        </div>
    );
};

export default SellLayout;
