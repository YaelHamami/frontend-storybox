import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import userService, { IUser } from "../services/user-service";
import postService, { Post } from "../services/post-service";
import BaseContainer from "../components/BaseContainer";
import UserProfileHeader from "../components/UserProfileHeader";
import PostCard from "../components/PostCard";

const UserProfile = () => {
  const { userId } = useParams<{ userId?: string }>();
  const [user, setUser] = useState<IUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch paginated posts
  const fetchPosts = async (pageNum: number, userId: string) => {
    if (!hasMore) return;

    try {
      setLoading(true);
      const postResponse = await postService.fetchPaginatedPosts(pageNum, userId).request;
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

  // Fetch User Data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        let userResponse;
        if (userId) {
          userResponse = await userService.getUserById(userId).request;
        } else {
          userResponse = await userService.getMe().request;
        }
        if (userResponse) {
          setUser(userResponse.data);
          fetchPosts(1, userResponse.data._id); // Pass the correct user ID
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserData();
  }, []);

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
    if (page > 1 && user) {
      fetchPosts(page, user._id);
    }
  }, [page, user]);

  return (
    <BaseContainer>
      {user && <UserProfileHeader user={user} />}

      <h4 className="mb-3">Posts</h4>

      {posts.length === 0 && !loading ? (
        <p className="text-center text-muted">This user hasn't posted anything yet.</p>
      ) : (
        <div className="row">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} username={user?.userName} userImage={user?.profile_picture_uri} />
          ))}
        </div>
      )}

      {loading && <p className="text-center text-muted">Loading posts...</p>}
    </BaseContainer>
  );
};

export default UserProfile;
