import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaComments, FaUser, FaPlus, FaBook } from 'react-icons/fa';
import './NavBar.css';

const NavBar = () => {
  const location = useLocation();

  // Check if the current path should hide the NavBar
  const hideNavBar = ['/login', '/register'].includes(location.pathname);

  if (hideNavBar) return null; // Don't render NavBar for these paths

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <FaBook className="navbar-icon-book" />
        <Link to="/home" className="navbar-title">StoryBox</Link>
      </div>
      <ul className="navbar-right">
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
          <Link to="/profile/" className="navbar-link">
            <FaUser className="navbar-icon" /> Profile
          </Link>
        </li>
        <li>
          <Link to="/addPost/" className="navbar-link">
            <FaPlus className="navbar-icon" /> Add Post
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
