import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import userService, { IUser } from "../services/user-service";
import postService, { Post } from "../services/post-service";
import BaseContainer from "../components/BaseContainer";
import UserProfileHeader from "../components/UserProfileHeader";
import PostCard from "../components/PostCard";

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<IUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userResponse = await userService.getUserById(userId!).request;
        setUser(userResponse.data);
        const postResponse = await postService.fetchPaginatedPosts(1, userId).request;
        setPosts(postResponse.data.posts);
      } catch (error) {
        console.error("Error fetching user profile or posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUserData();
  }, [userId]);

  return (
    <BaseContainer>
      {user && <UserProfileHeader user={user} />}
      
      <h4 className="mb-3">Posts</h4>

      {/* Show loading message while fetching */}
      {loading ? (
        <p className="text-center text-muted">Loading posts...</p>
      ) : posts.length === 0 ? (
        /* If no posts exist, show this message */
        <p className="text-center text-muted">This user hasn't posted anything yet.</p>
      ) : (
        /* If posts exist, display them */
        <div className="row">
          {posts.map(post => (
            <PostCard key={post._id} post={post} username={user!.userName} userImage={user!.profile_picture_uri} />
          ))}
        </div>
      )}
    </BaseContainer>
  );
};

export default UserProfile;
