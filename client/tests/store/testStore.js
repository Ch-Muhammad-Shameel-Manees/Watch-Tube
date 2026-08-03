import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../src/store/authSlice";
import themeReducer from "../../src/store/themeSlice"

function createTestStore(preloadedState = {}) {
    return configureStore({
        reducer: {
            auth: authReducer,
            theme: themeReducer
        },
        preloadedState,
    });
}

export default createTestStore;