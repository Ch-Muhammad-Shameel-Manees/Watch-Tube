import { getByLabelText, render, screen } from '@testing-library/react'
import {LoginUser} from '../../src/components/User'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../../src/store/authSlice'
import { Provider } from 'react-redux'
import { describe, expect, it, test, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
vi.mock(import("../../src/services/userService"),  () => ({
          loginUser: vi.fn()
        }))

import { loginUser } from '../../src/services/userService'
import userEvent  from '@testing-library/user-event'

const queryClient = new QueryClient();

const store = configureStore({
    reducer: {
        auth: authReducer
    },
    preloadedState: {
        auth: {
            authStatus: false,
            user:{
                username: "Shameel"
            }
        }
    }
})

function renderLogin() {
    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <LoginUser />
            </Provider>
        </QueryClientProvider>
    )
}

describe("Login User", () => {
    it("should render the LoginUser component", () => {
        render(renderLogin())

        const loginText = screen.getAllByText(/login/i);

        expect(loginText[0]).toBeInTheDocument();
    })

    it("should fill the form and make the user login", async () => {

        vi.mocked(loginUser).mockResolvedValue({
            data:{
                username: "Ateeq"
            }
        })
        
        const user = userEvent.setup();

        render(renderLogin())

        const usernameInput = screen.getByPlaceholderText(/username/i, {exact: false});
        await user.type(usernameInput,"shameel12");

        await user.tab();
        await user.tab();

        await user.keyboard("thatsthething");

        const loginButton = screen.getByRole('button', {name: /login/i});
        await user.click(loginButton);

        expect(await screen.findByText(/successfully logged in/i, {exact: false})).toBeInTheDocument();

    })
})