import { FC } from "react";
import { useNavigate } from "react-router-dom";

type PostFormProps = {
  register: any;
  handleSubmit: any;
  onSubmit: (data: any) => void;
  errors: any;
  loading: boolean;
  content?: string;
  isEdit?: boolean;
  handleDeletePost?: () => void;
};

const PostForm: FC<PostFormProps> = ({
  register,
  handleSubmit,
  onSubmit,
  errors,
  loading,
  content,
  isEdit,
  handleDeletePost,
}) => {
  const navigate = useNavigate();

  return (
<div className="p-4 d-flex flex-column align-items-center" style={{ width: "40%" }}>
  <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column w-100">
    {/* Textarea */}
    <textarea
      className="form-control border-0 shadow-sm"
      placeholder="Write a caption..."
      {...register("content")}
      rows={4}
      style={{
        resize: "none",
        fontSize: "16px",
        padding: "12px",
        borderRadius: "10px",
      }}
      defaultValue={content}
    />
    {errors.content && (
      <p className="text-danger text-start mt-2" style={{ fontSize: "14px" }}>
        {errors.content.message}
      </p>
    )}

    {/* Button Group - Vertical Layout */}
    <div className="d-grid gap-2 mt-3 w-100">
      {/* Submit Button */}
      <button
        type="submit"
        className={`btn shadow-sm ${loading ? "btn-secondary" : "btn-primary"}`}
        disabled={loading}
        style={buttonStyle}
      >
        {loading ? "Saving..." : isEdit ? "Save Changes" : "Share"}
      </button>

      {/* Delete Button */}
      {isEdit && handleDeletePost && (
        <button
          type="button"
          className="btn btn-outline-danger shadow-sm"
          style={buttonStyle}
          onClick={handleDeletePost}
        >
          Delete
        </button>
      )}

      {/* Cancel Button (Now Visible) */}
      {isEdit && (
        <button
          type="button"
          className="btn btn-outline-secondary shadow-sm"
          style={buttonStyle}
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      )}
    </div>
  </form>
</div>

  );
};

// Button style for consistency
const buttonStyle = {
  fontSize: "16px",
  fontWeight: "bold",
  padding: "12px",
  borderRadius: "10px",
  minWidth: "120px",
};

export default PostForm;
