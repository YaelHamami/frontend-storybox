import apiClient, { CanceledError } from "./api-client";

export { CanceledError }

export interface IUser {
    _id?: string;
    userName: string;
    password?: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    phone_number?: string | null;
    date_of_birth?: Date | null;
    date_joined?: Date | null;
    profile_picture_uri?: string;
    is_connected?: boolean;
    provider?: string | null;
    gender?: string | null;
    refreshToken?: string[];
  }

export const getAllUsers = () => {
    const abortController = new AbortController();
    const request = apiClient.get<IUser[]>('/users', { signal: abortController.signal })
    return { request, abort: () => abortController.abort() }
}