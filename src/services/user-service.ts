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

  export interface withUser {
    username: string
    profile_picture_uri: string;
  }

export const getAllUsers = () => {
    const abortController = new AbortController();
    const request = apiClient.get<IUser[]>('/users', { signal: abortController.signal })
    
    return { request, abort: () => abortController.abort() }
}

export const getUserById = (id: string) => {
  const abortController = new AbortController();
  const request = apiClient.get<IUser>(`/users/${id}`, { signal: abortController.signal });

  return { request, abort: () => abortController.abort() };
};

export const getMe = () => {
  const abortController = new AbortController();
  const request = apiClient.get<IUser>(`users/self/me`, { signal: abortController.signal });

  return { request, abort: () => abortController.abort() };
};


export const updateUser = (userId: string, updatedUserData: Partial<IUser>) => {
  console.log(`Updating user with ID: ${userId}`);
  
  const controller = new AbortController();
  const request = apiClient.put<IUser>(
    `/users/${userId}`,
    updatedUserData,
    {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Attach token
      },
    }
  );
  return { request, cancel: () => controller.abort() };
};

// Delete User by ID
export const deleteUser = (id: string) => {
  const abortController = new AbortController();
  const request = apiClient.delete<{ _id: string }>(`/users/${id}`, { signal: abortController.signal });

  return { request, abort: () => abortController.abort() };
};

export default { getAllUsers, getUserById, updateUser, deleteUser, getMe };