import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import createTestStore from '../store/testStore'
import { Provider } from 'react-redux'
import { ProtectedRoute } from '../../src/components'

describe("Protected Route", () => {
    it("should ask to login if authStatus is false is redux-store", () => {
        const store = createTestStore({
            auth: {
                authStatus: false,
                user: null
            }
        })

        render(
            <MemoryRouter>
                <Provider store={store}>
                    <ProtectedRoute />
                </Provider>
            </MemoryRouter>
        );

        expect(screen.getByText(/not logged in/i)).toBeInTheDocument();
    })

    it("should render the child component when user is logged in", () => {
        const store = createTestStore({
            auth: {
                authStatus: true,
                user: {
                    username: "Shameel"
                }
            }
        })

        render(
            <Provider store={store}>
                <MemoryRouter>
                        <Routes>
                            <Route path='/' element={ <ProtectedRoute /> } >
                                <Route index element={ <h1>User is logged in!</h1> } />
                            </Route>
                        </Routes>
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByRole('heading', {name: /logged in/i})).toBeInTheDocument();
    })
})