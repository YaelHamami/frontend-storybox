import { FC } from "react";

interface AuthButtonProps {
  label: string;
  type?: "button" | "submit";
}

const AuthButton: FC<AuthButtonProps> = ({ label, type = "submit" }) => (
  <button type={type} className="btn btn-primary w-100">{label}</button>
);

export default AuthButton;
