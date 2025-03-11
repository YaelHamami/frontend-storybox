import avatar from "../assets/avatar.png";

interface ProfilePictureProps {
  imageUrl?: string;
  isConnected?: boolean;
  size?: number; // Default size, can be changed
}

const ProfilePicture = ({ imageUrl, isConnected, size = 120 }: ProfilePictureProps) => {
  return (
    <div className="position-relative d-inline-block">
      {/* Profile Image */}
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          overflow: "hidden",
          position: "relative",
          border: "3px solid white",
        }}
      >
        <img
          src={imageUrl || avatar}
          alt="Profile"
          className="w-100 h-100"
          style={{ objectFit: "cover", display: "block" }}
        />
      </div>

      {/* Status Indicator */}
      {isConnected !== undefined && (
        <span
          className="position-absolute"
          style={{
            width: "20px",
            height: "20px",
            backgroundColor: isConnected ? "#4CAF50" : "#FF3B30", // Green (Online) / Red (Offline)
            borderRadius: "50%",
            border: "3px solid white",
            bottom: "7%",
            right: "7%",
          }}
        ></span>
      )}
    </div>
  );
};

export default ProfilePicture;
