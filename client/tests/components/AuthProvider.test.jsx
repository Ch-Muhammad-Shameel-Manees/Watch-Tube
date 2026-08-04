import createTestStore from "../store/testStore";
import { Provider } from "react-redux";
import { AuthProvider } from "../../src/components/AuthProvider/AuthProvider";
import { describe, expect, it, vi } from "vitest";
import { getCurrentUser } from "../../src/services/userService";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest"

vi.mock("../../src/services/userService", () => ({
    getCurrentUser: vi.fn()
}));

function renderAuthProvider(elementToRender, store) {
    return (
        <Provider store={store}>
            <MemoryRouter>
                <Routes>
                    <Route path='/' element={ <AuthProvider /> }>
                        <Route index element={ elementToRender }/>
                    </Route>
                </Routes>
            </MemoryRouter>
        </Provider>
    )
}

describe("Auth Provider", () => {
    it("should render that the user is not logged in", async () => {

        const store = createTestStore({
            auth:{
                authStatus: false,
                user: null
            }
        })

        vi.mocked(getCurrentUser).mockRejectedValue(
            new Error("Unauthorized Request")
        );

        const notLoggedInElement = <h1>Not logged in!</h1>

        render(renderAuthProvider(notLoggedInElement, store));

        const notLoggedInHeading = await screen.findByRole("heading", { name: /not logged in/i })

        expect(notLoggedInHeading).toBeInTheDocument();
    });

    it("should render that the user is logged in by calling the getCurrentUser function", async () => {

        const store = createTestStore({
            auth:{
                authStatus: false,
                user: null
            }
        })

        vi.mocked(getCurrentUser).mockResolvedValue({
            data: {
                username: "Shameel"
            }
        });

        const loggedInElement = <h1>Logged in!</h1>

        render(renderAuthProvider(loggedInElement, store));

        const loggedInHeading = screen.getByRole('heading', {name: /logged in/i});
        
        expect(loggedInHeading).toBeInTheDocument();
    });

    it("should render that the user is logged in using the state of redux store", async () => {

        const store = createTestStore({
            auth:{
                authStatus: true,
                user: {
                    username: "Shameel"
                }
            }
        })

        const loggedInElement = <h1>Logged in!</h1>

        render(renderAuthProvider(loggedInElement, store));

        const loggedInHeading = await screen.findByRole('heading', {name: /logged in/i});
        
        expect(loggedInHeading).toBeInTheDocument();
    });
});