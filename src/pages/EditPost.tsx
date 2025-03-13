import { useState, useEffect, useCallback, useMemo, FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "../components/BaseContainer";
import { fetchPostById, updatePost } from "../services/post-service";
import { uploadPhoto } from "../services/file-service";
import getCroppedImg from "../utils/cropImage";
import ImageUploader from "../components/ImageUploader";
import PostForm from "../components/PostForm";

const schema = z.object({
  content: z.string().min(1, "Content is required"),
  image: z.instanceof(FileList).optional(),
});

type PostFormInputs = z.infer<typeof schema>;

const EditPostPage: FC = () => {
  const { postId } = useParams<{ postId: string }>();
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

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      try {
        const post = await fetchPostById(postId);
        if (post) {
          // Populate the form fields with the fetched data
          reset({
            content: post.content,
          });

          setPreviewImage(post.image_uri);
          setImageUri(post.image_uri);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, [postId, reset]);

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
      let imgUrl = imageUri;

      if (previewImage && croppedAreaPixels && imageFile) {
        const croppedImage = await getCroppedImg(previewImage, croppedAreaPixels);
        imgUrl = await uploadPhoto(croppedImage);
        setImageUri(imgUrl);
      }

      const postData = { content: data.content, image_uri: imgUrl };
      await updatePost(postId as string, postData);
      alert("Post updated successfully!");
      navigate(`/post/${postId}`);
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseContainer>
      <h4 className="text-center mb-3" style={{ fontWeight: "bold", color: "#333" }}>Edit Post</h4>
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

export default EditPostPage;
