import { getByLabelText, render, screen } from '@testing-library/react'
import { LoginUser } from '../../src/components/User'
import createTestStore  from '../store/testStore.js';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
vi.mock(import("../../src/services/userService"),  () => ({
          loginUser: vi.fn()
        }))

import { loginUser } from '../../src/services/userService';
import userEvent  from '@testing-library/user-event';
import "@testing-library/jest-dom/vitest";
import { cleanup } from '@testing-library/react';

afterEach(() => {
    cleanup();
})


const MemoryRouterHelper = () => {
    return (
        <MemoryRouter initialEntries={["/login"]}>
            <Routes>
                <Route>
                    <Route path='/login' element={ <LoginUser /> } />
                    <Route path='/' element={ <h1>Logged in and redirected to homepage</h1> } />
                </Route>
            </Routes>
        </MemoryRouter>
    )
}

function renderLogin(queryClient, store) {
    return (
            <QueryClientProvider client={queryClient}>
                <Provider store={store}>
                    <MemoryRouterHelper />
                </Provider>
            </QueryClientProvider>
    )
}

describe("Login User", () => {
    it("should render the LoginUser component", () => {

        const queryClient = new QueryClient();

        const store = createTestStore({
            auth: {
                authStatus: false
            }
        })

        render(renderLogin(queryClient, store));

        const loginButton = screen.getByRole('button', {name: /login/i})

        expect(loginButton).toBeInTheDocument();
    })

    it("should fill the form and make the user login", async () => {

        vi.mocked(loginUser).mockResolvedValue({
            data:{
                username: "Shameel"
            }
        })
        
        const queryClient = new QueryClient();

        const store = createTestStore({
            auth: {
                authStatus: false
            }
        })

        render(renderLogin(queryClient, store));

        const user = userEvent.setup();

        const usernameInput = screen.getByPlaceholderText(/username/i, {exact: false});
        await user.type(usernameInput,"shameel12");

        await user.tab();
        await user.tab();

        await user.keyboard("thatsthething");

        const loginButton = screen.getByRole('button', {name: /login/i});
        await user.click(loginButton);

        expect(await screen.findByText(/redirected/i, {exact: false})).toBeInTheDocument();

    })
})