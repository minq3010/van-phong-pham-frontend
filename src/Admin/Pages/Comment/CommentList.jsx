import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "../../../Apis/Axios";

const COMMENT_FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='10' fill='%23e2e8f0'/%3E%3Cpath d='M20 68l16-18 12 14 8-10 18 18H20z' fill='%2394a3b8'/%3E%3Ccircle cx='36' cy='34' r='7' fill='%2394a3b8'/%3E%3C/svg%3E";

const CommentList = () => {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await Axios.get(`/comment/${id}`);
        setComments(res.data || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [id]);
  if (isLoading) {
    return (
      <Spin
        size="large"
        className="h-[50vh] mt-[100px] flex items-center justify-center w-full"
      />
    );
  }

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card" id="commentList">
          <div className="card-header border-0 bg-none">
            <div className="row align-items-center gy-3 mb-8">
              <div className="product-info bg-light p-3 rounded mb-4 d-flex align-items-center">
                <img
                  src={
                    comments[0]?.productId?.imageUrl || COMMENT_FALLBACK_IMAGE
                  }
                  alt={comments[0]?.productId?.name || "No Image"}
                  className="rounded me-3"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = COMMENT_FALLBACK_IMAGE;
                  }}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <h5 className="mb-2 fw-bold text-primary">
                    Comments for: {comments[0]?.productId?.name}
                  </h5>
                  <p className="text-muted mb-1">
                    <strong>Description:</strong>{" "}
                    {comments[0]?.productId?.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card-body pt-0">
            <div>
              <div className="table-responsive table-card mb-1">
                <table
                  className="table table-nowrap align-middle"
                  id="commentTable"
                >
                  <thead className="text-muted table-light">
                    <tr className="text-uppercase">
                      <th>#</th>
                      <th>Người dùng</th>
                      <th>Nội dung</th>
                      <th>Số sao</th>
                      <th>Ngày đánh giá</th>
                    </tr>
                  </thead>
                  <tbody className="list form-check-all">
                    {comments.length > 0 ? (
                      comments.map((comment, index) => (
                        <tr key={comment.id}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={
                                  comment.userId?.avatar ||
                                  "https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg"
                                }
                                alt="avatar"
                                className="rounded-circle me-2"
                                style={{ width: "40px", height: "40px" }}
                              />
                              <span>{comment?.userId?.username || "A"}</span>
                            </div>
                          </td>
                          <td>
                            {comment.content.length > 50
                              ? `${comment.content.slice(0, 50)}...`
                              : comment.content}
                          </td>
                          <td>{comment.rating}</td>
                          <td>
                            {new Date(comment.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No comments available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentList;
