import { FC, FormEventHandler } from "react";

interface AuthFormProps {
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: React.ReactNode;
}

const AuthForm: FC<AuthFormProps> = ({ onSubmit, children }) => (
  <form className="d-flex justify-content-center align-items-center min-vh-100 bg-light" onSubmit={onSubmit}>
    {children}
  </form>
);

export default AuthForm;
