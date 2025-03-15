import apiClient, { CanceledError } from "./api-client";
import { IUser } from "./user-service";

export { CanceledError };

export interface IConversation {
    _id: string;
    participants: IUser[];
    messages?: IMessage[];
    lastMessage?: IMessage;
}

export interface IMessage {
    _id: string;
    senderId: string;
    text: string;
    timestamp: string;
    isRead: boolean;
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

// Delete a conversation by ID
export const deleteConversation = (conversationId: string) => {
    const abortController = new AbortController();
    const request = apiClient.delete(`/conversations/${conversationId}`, {
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

export const sendMessage = (conversationId: string, senderId: string, text: string) => {
    const abortController = new AbortController();
    const request = apiClient.post<IMessage>(
      `/conversations/${conversationId}/messages`,
      { senderId, text }, // ✅ Fix here: Correct field names
      {
        signal: abortController.signal,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  
    return { request, abort: () => abortController.abort() };
  };

export default { getConversations, getConversationById, startConversation, sendMessage, deleteConversation };
