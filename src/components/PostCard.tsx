import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import ProfilePicture from "./ProiflePicture";
import { Post } from "../services/post-service";
import defaultPhoto from "../assets/OIP.png";

interface PostCardProps {
  post: Post;
  username: string;
  userImage?: string;
  showEditButton?: boolean;
}

const formatDateTime = (date?: string | Date) => {
  if (!date) return "Unknown Date";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long", // Full month name like "March"
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, 
  }).format(new Date(date));
};


const PostCard = ({ post, username, userImage, showEditButton }: PostCardProps) => {
  return (
    <div className="col-md-4 mb-3">
      <div className="card shadow-sm position-relative">
        
        {/* Post Header */}
        <div className="d-flex align-items-center px-3 py-2" style={{ backgroundColor: "#fff", borderBottom: "1px solid #ddd" }}>
          <ProfilePicture imageUrl={userImage} size={25} />
          <strong className="flex-grow-1">{username}</strong>

          {/* Three-Dot Menu */}
          {showEditButton && (
           <button className="btn p-0" style={{ background: "none", border: "none", cursor: "pointer" }}>
            <FontAwesomeIcon icon={faEllipsis} className="text-muted" size="lg" />
           </button>
          )}
        </div>

        {/* Post Image */}
        <div style={{ width: "100%", height: "200px", overflow: "hidden", backgroundColor: "#f0f0f0" }}>
          <img
            src={post.image_uri || defaultPhoto}
            alt="Post"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Post Content */}
        <div className="card-body">
          <p className="mb-1" style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            minHeight: "48px",
          }}>
            <strong>{username}</strong> {post.content}
          </p>

          {/* Tags */}
          {post.tags?.length ? (
            <div className="mt-1">
              {post.tags.map((tag, index) => (
                <small key={index} className="text-primary me-2">
                  #{tag}
                </small>
              ))}
            </div>
          ) : null}

          {/* Like & Comment Section */}
          <div className="d-flex align-items-center mt-2" style={{ gap: "15px" }}>
            <button className="btn d-flex align-items-center p-0" style={{ border: "none", background: "none", cursor: "pointer" }}>
              <FontAwesomeIcon icon={faHeart} className="text-danger me-1" />
              <span>{post.like_count}</span>
            </button>
            <span className="text-muted d-flex align-items-center">
              <FontAwesomeIcon icon={faComment} className="me-1" />
              <span>{post.comment_count}</span>
            </span>
          </div>

          {/* Timestamp */}
          <small className="text-muted d-block mt-1">
            {formatDateTime(post.created_at)}
          </small>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
