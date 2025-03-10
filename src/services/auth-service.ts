import { CredentialResponse } from "@react-oauth/google";
import apiClient from "./api-client";
import { IUser } from './user-service'

export interface RegistrationResponseData {
    _id: string;
    userName: string;
    password: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone_number?: string;
    date_of_birth?: Date;
    date_joined?: Date;
    profile_picture_uri?: string;
    is_connected?: boolean;
    gender?: string;
}

export interface RegisterData {
    userName: string;
    password: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone_number?: string;
    date_of_birth?: Date;
    date_joined?: Date;
    profile_picture_uri?: string;
    is_connected?: boolean;
    gender?: string;
    refreshToken?: string[];
}

export interface LoginResponseData {
    _id: string;
    accessToken: string;
    refreshToken: string;
}

export interface LoginData{
    email: string;
    password: string;
}

export const authLogin = async (login: LoginData) => {
    console.log("Auth Login");

    try {
        const response = await apiClient.post<LoginResponseData>("/auth/login", login);
        
        if (response.data.accessToken && response.data.refreshToken) {
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
        }

        return response.data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

export const authRegister = async (registration: RegisterData) => {
    console.log("Auth Registration");

    try {
        const response = await apiClient.post<RegistrationResponseData>("/auth/register", registration);
        return response.data;
        
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
};

export const googleSignin = (credentialResponse: CredentialResponse) => {
    return new Promise<IUser>((resolve, reject) => {
        console.log("Google Signin Payload:", { credential: credentialResponse });

        if (!credentialResponse.credential) {
            console.error("Google Signin Error: No credential received.");
            reject("Missing Google credential");
            return;
        }

        apiClient
            .post("/auth/google", { credential: credentialResponse.credential })
            .then((response) => {
                console.log("Google Signin Response:", response);

                if (response.data.accessToken && response.data.refreshToken) {
                    localStorage.setItem("accessToken", response.data.accessToken);
                    localStorage.setItem("refreshToken", response.data.refreshToken);
                }

                resolve(response.data);
            })
            .catch((error) => {
                console.log("Google Signin Error:", error);
                reject(error);
            });
    });
};



export default { authRegister, authLogin, googleSignin };
