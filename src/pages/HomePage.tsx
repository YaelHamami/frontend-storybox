import { useEffect, useState, useCallback } from "react";
import postService, { Post } from "../services/post-service";
import BaseContainer from "../components/BaseContainer";
import PostCard from "../components/PostCard";
import userService, { withUser } from "../services/user-service";

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [postsWithUsers, setPostsWithUsers] = useState<(Post & withUser)[]>([]);

  // Fetch posts based on page number
  const fetchPosts = async (pageNum: number) => {
    if (!hasMore) return;

    try {
      setLoading(true);
      const postResponse = await postService.fetchPaginatedPosts(pageNum).request;
      const newPosts = postResponse.data.posts;

      if (newPosts.length === 0) {
        setHasMore(false);
        return;
      }

      setPosts((prev) => [...prev, ...newPosts]);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users for each post
  const fetchUsers = async (newPosts: Post[]) => {
    const updatedPosts = await Promise.all(
      newPosts.map(async (post) => {
        const userResponse = await userService.getUserById(post.ownerId).request;
        return { ...post, username: userResponse.data.userName, profile_picture_uri: userResponse.data.profile_picture_uri };
      })
    );

    setPostsWithUsers((prev) => [...prev, ...updatedPosts]);
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      fetchUsers(posts.slice(postsWithUsers.length));
    }
  }, [posts]);

  // Infinite Scroll Handler
  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 10) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page]);

  return (
    <BaseContainer>
      {postsWithUsers.length === 0 && !loading ? (
        <p className="text-center text-muted">This user hasn't posted anything yet.</p>
      ) : (
        <div className="row">
          {postsWithUsers.map((post) => (
            <PostCard key={post._id} post={post} username={post.username} userImage={post.profile_picture_uri} />
          ))}
        </div>
      )}

      {loading && <p className="text-center text-muted">Loading posts...</p>}
    </BaseContainer>
  );
};

export default HomePage;
