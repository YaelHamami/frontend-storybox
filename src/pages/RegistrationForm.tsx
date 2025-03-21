import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { googleSignin, RegisterData } from "../services/auth-service";
import AuthClient from "../services/auth-service";
import { uploadPhoto } from "../services/file-service";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

import AuthCard from "../auth/AuthCard";
import AuthInput from "../components/InputField";
import AuthButton from "../auth/AuthButton";
import AuthForm from "../components/Form";
import ProfilePictureUploader from "../components/ProfilePictureUploader";
import axios from "axios";
import AuthSwitchLink from "../auth/AuthSwitchLink";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Invalid email format"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  image: z.instanceof(FileList).optional(),
});

type FormData = z.infer<typeof schema>;

const RegistrationForm: FC = () => {
  const navigate = useNavigate();
  const { 
    register, 
    handleSubmit, 
    watch, 
    setError, 
    formState: { errors } 
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  
  const image = watch("image");

  const onSubmit = async (data: FormData) => {
    let imgUrl = "";
    if (data.image && data.image.length > 0) {
      imgUrl = await uploadPhoto(data.image[0]);
    }

    const regData: RegisterData = {
      email: data.email,
      userName: data.username,
      password: data.password,
      profile_picture_uri: imgUrl,
    };

    try {
      const registerRequest = AuthClient.authRegister(regData);
      await registerRequest;
      registerRequest.then(console.log).catch(console.error);
      console.log("Registration successful! Logging in...");

      const loginData = { email: data.email, password: data.password };
      const loginRequest = AuthClient.authLogin(loginData);
      const loginResponse = await loginRequest;

      console.log("Login successful! Navigating to profile...");

      const userId = loginResponse._id;

      if (userId) {
        navigate(`/home`);
      } else {
        console.error("Failed to retrieve user ID after login.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data?.message || "Registration failed";
  
        console.log("Server Error Message:", errorMessage); // Debugging
  
        // Ensure a visible error message in all cases
        if (axios.isAxiosError(error) && error.response) {
          const errorMessage = error.response.data?.message || "Registration failed";
          console.log("🔹 Server Error Message:", errorMessage);
    
          // Automatically assign the error based on server response
          if (errorMessage.toLowerCase().includes("email")) {
            setError("email", { type: "server", message: errorMessage });
          } else if (errorMessage.toLowerCase().includes("user name")) {
            setError("username", { type: "server", message: errorMessage });
          } else {
            setError("root", { type: "server", message: errorMessage });
          }
        } else {
          setError("root", { type: "server", message: "Something went wrong. Please try again later." });
        }
      }
    }
  };

  const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      console.log(credentialResponse);
      const response = await googleSignin(credentialResponse);

      const userId = response?._id;

      // Navigate to user profile if ID exists
      if (userId) {
        navigate(`/home`);
      } else {
        console.error("Failed to retrieve user ID after Google login.");
      }

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthForm onSubmit={handleSubmit(onSubmit)}>
      <AuthCard title="StoryBox" subtitle="Sign up to see stories from your friends.">
        <div className="d-flex justify-content-center mb-3">
          <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={() => console.error("Google login failed")} />
        </div>
        <div className="text-center text-muted mb-2">OR</div>
        
        <ProfilePictureUploader watchImage={image} register={register("image")} />
        
        <AuthInput type="email" placeholder="Email" register={register("email")} error={errors.email?.message} />
        <AuthInput type="password" placeholder="Password" register={register("password")} error={errors.password?.message} />
        <AuthInput type="text" placeholder="Username" register={register("username")} error={errors.username?.message} />

        {/* Only show root error if there is no input-specific error */}
        {errors.root?.message && !errors.email?.message && !errors.username?.message && (
          <p className="text-danger text-center mt-3" style={{ fontSize: "14px", fontWeight: "500" }}>
            {errors.root.message}
          </p>
        )}

        <AuthButton label="Sign up" />
        <AuthSwitchLink text="Have an account?" linkText="Sign in" to="/login" />
      </AuthCard>
    </AuthForm>
  );
};

export default RegistrationForm;
