
import { FC } from "react";

type PostFormProps = {
  register: any;
  handleSubmit: any;
  onSubmit: (data: any) => void;
  errors: any;
  loading: boolean;
};

const PostForm: FC<PostFormProps> = ({ register, handleSubmit, onSubmit, errors, loading }) => {
  return (
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
  );
};

export default PostForm;