/* eslint-disable @typescript-eslint/no-empty-function */
import { showNotification } from '@mantine/notifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import React from 'react'
import { useNavigate, useNavigation } from 'react-router-dom'
import { url } from '../config/url'



const authDefaulValues: AuthContextProps = {

    login: () => { },
    logout: () => { },

    loading: false,
    isLoginLoading: false,

    isUserLoggingOut: false
}
interface AuthContextProps {

    login: (data: LoginTypes) => void,
    logout: () => void,

    loading: boolean,
    isLoginLoading: boolean,

    isUserLoggingOut: boolean
}
const AuthContext = React.createContext<AuthContextProps>(authDefaulValues)
export type User = {
    token: string,
    email: string,
    isRoot: boolean
}

export type LoginTypes = {
    email: string
    password: string
}

const useLogin = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    return useMutation(["IS/LOGIN"], async ({
        email,
        password,
    }: LoginTypes) => {
        const response = await axios.post(`${url}/api/v1/auth/admin/login`, {
            email,
            password,
        })
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("isRoot", response.data.isRoot)
        return response
    }, {
        onSuccess: () => {

            navigate("/dashboard")
        },
        onError: (error: AxiosError<{ message: string }>) => {
            showNotification({
                title: "Error",
                message: error.response?.data.message || "An error occurred while signing in",
            })
        }
    })
}
const useLogout = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    return useMutation(["IS/LOGOUT"], async () => {
        const response = await axios.post(`${url}/logout`, {}, {
            withCredentials: true
        })
        return response
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries(["IS/USER"])
            navigate("/")
        },
        onError: (error: AxiosError<{ message: string }>) => {
            showNotification({
                title: "Error",
                message: error.response?.data.message || "An error occurred while signing in",
            })
        }
    })
}


export const useAuthProvider = () => {
    return React.useContext(AuthContext)
};
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { mutate: login, isLoading: isLoginLoading, isError: isErrorLoading, error: loginError } = useLogin()

    const { mutate: logout, isLoading: isUserLoggingOut, isError: isUserLogoutError, error: logoutError } = useLogout()


    return (
        <AuthContext.Provider value={{

            login,
            logout,
            loading: isLoginLoading || isUserLoggingOut,
            isLoginLoading,

            isUserLoggingOut
        }}>
            {children}
        </AuthContext.Provider>
    )
}
