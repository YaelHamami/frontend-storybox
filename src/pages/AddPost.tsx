import { useState, useEffect, useCallback, useMemo, FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import BaseContainer from "../components/BaseContainer";
import { createPost } from "../services/post-service";
import { uploadPhoto } from "../services/file-service";
import getCroppedImg from "../utils/cropImage";
import ImageUploader from "../components/ImageUploader";
import PostForm from "../components/PostForm";

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
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  const onCropComplete = useCallback((_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels), []);

  const onSubmit = async (data: PostFormInputs) => {
    setLoading(true);
    try {
      let imgUrl = "";
      if (previewImage && croppedAreaPixels) {
        const croppedImage = await getCroppedImg(previewImage, croppedAreaPixels);
        imgUrl = await uploadPhoto(croppedImage);
        setImageUri(imgUrl);
      }
      
      const postData = { content: data.content, image_uri: imgUrl };
      await createPost(postData);
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
          <ImageUploader 
            previewImage={previewImage} 
            crop={crop} 
            zoom={zoom} 
            setCrop={setCrop} 
            setZoom={setZoom} 
            setPreviewImage={setPreviewImage} 
            setImageUri={setImageUri} 
            setValue={setValue} 
            register={register} 
            errors={errors} 
            onCropComplete={onCropComplete} 
          />
          <PostForm 
            register={register} 
            handleSubmit={handleSubmit} 
            onSubmit={onSubmit} 
            errors={errors} 
            loading={loading} 
          />
        </div>
      </div>
    </BaseContainer>
  );
};

export default AddPostPage;
