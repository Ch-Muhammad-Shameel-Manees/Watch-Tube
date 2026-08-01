import React from 'react'
import { useForm } from 'react-hook-form';
import { Input, Button } from "../ui/index.js";
import { registerUser, loginUser } from "../../services/userService.js";
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/authSlice.js';
import { Container } from '../ui/index.js';

function RegisterUser() {

const { register, handleSubmit } = useForm();

const navigate = useNavigate();
const dispatch = useDispatch();
const theme = useSelector((state) => state.theme.theme);

const registerMutation = useMutation({
    mutationFn: registerUser
});

const loginMutation = useMutation({
    mutationFn: loginUser
});

const onSubmit = async (data) => {
    const user = data ? {
        username: data.username,
        email: data.email,
        fullName: data.fullName,
        password: data.password,
        avatar: data.avatar?.[0],
        coverImage: data.coverImage?.[0]
    } : null;

    console.log("User data to be registered:", user);

    if (user) {
        registerMutation.mutate(user, {
            onSuccess: (response) => {
                loginMutation.mutate({ username: user.username, password: user.password }, {
                    onSuccess: (loginResponse) => {
                        console.log("User logged in successfully:", loginResponse);
                        dispatch(login(loginResponse.data.username));
                        navigate("/");
                        window.location.reload();
                    },
                    onError: (error) => {
                        console.error("Error logging in user:", error.response?.data);
                    }
                });
            },
            onError: (error) => {
                console.error("Error registering user:", error.response?.data);
            }
        });
    }
}

if (loginMutation.isPending) {
    return <div>Logging in user...</div>;
}

if (registerMutation.error) {
    return <div>Error registering user: {registerMutation.error.response?.data?.message}</div>;
}

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-4 transition-colors duration-300 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-200'}`}>
        <Container>
            <form onSubmit={handleSubmit(onSubmit)} className={`mx-auto w-full max-w-2xl rounded-2xl border p-5 shadow-xl sm:p-6 lg:p-8 ${theme === 'dark' ? 'border-gray-800 bg-gray-900/90 shadow-black/30' : 'border-gray-300 bg-white shadow-gray-200'}`}>
                <div className={`mb-6 border-b pb-4 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-300'}`}>
                    <h2 className={`text-3xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-950'}`}>Create an account</h2>
                    <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Join the platform and start sharing your videos.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <Input
                        label="Username"
                        className={`rounded-xl border px-4 py-3 outline-none transition focus:border-red-500 ${theme === 'dark' ? 'border-gray-700 bg-gray-800/80 text-white' : 'border-gray-300 bg-gray-100 text-gray-950'}`}
                        labelClassName={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                        {...register("username", { required: "Username is required" })}
                    />
                    <Input
                        label="Email"
                        type="email"
                        className={`rounded-xl border px-4 py-3 outline-none transition focus:border-red-500 ${theme === 'dark' ? 'border-gray-700 bg-gray-800/80 text-white' : 'border-gray-300 bg-gray-100 text-gray-950'}`}
                        labelClassName={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                        {...register("email", { required: "Email is required" })}
                    />
                    <Input
                        label="Full Name"
                        type="text"
                        className={`rounded-xl border px-4 py-3 outline-none transition focus:border-red-500 ${theme === 'dark' ? 'border-gray-700 bg-gray-800/80 text-white' : 'border-gray-300 bg-gray-100 text-gray-950'}`}
                        labelClassName={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                        {...register("fullName", { required: "Full Name is required" })}
                    />
                    <Input
                        label="Password"
                        type="password"
                        className={`rounded-xl border px-4 py-3 outline-none transition focus:border-red-500 ${theme === 'dark' ? 'border-gray-700 bg-gray-800/80 text-white' : 'border-gray-300 bg-gray-100 text-gray-950'}`}
                        labelClassName={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                        {...register("password", { required: "Password is required" })}
                    />
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <Input
                        label="Avatar"
                        type="file"
                        className={`rounded-xl border px-3 py-3 file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold ${theme === 'dark' ? 'border-gray-700 bg-gray-800/80 text-white file:bg-gray-700 file:text-gray-100' : 'border-gray-300 bg-gray-100 text-gray-950 file:bg-gray-300 file:text-gray-800'}`}
                        labelClassName={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                        {...register("avatar", { required: "Avatar is required" })}
                    />
                    <Input
                        label="Cover Image"
                        type="file"
                        className={`rounded-xl border px-3 py-3 file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold ${theme === 'dark' ? 'border-gray-700 bg-gray-800/80 text-white file:bg-gray-700 file:text-gray-100' : 'border-gray-300 bg-gray-100 text-gray-950 file:bg-gray-300 file:text-gray-800'}`}
                        labelClassName={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                        {...register("coverImage")}
                    />
                </div>
                <Button
                    type='submit'
                    className={`mt-6 flex w-full items-center justify-center rounded-xl px-5 py-3 text-lg font-semibold transition  ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-300 text-gray-950 hover:bg-gray-400'}`}
                    disabled={registerMutation.isPending ? true : false}
                >
                    {registerMutation.isPending ? "Registering..." : "Register"}
                </Button>
            </form>
        </Container>
    </div>
  )
}

export default RegisterUser