import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import userService, { IUser } from "../services/user-service";
import { uploadPhoto } from "../services/file-service"; 
import BaseContainer from "../components/BaseContainer";
import AuthInput from "../components/InputField";
import ProfilePictureUploader from "../components/ProfilePictureUploader";

const schema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone_number: z.string().optional(),
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  profile_picture_uri: z.instanceof(FileList).optional(), // Handle image upload
});

type FormData = z.infer<typeof schema>;

const EditProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const imageFile = watch("profile_picture_uri"); // Watch for file selection

  // Fetch user data
  useEffect(() => {
    if (userId) {
      userService.getUserById(userId).request.then((res) => {
        const userData = res.data;
        setValue("userName", userData.userName);
        setValue("email", userData.email);
        setValue("firstName", userData.firstName || "");
        setValue("lastName", userData.lastName || "");
        setValue("phone_number", userData.phone_number || "");
        setValue("date_of_birth", userData.date_of_birth ? userData.date_of_birth.split("T")[0] : "");
        setValue("gender", userData.gender || "");
        setProfileImage(userData.profile_picture_uri || null); // Load existing image
        setLoading(false);
      });
    }
  }, [userId, setValue]);

  // Handle image selection and preview
  const handleFileChange = (fileList: FileList | null) => {
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      setValue("profile_picture_uri", fileList);
      setProfileImage(URL.createObjectURL(file)); // Show preview instantly
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      let imgUrl = profileImage || ""; // Keep existing image by default

      // If a new image is selected, upload it
      if (data.profile_picture_uri && data.profile_picture_uri.length > 0) {
        imgUrl = await uploadPhoto(data.profile_picture_uri[0]); // Upload and get URL
      }

      console.log(`Uploading Image URL: ${imgUrl}`);

      // Updated user data
      const updatedUserData = {
        ...data,
        profile_picture_uri: imgUrl, // Update the user profile picture
      };

      await userService.updateUser(userId!, updatedUserData).request;
      console.log("Profile updated successfully!");
      navigate(`/profile/${userId}`);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) return <p className="text-center mt-4">Loading profile...</p>;

  return (
    <BaseContainer>
      <div className="d-flex flex-column align-items-center">
        <h3 className="mb-4 fw-bold">Edit Profile</h3>

        {/* Profile Picture Uploader */}
        <ProfilePictureUploader 
          watchImage={imageFile || profileImage} 
          register={register("profile_picture_uri")}
          onFileChange={handleFileChange}
        />

        {/* Form */}
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="shadow p-4 rounded mt-3"
          style={{
            background: "#ffffff",
            maxWidth: "500px",
            width: "100%",
            borderRadius: "12px",
          }}
        >
          <div className="mb-3">
            <label className="form-label fw-bold">Username</label>
            <AuthInput 
              type="text" 
              placeholder="Enter your username" 
              register={register("userName", { required: "Username is required" })} 
              error={errors.userName?.message} 
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">First Name</label>
              <AuthInput 
                type="text" 
                placeholder="Enter your first name" 
                register={register("firstName")} 
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Last Name</label>
              <AuthInput 
                type="text" 
                placeholder="Enter your last name" 
                register={register("lastName")} 
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Email</label>
            <AuthInput 
              type="email" 
              placeholder="Enter your email" 
              register={register("email", { required: "Email is required" })} 
              error={errors.email?.message} 
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Phone Number</label>
            <AuthInput 
              type="tel" 
              placeholder="Enter your phone number" 
              register={register("phone_number")} 
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Date of Birth</label>
              <AuthInput 
                type="date" 
                register={register("date_of_birth")} 
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Gender</label>
              <select 
                className="form-control"
                {...register("gender")}
              >
                <option>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Save Button */}
          <button type="submit" 
            className="btn btn-dark w-100 mt-3" 
            style={{ padding: "10px 0", fontWeight: "500", borderRadius: "8px" }}>
            Save Changes
          </button>
        </form>
      </div>
    </BaseContainer>
  );
};

export default EditProfile;
