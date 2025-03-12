import apiClient from "./api-client";

export interface Post {
  _id: string;
  title: string;
  content: string;
  ownerId: string;
  image_uri?: string;
  created_at?: Date;
  tags?: string[];
  like_count?: number;
  comment_count?: number;
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
  
  // Create a new post
  export const createPost = (post: { content: string, image_uri: string }) => {
  console.log("Creating a new post...");
  const controller = new AbortController();

  const request = apiClient.post<Post>("/posts", post, {
    signal: controller.signal,
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2NmZTExNGVhMTI5Y2QzMjI2ZTAwM2IiLCJyYW5kb20iOiIwLjM1MDgzOTQzODkzNjAwOTY2IiwiaWF0IjoxNzQxNzkzOTYyLCJleHAiOjE3NDIzOTg3NjJ9.fgAam4GHn3maNF_xQhlhqadoI_dwSYnk--tC4nJLBkk`, // Pass JWT token here
      // Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass JWT token here
    }
  });

  return { request, cancel: () => controller.abort() };
};

  // Update an existing post by ID
  export const updatePost = (id: string, updatedPostData: Partial<Post>) => {
    console.log(`Updating post with ID: ${id}`);
    const controller = new AbortController();
    const request = apiClient.put<Post>(`/posts/${id}`, updatedPostData, { signal: controller.signal });
  
    return { request, cancel: () => controller.abort() };
  };
  
  // Delete a post by ID
  export const deletePost = (id: string) => {
    console.log(`Deleting post with ID: ${id}`);
    const controller = new AbortController();
    const request = apiClient.delete<{ _id: string }>(`/posts/${id}`, { signal: controller.signal });
  
    return { request, cancel: () => controller.abort() };
  };
  
export default { fetchPaginatedPosts, fetchPostById, createPost, updatePost, deletePost };

