import apiClient from "./api-client";

export interface Comment {
  _id: string;
  postId: string;
  ownerId: string;
  content: string;
  created_at: Date;
  updated_at?: Date;
}


// Fetch a comment by postID
export const fetchCommentsByPostId = (id: string) => {
    console.log(`Fetching comments with PostID: ${id}`);
    const controller = new AbortController();
    const request = apiClient.get<Comment[]>(`/comments/?postId=${id}`, { signal: controller.signal });
  
    return { request, cancel: () => controller.abort() };
  };

  // Create a new comment
  export const addComment = (postId:string, comment: string) => {
    console.log("Creating a new comment...");
    const controller = new AbortController();
    const body = {
        postId: postId,
        content: comment
      }
    const request = apiClient.post<Comment>(`/comments/`, body, { signal: controller.signal });
  
    return { request, cancel: () => controller.abort() };
  };
  