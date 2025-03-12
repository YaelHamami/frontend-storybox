import { useForm } from "react-hook-form";
import BaseContainer from "../components/BaseContainer";
import { useState, useEffect, useCallback, useMemo, FC } from "react";
import Cropper from "react-easy-crop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser } from "@fortawesome/free-solid-svg-icons";
import { createPost } from "../services/post-service";
import { uploadPhoto } from "../services/file-service";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import getCroppedImg from "../utils/cropImage";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  content: z.string().min(1, "Content is required"),
  image: z.instanceof(FileList).refine((files) => files.length > 0, "Image is required"),
});

type PostFormInputs = z.infer<typeof schema>;

const AddPostPage: FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm<PostFormInputs>({ resolver: zodResolver(schema) });
  
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  
  const image = watch("image");

  const imageFile = useMemo(() => (image && image.length > 0 ? image[0] : null), [image]);

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onSubmit = async (data: PostFormInputs) => {
    setLoading(true);
    try {
      let imgUrl = "";
      if (previewImage && croppedAreaPixels) {
        const croppedImage = await getCroppedImg(previewImage, croppedAreaPixels);
        imgUrl = await uploadPhoto(croppedImage);
        setImageUri(imgUrl);
      }
      
      const postData = {
        content: data.content,
        image_uri: imgUrl,
      };
      
      console.log("Post Data Before Sending:", postData);
      const { request } = createPost(postData);
      await request;
      alert("Post added successfully!");
      reset();
      setPreviewImage(null);
      setImageUri(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } catch (error) {
      console.error("Error adding post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseContainer>
      <h4 className="text-center mb-3" style={{ fontWeight: "bold", color: "#333" }}>Create a New Post</h4>
      <div className="d-flex justify-content-center">
        <div className="d-flex flex-row shadow-lg border-0" style={{ maxWidth: "900px", width: "100%", borderRadius: "16px", backgroundColor: "#ffffff" }}>
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
          <div className="p-4" style={{ width: "40%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
              <textarea
                className="form-control mb-3 border-0 shadow-sm"
                placeholder="Write a caption..."
                {...register("content")}
                rows={4}
                style={{ resize: "none", fontSize: "16px", padding: "12px", borderRadius: "10px" }}
              />
              {errors.content && <p className="text-danger text-start" style={{ fontSize: "14px" }}>{errors.content.message}</p>}
              <button type="submit" className="btn btn-primary w-100 shadow-sm" disabled={loading} style={{ fontSize: "16px", fontWeight: "bold", padding: "12px", borderRadius: "10px", backgroundColor: "#007bff", borderColor: "#007bff" }}>
                {loading ? "Posting..." : "Share"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default AddPostPage;
