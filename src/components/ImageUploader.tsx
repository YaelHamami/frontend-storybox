import { FC } from "react";
import Cropper from "react-easy-crop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser } from "@fortawesome/free-solid-svg-icons";

type ImageUploaderProps = {
  previewImage: string | null;
  crop: { x: number; y: number };
  zoom: number;
  setCrop: (crop: { x: number; y: number }) => void;
  setZoom: (zoom: number) => void;
  setPreviewImage: (image: string | null) => void;
  setImageUri: (uri: string | null) => void;
  setValue: any;
  register: any;
  errors: any;
  onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void;
};

const ImageUploader: FC<ImageUploaderProps> = ({
  previewImage,
  crop,
  zoom,
  setCrop,
  setZoom,
  setPreviewImage,
  setImageUri,
  setValue,
  register,
  errors,
  onCropComplete,
}) => {
  return (
    <div className="position-relative" style={{ width: "60%", height: "500px", borderRadius: "16px 0 0 16px", overflow: "hidden", backgroundColor: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      {previewImage ? (
        <>
          <Cropper
            image={previewImage}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
          <button
            className="position-absolute border-0"
            style={{ top: "10px", right: "10px", backgroundColor: "transparent", cursor: "pointer" }}
            onClick={() => {
              setPreviewImage(null);
              setImageUri(null);
              setCrop({ x: 0, y: 0 });
              setZoom(1);
              setValue("image", new DataTransfer().files);
            }}
          >
            <FontAwesomeIcon icon={faEraser} style={{ color: "red", fontSize: "18px" }} />
          </button>
        </>
      ) : (
        <>
          <label className="btn btn-outline-secondary" style={{ cursor: "pointer", borderRadius: "10px", fontWeight: "500", padding: "10px" }}>
            Upload Image
            <input
              type="file"
              className="d-none"
              accept="image/*"
              {...register("image")}
            />
          </label>
          {errors.image && <p className="text-danger mt-2">{errors.image.message}</p>}
        </>
      )}
    </div>
  );
};

export default ImageUploader;