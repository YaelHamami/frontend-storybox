import { useEffect, useState } from "react";
import postService, { Post } from "../services/post-service";
import BaseContainer from "../components/BaseContainer";
import PostCard from "../components/PostCard";
import userService from "../services/user-service";

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsWithUsers, setPostsWithUsers] = useState([]);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const postResponse = await postService.fetchPaginatedPosts(1).request;
        setPosts(postResponse.data.posts);
      } catch (error) {
        console.error("Error fetching user profile or posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const updatedPosts = await Promise.all(
        posts.map(async (post) => {
          const userResponse = await userService.getUserById(post.ownerId).request;
          return { ...post, username: userResponse.data.userName, userImage: userResponse.data.profile_picture_uri };
        })
      );
      setPostsWithUsers(updatedPosts);
    };

    fetchUsers();
  }, [posts]);

  return (
    <BaseContainer>
    
    <h4 className="mb-3 text-center">Home Page</h4>

      {/* Show loading message while fetching */}
      {loading ? (
        <p className="text-center text-muted">Loading posts...</p>
      ) : posts.length === 0 ? (
        /* If no posts exist, show this message */
        <p className="text-center text-muted">This user hasn't posted anything yet.</p>
      ) : (
        /* If posts exist, display them */
        <div className="row">
          {postsWithUsers.map(post => (
            <PostCard key={post._id} post={post} username={post!.username} userImage={post!.profile_picture_uri}/>
          ))}
        </div>
      )}
    </BaseContainer>
  );
};

export default HomePage;
