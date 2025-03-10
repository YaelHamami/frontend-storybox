import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthClient, { googleSignin } from "../services/auth-service";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

import AuthCard from "../auth/AuthCard";
import AuthInput from "../auth/AuthInput";
import AuthButton from "../auth/AuthButton";
import AuthForm from "../auth/AuthForm";
// import AuthSwitchLink from "../auth/AuthSwitchLink";
import axios from "axios";
import AuthSwitchLink from "../auth/AuthSwitchLink";

// 🔹 Define validation schema
const schema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof schema>;

const LoginForm: FC = () => {
  const { 
    register, 
    handleSubmit, 
    setError, 
    formState: { errors } 
  } = useForm<LoginFormData>({ resolver: zodResolver(schema) });

  // 🔹 Handle form submission
  const onSubmit = async (data: LoginFormData
  ) => {
    try {
      const { request } = AuthClient.authLogin(data);
      await request;
      console.log("✅ Login successful!");
    } catch (error) {
      console.error("❌ Login Error:", error);

      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data?.message || "Login failed";

        if (errorMessage.toLowerCase().includes("email")) {
          setError("email", { type: "server", message: errorMessage });
        } else if (errorMessage.toLowerCase().includes("password")) {
          setError("password", { type: "server", message: errorMessage });
        } else {
          setError("root", { type: "server", message: errorMessage });
        }
      } else {
        setError("root", { type: "server", message: "Something went wrong. Please try again later." });
      }
    }
  };

  // 🔹 Handle Google Sign-In
const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    try {
        console.log(credentialResponse);
        const response = await googleSignin(credentialResponse);
        console.log(response);
    } catch (err) {
        console.error(err);
    }
};

  return (
    <AuthForm onSubmit={handleSubmit(onSubmit)}>
      <AuthCard title="StoryBox" subtitle="Log in to continue.">
        <div className="d-flex justify-content-center mb-3">
          <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={() => console.error("Google login failed")} />
        </div>
        <div className="text-center text-muted mb-2">OR</div>

        {/* 🔹 Email & Password Inputs */}
        <AuthInput type="email" placeholder="Email" register={register("email")} error={errors.email?.message} />
        <AuthInput type="password" placeholder="Password" register={register("password")} error={errors.password?.message} />

        {/* 🔹 Display General Server Errors */}
        {errors.root?.message && (
          <p className="text-danger text-center mt-3" style={{ fontSize: "14px", fontWeight: "500" }}>
            {errors.root.message}
          </p>
        )}

        {/* 🔹 Login Button */}
        <AuthButton label="Log in" />

        {/* 🔹 Switch to Registration Page */}
        <AuthSwitchLink text="Don't have an account?" linkText="Sign up" to="/register" />
      </AuthCard>
    </AuthForm>
  );
};

export default LoginForm;
