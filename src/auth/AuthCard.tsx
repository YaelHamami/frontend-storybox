import { FC, ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const AuthCard: FC<AuthCardProps> = ({ children, title, subtitle }) => (
  <div className="card p-4 shadow" style={{ width: "350px" }}>
    <h2 className="text-center font-weight-bold mb-3">{title}</h2>
    {subtitle && <p className="text-center text-muted">{subtitle}</p>}
    {children}
  </div>
);

export default AuthCard;
