import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { login, logout, selectUser } from "../../src/store/authSlice";
import authReducer from '../../src/store/authSlice';

describe("Auth Reducer", () => {
    it("Should save the user authStatus to true and return the user details", () => {
        const initialState = {
            authStatus: false,
            user: null
        }

        const auth = authReducer(
            initialState,
            login({
                username: "Shameel",
                age: 15
            }) 
        )

        expect(auth.user).toMatchObject({username: "Shameel", age: 15})

        expect(auth.authStatus).toBeTruthy();
    }),
    it("should return the selected user in the state", () => {
        const state = {
            auth: {
                user: {
                    name: "Shameel"
                }
            }
        }

        const user = selectUser(state);

        expect(user).toEqual({name: "Shameel"})
    })

    
})