import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import ProfilePicture from "./ProiflePicture";
import { IUser } from "../services/user-service";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";


interface UserProfileHeaderProps {
  user: IUser;
}

const UserProfileHeader = ({ user }: UserProfileHeaderProps) => {
  return (
    <div className="d-flex align-items-center justify-content-between mb-4 position-relative">
      <div className="d-flex align-items-center mb-4">
        <ProfilePicture imageUrl={user.profile_picture_uri} isConnected={user.is_connected} />

        <div style={{ marginLeft: "15px" }}>
          <h3 className="mb-1">{user.userName}</h3>
          <p className="text-muted">{user.email}</p>

          {/* Edit Profile Button */}
          {/* Edit Profile Button (Now Using Link for Navigation) */}
          <Link
            to={`/profile/${user._id}/edit`} // Redirects to Edit Profile Page
            className="btn btn-dark mt-2"
            style={{
              width: "130px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: "500",
              gap: "5px",
              textDecoration: "none",
              color: "white",
            }}
          >
            <FontAwesomeIcon icon={faEdit} />
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Logout Button Positioned in Upper Right */}
      <div style={{ position: "absolute", right: "20px", top: "10px" }}>
        <LogoutButton />
      </div>
    </div>
  );
};

export default UserProfileHeader;
