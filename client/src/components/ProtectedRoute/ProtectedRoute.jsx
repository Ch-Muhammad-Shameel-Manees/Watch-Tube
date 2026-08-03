import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../../services/userService";
import { login } from "../../store/authSlice";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const authStatus = useSelector(state => state.auth.authStatus);

    if (!authStatus) {
        return <div className="flex items-center justify-center h-full mr-10">
            <div className="flex flex-col gap-6 items-center">
                <span className="text-xl text-red-400">You are not logged in!</span>                
                <div className="flex gap-3 items-center">
                    <span>Login to view content:</span>
                    <Link
                            to="/login"
                            className={`w-20 rounded-xl border px-1 py-3 text-center text-xl font-medium transition`}
                            >
                                Login
                    </Link> 
                </div>
                
            </div>
        </div>
    }

    return <Outlet />;
};

export default ProtectedRoute;