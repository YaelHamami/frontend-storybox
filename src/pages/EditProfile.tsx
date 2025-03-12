import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import userService, { IUser } from "../services/user-service";
import { uploadPhoto } from "../services/file-service";
import BaseContainer from "../components/BaseContainer";
import AuthInput from "../components/InputField";
import ProfilePictureUploader from "../components/ProfilePictureUploader";
import axios from "axios";

const schema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone_number: z.string().optional(),
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  profile_picture_uri: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

const EditProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const imageFile = watch("profile_picture_uri");

  useEffect(() => {
    if (userId) {
      userService.getUserById(userId).request.then((res) => {
        const userData = res.data;
        setValue("userName", userData.userName);
        setValue("email", userData.email);
        setValue("profile_picture_uri", userData.profile_picture_uri || "");
        setProfileImage(userData.profile_picture_uri || null);
        setValue("firstName", userData.firstName || "");
        setValue("lastName", userData.lastName || "");
        setValue("phone_number", userData.phone_number || "");
        setValue("date_of_birth", userData.date_of_birth ? userData.date_of_birth.split("T")[0] : "");
        setValue("gender", userData.gender || "");
        setLoading(false);
      });
    }
  }, [userId, setValue]);

  const handleFileChange = (fileList: FileList | null) => {
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      setValue("profile_picture_uri", fileList);
      setProfileImage(URL.createObjectURL(file)); // Show preview instantly
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      let imgUrl = profileImage  || "";
      
       // If a new image is selected, upload it
       if (data.profile_picture_uri && data.profile_picture_uri.length > 0) {
        imgUrl = await uploadPhoto(data.profile_picture_uri[0]); // Upload and get URL
      }

      const updatedUserData = { ...data, profile_picture_uri: imgUrl };
      await userService.updateUser(userId!, updatedUserData).request;
      
      navigate(`/profile/${userId}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data?.message || "Update failed";
        if (errorMessage.toLowerCase().includes("email")) {
          setError("email", { type: "server", message: errorMessage });
        } else if (errorMessage.toLowerCase().includes("user name")) {
          setError("userName", { type: "server", message: errorMessage });
        } else {
          setError("root", { type: "server", message: errorMessage });
        }
      } else {
        setError("root", { type: "server", message: "Something went wrong. Please try again later." });
      }
    }
  };

  if (loading) return <p className="text-center mt-4">Loading profile...</p>;

  return (
    <BaseContainer>
      <div className="d-flex flex-column align-items-center">
      <div className="position-absolute" style={{  backgroundColor: "transparent", left: "calc(50% - 250px)" }}>
        <button className="btn border-0" onClick={() => navigate(`/profile/${userId}`)}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      </div>
        <h3 className="mb-4 fw-bold">Edit Profile</h3>
        <ProfilePictureUploader 
          watchImage={imageFile || profileImage } 
          register={register("profile_picture_uri")}
          onFileChange={handleFileChange}
        />
        <form onSubmit={handleSubmit(onSubmit)} className="shadow p-4 rounded mt-3"
          style={{ background: "#ffffff", maxWidth: "500px", width: "100%", borderRadius: "12px" }}>
          <label className="form-label fw-bold">username</label>
          <AuthInput type="text" placeholder="Enter your username" register={register("userName")} error={errors.userName?.message} />
          <label className="form-label fw-bold">first name</label>
          <AuthInput type="text" placeholder="Enter your first name" register={register("firstName")} />
          <label className="form-label fw-bold">last name</label>
          <AuthInput type="text" placeholder="Enter your last name" register={register("lastName")} />
          <label className="form-label fw-bold">phone number</label>
          <AuthInput type="tel" placeholder="Enter your phone number" register={register("phone_number")} />
          <label className="form-label fw-bold">date of birth</label>
          <AuthInput type="date" register={register("date_of_birth")} />
          <label className="form-label fw-bold">gender</label>
          <select className="form-control" {...register("gender")}>
            <option>Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.root?.message && !errors.email?.message && !errors.userName?.message && (
            <p className="text-danger text-center mt-3" style={{ fontSize: "14px", fontWeight: "500" }}>
              {errors.root.message}
            </p>
          )}
          <button type="submit" className="btn btn-dark w-100 mt-3" style={{ padding: "10px 0", fontWeight: "500", borderRadius: "8px" }}>Save Changes</button>
        </form>
      </div>
    </BaseContainer>
  );
};

export default EditProfile;
