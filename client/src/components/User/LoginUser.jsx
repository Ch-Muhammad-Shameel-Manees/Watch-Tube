import React from 'react'
import { useForm } from 'react-hook-form';
import { Input, Button } from "../ui/index.js";
import { loginUser } from "../../services/userService.js";
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../../store/authSlice.js';
import { Container } from '../ui/index.js';

function LoginUser() {

const dispatch = useDispatch();

const { register, handleSubmit } = useForm();
const navigate = useNavigate();

const user = useSelector(state => state.auth.user);

const loginMutation = useMutation({
    mutationFn: loginUser
});

const onSubmit = async (data) => {
    const user = data ? {
        username: data.username || null,
        email: data.email || null,
        password: data.password, 
    } : null;

    if (user) {
        loginMutation.mutate({ 
                    username: user.username,
                    email: user.email,
                    password: user.password }, {
                    onSuccess: (loginResponse) => {
                        dispatch(login(loginResponse.data));
                        navigate("/");
                    },
                    
                    onError: (error) => {
                        console.error("Error logging in user:", error.response?.data);
                    }
            
                });
    }
}

if (loginMutation.isPending) {
    return (
        <div className="min-h-screen bg-gray-200 px-6 py-10 text-center text-gray-950 transition-colors duration-300 dark:bg-gray-950 dark:text-gray-200">
            Logging in user...
        </div>
    );
}

// if (authStatus) {
//     return (
//         <div className="min-h-screen bg-gray-200 px-6 py-10 text-center text-gray-950 transition-colors duration-300 dark:bg-gray-950 dark:text-gray-200">
//             <h1 className="text-xl font-semibold text-gray-950 dark:text-white">You are logged in!</h1>
//         </div>
//     )
// }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4 py-4 transition-colors duration-300 dark:bg-gray-950 sm:px-6 lg:px-8">
        <Container>
            <form onSubmit={handleSubmit(onSubmit)} className="mx-auto flex w-full max-w-xl flex-col gap-4 rounded-2xl border border-gray-300 bg-white/90 p-5 shadow-xl shadow-gray-300/50 dark:border-gray-800 dark:bg-gray-900/90 dark:shadow-black/30 sm:p-6 lg:p-8">
                <div className="mb-2 border-b border-gray-300 pb-4 dark:border-gray-800">
                    <h2 className="text-3xl font-semibold text-gray-950 dark:text-white">Login</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Welcome back! Sign in to continue.</p>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">You can use either email or username to sign in!</p>
                </div>
                <Input
                    label="Username"
                    className="rounded-xl border border-gray-700 bg-gray-800/80 px-4 py-3 text-white outline-none transition focus:border-red-500"
                    labelClassName="text-sm font-medium text-gray-300"
                    placeholder = "Enter your username"
                    {...register("username")}
                />
                <Input
                    label="Email"
                    type="email"
                    className="rounded-xl border border-gray-700 bg-gray-800/80 px-4 py-3 text-white outline-none transition focus:border-red-500"
                    labelClassName="text-sm font-medium text-gray-300"
                    placeholder = "Enter your email"
                    {...register("email")}
                />
                <Input
                    label="Password"
                    type="password"
                    className="rounded-xl border border-gray-700 bg-gray-800/80 px-4 py-3 text-white outline-none transition focus:border-red-500"
                    labelClassName="text-sm font-medium text-gray-300"
                    placeholder = "Enter your password"
                    {...register("password", { required: "Password is required" })}
                />
                <Button
                    type='submit'
                    className="mt-2 flex w-full items-center justify-center rounded-xl bg-gray-300 px-5 py-3 text-lg font-semibold text-gray-950 transition hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                    Login
                </Button>
                {loginMutation.error && (
                    <div className="text-sm text-red-500">
                        {loginMutation.error.response?.data?.message}
                    </div>
                )}  
            </form>
        </Container>
    </div>
  )
}

export default LoginUser