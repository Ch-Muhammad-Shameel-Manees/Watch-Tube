import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("theme") || "light";
};

const initialState = {
    theme: getInitialTheme()
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
            if (typeof window !== "undefined") {
                localStorage.setItem("theme", action.payload);
            }
        },
        toggleTheme: (state) => {
            const nextTheme = state.theme === "dark" ? "light" : "dark";
            state.theme = nextTheme;
            if (typeof window !== "undefined") {
                localStorage.setItem("theme", nextTheme);
            }
        }
    }
});

export const { setTheme, toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
