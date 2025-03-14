import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaComments, FaUser } from 'react-icons/fa'; // Importing icons
import './NavBar.css';

const NavBar = () => {
  const location = useLocation();

  // Check if the current path should hide the NavBar
  const hideNavBar = [
    '/login',
    '/register',
    '/chat',
    '/profile/edit', // Adjust if necessary
  ].includes(location.pathname);

  if (hideNavBar) return null; // Don't render NavBar for these paths

  return (
    <nav className="navbar">
      <ul className="navbar-menu">
        <li>
          <Link to="/home" className="navbar-link">
            <FaHome className="navbar-icon" /> Home
          </Link>
        </li>
        <li>
          <Link to="/conversations" className="navbar-link">
            <FaComments className="navbar-icon" /> Conversations
          </Link>
        </li>
        <li>
          <Link to="/profile/1" className="navbar-link"> {/* Replace with actual user ID */}
            <FaUser className="navbar-icon" /> Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
