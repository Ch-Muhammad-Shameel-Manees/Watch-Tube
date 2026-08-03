import createTestStore from "../store/testStore";
import { Provider } from "react-redux";
import { AuthProvider } from "../../src/components/AuthProvider/AuthProvider";
import { describe, expect, it, vi } from "vitest";
import { getCurrentUser } from "../../src/services/userService";
import { data, MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";

vi.mock("../../src/services/userService", () => ({
    getCurrentUser: vi.fn()
}));

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

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AuthProvider>
                        <h1>Not logged in</h1>
                    </AuthProvider>
                </MemoryRouter>
            </Provider>
        );

        screen.debug()

        expect(await screen.findByRole("heading", { name: /not logged in/i })).toBeInTheDocument();
    });

    it("should render that the user is logged in", async () => {

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

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AuthProvider>
                        <h1>Logged in</h1>
                    </AuthProvider>
                </MemoryRouter>
            </Provider>
        );

        screen.debug()

        expect(await screen.findByRole("heading", { name: /logged in/i })).toBeInTheDocument();
    });
});