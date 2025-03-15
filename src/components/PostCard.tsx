import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import ProfilePicture from "./ProiflePicture";
import { Post } from "../services/post-service";
import { addComment, fetchCommentsByPostId, Comment } from "../services/comments-service";
import defaultPhoto from "../assets/OIP.png";
import userService, { withUser } from "../services/user-service";
import { Link, useNavigate } from "react-router-dom";
import { addLike, removeLike } from "../services/like-service";

interface PostCardProps {
  post: Post;
  username: string;
  userImage?: string;
}

const formatDateTime = (date?: string | Date) => {
  if (!date) return "Unknown Date";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(date));
};

const PostCard = ({ post, username, userImage }: PostCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentsWithUsers, setcommentsWithUsers] = useState<(Comment & withUser)[]>([]);
  const [commentCount, setCommentCount] = useState(post.comment_count);
  const [isLiked, setIsLiked] = useState<boolean>(post.isLikedByMe);
  const [likeCount, setLikeCount] = useState<number>(post.like_count);
  const [showFullTags, setShowFullTags] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);
  const [showPostPopup, setShowPostPopup] = useState(false); // Added state for post popup

  const navigate = useNavigate();

  const toggleTags = () => setShowFullTags(!showFullTags);

  useEffect(() => {
    if (showModal) {
      fetchComments();
    }
  }, [showModal]);

  const fetchComments = async () => {
    try {
      const fetchedComments = await fetchCommentsByPostId(post._id).request;
      setComments(fetchedComments.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const updatedComments = await Promise.all(
        comments.map(async (comment: Comment) => {
          const userResponse = await userService.getUserById(comment.ownerId).request;
          return { ...comment, username: userResponse.data.userName, profile_picture_uri: userResponse.data.profile_picture_uri };
        })
      );
      setcommentsWithUsers(updatedComments);
    };

    fetchUsers();
  }, [comments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const addedComment = await addComment(post._id, newComment).request;
      setComments([...comments, addedComment.data]);
      setNewComment("");
      setCommentCount(commentCount + 1);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const myUser = await userService.getMe().request;
        setShowEditButton(myUser.data._id === post.ownerId);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLike = async () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount((prev) => Math.max(prev - 1, 0));

      try {
        await removeLike(post._id).request;
      } catch (error) {
        console.error("Error unliking post:", error);
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } else {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);

      try {
        await addLike(post._id).request;
      } catch (error) {
        console.error("Error liking post:", error);
        setIsLiked(false);
        setLikeCount((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  const openPostPopup = () => setShowPostPopup(true); // Open post content popup
  const closePostPopup = () => setShowPostPopup(false); // Close post content popup

  return (
    <>
      <div className="col-md-4 mb-3">
        <div className="card shadow-sm position-relative">
          {/* Post Header */}
          <div className="d-flex align-items-center justify-content-between px-3 py-2" style={{ backgroundColor: "#fff", borderBottom: "1px solid #ddd" }}>
            {/* Profile Picture & Username */}
            <Link to={`/profile/${post.ownerId}`} className="d-flex align-items-center text-decoration-none text-dark">
              <ProfilePicture imageUrl={userImage} size={25} />
              <strong className="ms-2">{username}</strong>
            </Link>

            {/* Three-Dot Menu (Aligned Right) */}
            {showEditButton && (
              <button
                className="btn p-0 ms-auto"
                style={{ background: "none", border: "none", cursor: "pointer" }}
                onClick={() => navigate(`/edit-post/${post._id}`)} // ✅ Navigate on click
              >
                <FontAwesomeIcon icon={faEllipsis} className="text-muted" size="lg" />
              </button>
            )}
          </div>

          {/* Post Image */}
          <div style={{ width: "100%", height: "200px", overflow: "hidden", backgroundColor: "#f0f0f0" }}>
            <img src={post.image_uri || defaultPhoto} alt="Post" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          {/* Post Content */}
          <div className="card-body">
            <p
              className="mb-1"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                minHeight: "48px",
              }}
              onClick={openPostPopup} // Open post content popup on click
            >
              <strong>{username}</strong> {post.content}
            </p>

            {/* Tags */}
            {post.tags?.length ? (
              <div
                className="mt-1 text-primary"
                style={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: showFullTags ? "unset" : 2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "pointer",
                  whiteSpace: showFullTags ? "normal" : "nowrap",
                }}
                onClick={openPostPopup} // Open post content popup on click of tags
              >
                {post.tags.map((tag, index) => (
                  <small key={index} className="me-2">#{tag}</small>
                ))}
              </div>
            ) : null}

            {/* Like & Comment Section */}
            <div className="d-flex align-items-center mt-2" style={{ gap: "15px" }}>
              <button className="btn d-flex align-items-center p-0" style={{ border: "none", background: "none", cursor: "pointer" }} onClick={handleLike}>
                <FontAwesomeIcon icon={faHeart} className={isLiked ? "text-danger me-1" : "text-muted me-1"} />
                <span>{likeCount}</span>
              </button>

              {/* Open Comments Popup Button */}
              <button className="btn d-flex align-items-center p-0" style={{ border: "none", background: "none", cursor: "pointer" }} onClick={() => setShowModal(true)}>
                <FontAwesomeIcon icon={faComment} className="me-1" />
                <span>{commentCount}</span>
              </button>
            </div>

            {/* Timestamp */}
            <small className="text-muted d-block mt-1">{formatDateTime(post.created_at)}</small>
          </div>
        </div>
      </div>

      {/* Post Content Popup */}
      {showPostPopup && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header">
                <h5 className="modal-title">Post Details</h5>
                <button className="btn-close" onClick={closePostPopup} />
              </div>

              {/* Modal Body - Content and Tags */}
              <div className="modal-body">
                <p><strong>{username}</strong></p>
                <p>{post.content}</p>
                <div className="mt-1 text-primary">
                  {post.tags?.map((tag, index) => (
                    <small key={index} className="me-2">#{tag}</small>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comment Popup (Modal) */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header">
                <h5 className="modal-title">Comments</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>

              {/* Modal Body - Comments List */}
              <div className="modal-body" style={{ maxHeight: "300px", overflowY: "auto" }}>
                {commentsWithUsers.length > 0 ? (
                  commentsWithUsers.map((comment) => (
                    <div key={comment._id} className="d-flex align-items-start mb-2">
                      <ProfilePicture imageUrl={comment.profile_picture_uri} size={30} />
                      <div className="ms-2 d-flex justify-content-between w-100">
                        <div>
                          <strong>{comment.username}</strong>
                          <p className="mb-0">{comment.content}</p>
                        </div>
                        <small className="text-muted" style={{ fontSize: "0.8rem", alignSelf: "flex-start" }}>
                          {formatDateTime(comment.created_at)}
                        </small>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">Be the first to write a comment!</p>
                )}
              </div>

              {/* Modal Footer - Add Comment */}
              <div className="modal-footer">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleAddComment}>Post</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;
