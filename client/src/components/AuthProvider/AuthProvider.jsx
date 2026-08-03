import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../../services/userService";
import { login } from "../../store/authSlice";
import Layout from "../../Layout";

export const AuthProvider = ({ children }) => {
    const authStatus = useSelector(state => state.auth.authStatus);

    const dispatch = useDispatch();

    useEffect(() => {
        const checkAuth = async () => {
            if (authStatus) return;

            try {
                const response = await getCurrentUser();
                dispatch(login(response.data));
            } catch (error) {
                console.log(error);
            }
        };

        checkAuth();
    }, [authStatus, dispatch]);

    return <Layout>{children}</Layout>;
};