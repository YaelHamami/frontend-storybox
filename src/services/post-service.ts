import apiClient from "./api-client";
import { getGenres } from "./genres-service";

export interface Post {
  _id: string;
 // title?: string;
  content: string;
  ownerId: string;
  image_uri?: string;
  created_at?: Date;
  tags?: string[];
  like_count: number;
  comment_count: number;
  isLikedByMe: boolean; 
}

export interface PaginatedPostsResponse {
  posts: Post[];
  currentPage: number;
  totalPages: number;
}

//Fetch paginated posts (10 per request) or panging by userId
const fetchPaginatedPosts = (page: number, sender?: string) => {
  console.log(`Fetching posts for page ${page}`);
  const controller = new AbortController();

  const url = sender 
  ? `/posts/paging?page=${page}&sender=${sender}` 
  : `/posts/paging?page=${page}`;

  const request = apiClient.get<PaginatedPostsResponse>(
    url,
    { signal: controller.signal }
  );

  return { request, cancel: () => controller.abort() };
};

// Fetch a post by ID
export const fetchPostById = (id: string) => {
    console.log(`Fetching post with ID: ${id}`);
    const controller = new AbortController();
    const request = apiClient.get<Post>(`/posts/${id}`, { signal: controller.signal });
  
    return { request, cancel: () => controller.abort() };
  };


// Create a new post with auto-generated tags
export const createPost = async (post: { content: string; image_uri: string }) => {
  console.log("Generating tags and creating a new post...");
  const controller = new AbortController();

  try {
    // Fetch genres for the post content
    const tags = await getGenres(post.content);
    
    const request = apiClient.post<Post>("/posts", { ...post, tags }, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass JWT token here
      }
    });

    return { request, cancel: () => controller.abort() };
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

  // Update an existing post by ID
  export const updatePost = async (id: string, updatedPostData: Partial<Post>) => {
    console.log(`Updating post with ID: ${id}`);
    const controller = new AbortController();

    try {
      // Fetch genres for the post content
      if(updatedPostData.content){
        const tags = await getGenres(updatedPostData.content);
        updatedPostData.tags = tags
      }
    
      const request = apiClient.put<Post>(`/posts/${id}`, updatedPostData, { signal: controller.signal });
      return { request, cancel: () => controller.abort() };

    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  
  };
  
  // Delete a post by ID
  export const deletePost = (id: string) => {
    console.log(`Deleting post with ID: ${id}`);
    const controller = new AbortController();
    const request = apiClient.delete<{ _id: string }>(`/posts/${id}`, { signal: controller.signal });
  
    return { request, cancel: () => controller.abort() };
  };
  
export default { fetchPaginatedPosts, fetchPostById, createPost, updatePost, deletePost };

