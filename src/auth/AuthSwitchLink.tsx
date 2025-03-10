import { FC } from "react";
import { Link } from "react-router-dom"; // Ensure you have React Router installed

interface AuthSwitchLinkProps {
  text: string;
  linkText: string;
  to: string;
}

const AuthSwitchLink: FC<AuthSwitchLinkProps> = ({ text, linkText, to }) => (
  <p className="text-center mt-3">
    {text}{" "}
    <Link to={to} className="text-primary" style={{ textDecoration: "none", fontWeight: "600"}}>
      {linkText}
    </Link>
  </p>
);

export default AuthSwitchLink;
