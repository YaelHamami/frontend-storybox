import { FC } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface AuthInputProps {
  type: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: string;
}

const AuthInput: FC<AuthInputProps> = ({ type, placeholder, register, error }) => (
  <div className="mb-3">
    <input
      type={type}
      placeholder={placeholder}
      className={`form-control ${error ? "border-danger" : ""}`}
      {...register}
    />
    {error && (
      <p className="text-danger mt-1 mb-0 text-start" style={{ fontSize: "14px", fontWeight: "500" }}>
        {error}
      </p>
    )}
  </div>
);

export default AuthInput;
