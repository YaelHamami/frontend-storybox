import { useState, useEffect, useCallback, useMemo, FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "../components/BaseContainer";
import { deletePost, fetchPostById, updatePost } from "../services/post-service";
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
  const [previewImage, setPreviewImage] = useState<string | undefined>();
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [content, setContent] = useState<string>();

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      try {
        const post = await fetchPostById(postId).request;
        if (post) {
          setContent(post.data.content)
          setPreviewImage(post.data.image_uri);
          setImageUri(post.data.image_uri);
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
        imgUrl = await uploadPhoto(croppedImage as File);
        setImageUri(imgUrl);
      }

      const postData = { content: data.content, image_uri: imgUrl };
      await updatePost(postId as string, postData);
      console.log("Post updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeletePost = async() => {
    setLoading(true);
    try {
      await deletePost(postId as string);
      console.log("Post deleted successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setLoading(false);
    }

  }

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
            content={content}
            isEdit={true}
            handleDeletePost={handleDeletePost}
          />
        </div>
      </div>
    </BaseContainer>
  );
};

export default EditPostPage;
