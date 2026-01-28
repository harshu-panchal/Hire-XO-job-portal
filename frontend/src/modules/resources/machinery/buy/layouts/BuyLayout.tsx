import { Outlet } from "react-router-dom";
import BuyNavbar from "../components/BuyNavbar";

const BuyLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-20">
            <div className="max-w-[430px] mx-auto px-6 pt-4 pb-24">
                <Outlet />
            </div>
            <BuyNavbar />
        </div>
    );
};

export default BuyLayout;
