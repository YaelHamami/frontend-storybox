import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userService, { IUser } from "../services/user-service";
import postService, { Post } from "../services/post-service";
import BaseContainer from "../components/BaseContainer";
import UserProfileHeader from "../components/UserProfileHeader";
import PostCard from "../components/PostCard";
import { io } from "socket.io-client";
import conversationsService from "../services/conversations-service";

const socket = io(import.meta.env.VITE_API_URL); // Connect to backend

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null); // Fetch logged-in user

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userResponse = await userService.getUserById(userId!).request;
        setUser(userResponse.data);

        const postResponse = await postService.fetchPaginatedPosts(1, userId).request;
        setPosts(postResponse.data.posts);

        const loggedInUserResponse = await userService.getCurrentUser().request; // Get current user
        setCurrentUser(loggedInUserResponse.data);
      } catch (error) {
        console.error("Error fetching user profile or posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUserData();
  }, [userId]);

  const handleStartChat = async () => {
    if (!currentUser || !user) return;

    try {
      const response = await conversationsService.startConversation(userId!).request;
      const conversationId = response.data._id;

      socket.emit("join", conversationId); // Join chat room
      navigate(`/chat/${conversationId}`); // Redirect to chat page
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  return (
    <BaseContainer>
      {user && (
        <>
          <UserProfileHeader user={user} />
          {/* Chat Button */}
          {currentUser && currentUser._id !== user._id && (
            <button className="btn btn-primary mb-3" onClick={handleStartChat}>
              Message {user.userName}
            </button>
          )}
        </>
      )}

      <h4 className="mb-3">Posts</h4>

      {loading ? (
        <p className="text-center text-muted">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-muted">This user hasn't posted anything yet.</p>
      ) : (
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
