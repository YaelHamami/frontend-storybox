import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import ProfilePicture from "./ProiflePicture";
import userService, { IUser } from "../services/user-service";
import { Link } from "react-router-dom";
import LogoutButton from "./LogOutButton";
import { useEffect, useState } from "react";

interface UserProfileHeaderProps {
  user: IUser;
}

const UserProfileHeader = ({ user }: UserProfileHeaderProps) => {
  const [showEditButton, setShowEditButton] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const myUser = await userService.getCurrentUser().request;
        setShowEditButton(myUser.data._id === user._id);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="d-flex align-items-center justify-content-between mb-4 position-relative">
      <div className="d-flex align-items-center mb-4">
        <ProfilePicture imageUrl={user.profile_picture_uri} isConnected={user.is_connected} />

        <div style={{ marginLeft: "15px" }}>
          <h3 className="mb-1">{user.userName}</h3>
          <p className="text-muted">{user.email}</p>

          {/* Show Edit Profile Button only if showEditButton is true */}
          {showEditButton && (
            <Link
              to={`/profile/${user._id}/edit`}
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
          )}
        </div>
      </div>

      {/* Show Logout Button only if showEditButton is true */}
      {showEditButton && (
        <div style={{ position: "absolute", right: "20px", top: "10px" }}>
          <LogoutButton />
        </div>
      )}
    </div>
  );
};

export default UserProfileHeader;
