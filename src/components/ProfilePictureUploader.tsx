import { FC, useRef, useState, useEffect } from "react";
import avatar from "../assets/avatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { UseFormRegisterReturn } from "react-hook-form";

interface ProfilePictureUploaderProps {
  watchImage: FileList | string | undefined;
  register: UseFormRegisterReturn;
}

const ProfilePictureUploader: FC<ProfilePictureUploaderProps> = ({ watchImage, register }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (watchImage instanceof FileList && watchImage.length > 0) {
      const fileObj = watchImage[0];
      setFile(fileObj);
      setPreviewImage(URL.createObjectURL(fileObj)); // Safe preview generation
    } else if (typeof watchImage === "string") {
      setPreviewImage(watchImage); // Use existing image URL
    } else {
      setPreviewImage(avatar); // Default avatar if no image exists
    }
  }, [watchImage]);

  // Rename `ref` to `_ref` to prevent the ESLint warning
  const { ref: _ref, ...rest } = register;

  return (
    <div className="d-flex justify-content-center position-relative mb-3">
      <img
        src={previewImage || avatar} // Show correct preview
        alt="Profile Avatar"
        className="rounded-circle border shadow"
        style={{ width: "120px", height: "120px", objectFit: "cover" }}
      />
      <FontAwesomeIcon
        onClick={() => inputFileRef.current?.click()}
        icon={faCamera}
        className="position-absolute bg-white p-2 rounded-circle shadow"
        style={{ bottom: "0", right: "10px", cursor: "pointer", fontSize: "1.2rem" }}
      />
      <input
        {...rest}
        ref={(e) => {
          _ref(e); // Still calling the React Hook Form ref
          inputFileRef.current = e;
        }}
        type="file"
        className="d-none"
        accept="image/jpeg, image/png"
      />
    </div>
  );
};

export default ProfilePictureUploader;
