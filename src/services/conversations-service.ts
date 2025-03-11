import apiClient, { CanceledError } from "./api-client";
import { IUser } from "./user-service";

export { CanceledError };

export interface IConversation {
    _id: string;
    participants: IUser[];
    messages: IMessage[];
}

export interface IMessage {
    _id: string;
    sender: IUser;
    content: string;
    timestamp: string;
}

// Get all conversations of the logged-in user
export const getConversations = () => {
    const abortController = new AbortController();
    const request = apiClient.get<IConversation[]>('/conversations', {
        signal: abortController.signal,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    return { request, abort: () => abortController.abort() };
};

// Get a single conversation by ID
export const getConversationById = (conversationId: string) => {
    const abortController = new AbortController();
    const request = apiClient.get<IConversation>(`/conversations/${conversationId}`, {
        signal: abortController.signal,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    return { request, abort: () => abortController.abort() };
};

// Start or get a conversation between two users
export const startConversation = (recipientId: string) => {
    const abortController = new AbortController();
    const request = apiClient.post<IConversation>('/conversations', { recipientId }, {
        signal: abortController.signal,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    return { request, abort: () => abortController.abort() };
};

// Send a message in a conversation
export const sendMessage = (conversationId: string, content: string) => {
    const abortController = new AbortController();
    const request = apiClient.post<IMessage>(`/conversations/${conversationId}/messages`, { content }, {
        signal: abortController.signal,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    return { request, abort: () => abortController.abort() };
};

export default { getConversations, getConversationById, startConversation, sendMessage };
