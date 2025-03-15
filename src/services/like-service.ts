import apiClient from "./api-client";

// Add a like to a post
export const addLike = (postId: string) => {
    console.log("Liking post...");
    const controller = new AbortController();
    const body = { postId };
    const request = apiClient.post(`/likes/`, body, { signal: controller.signal });
  
    return { request, cancel: () => controller.abort() };
  };
  
  // Remove a like from a post
  export const removeLike = (postId: string) => {
    console.log("Unliking post...");
    const controller = new AbortController();
    const request = apiClient.delete(`/likes/${postId}`, { signal: controller.signal });
  
    return { request, cancel: () => controller.abort() };
  };
  