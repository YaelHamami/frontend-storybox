import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import AuthClient from "../services/auth-service"; // Import auth service

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await AuthClient.authLogout(); // Perform logout
      console.log("User logged out successfully!");
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button 
      className="btn p-0" 
      style={{ background: "none", border: "none", cursor: "pointer" }} 
      onClick={handleLogout}
      title="Logout"
    >
      <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-danger" size="lg" />
    </button>
  );
};

export default LogoutButton;
