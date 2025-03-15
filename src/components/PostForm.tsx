import { FC } from "react";
import { useNavigate } from "react-router-dom";

type PostFormProps = {
  register: any;
  handleSubmit: any;
  onSubmit: (data: any) => void;
  errors: any;
  loading: boolean;
  content? : string
  isEdit?: boolean
};

const PostForm: FC<PostFormProps> = ({ register, handleSubmit, onSubmit, errors, loading, content, isEdit }) => {

  const navigate = useNavigate();

  return (
    <div className="p-4" style={{ width: "40%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
        <textarea
          className="form-control mb-3 border-0 shadow-sm"
          placeholder="Write a caption..."
          {...register("content")}
          rows={4}
          style={{ resize: "none", fontSize: "16px", padding: "12px", borderRadius: "10px" }}
          defaultValue={content}
        />
        {errors.content && <p className="text-danger text-start" style={{ fontSize: "14px" }}>{errors.content.message}</p>}
        
        {/* Buttons */}
        <div className="d-flex justify-content-between">
          {isEdit && (
            <button
              type="button"
              className="btn btn-secondary me-2 shadow-sm"
              style={{ fontSize: "16px", fontWeight: "bold", padding: "12px", borderRadius: "10px" }}
              onClick={() => {
                navigate(-1); // Go back to the previous page
              }}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary shadow-sm"
            disabled={loading}
            style={{ fontSize: "16px", fontWeight: "bold", padding: "12px", borderRadius: "10px", backgroundColor: "#007bff", borderColor: "#007bff" }}
          >
            {loading ? "Saving..." : isEdit ? "Save Changes" : "Share"}
          </button>
          </div>
      </form>
    </div>
  );
};

export default PostForm;
