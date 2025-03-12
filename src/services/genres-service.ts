import apiClient from "./api-client";

export const getGenres = async (text: string): Promise<string[]> => {
    try {
        const response = await apiClient.post("/genres", { text });
        return response.data;
    } catch (error) {
        console.error("Error fetching genres:", error);
        throw error;
    }
};
