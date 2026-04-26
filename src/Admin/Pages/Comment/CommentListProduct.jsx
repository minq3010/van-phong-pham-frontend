import { Spin } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { useComments } from "../../../Hook/useComment";

const COMMENT_PRODUCT_FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Crect width='50' height='50' rx='8' fill='%23e2e8f0'/%3E%3Cpath d='M10 34l9-10 7 8 4-5 10 10H10z' fill='%2394a3b8'/%3E%3Ccircle cx='18' cy='16' r='4' fill='%2394a3b8'/%3E%3C/svg%3E";

const CommentListProduct = () => {
  const { comments, isLoading } = useComments();

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
          <div className="card-header border-0 bg-none"></div>

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
                      <th>Product Image</th>
                      <th>Product Name</th>
                      <th>Description</th>
                      <th>Count</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="list form-check-all">
                    {comments?.length > 0 ? (
                      comments.map((item, index) => (
                        <tr key={item.productId}>
                          <td>{index + 1}</td>
                          <td>
                            <img
                              src={
                                item.productImage ||
                                COMMENT_PRODUCT_FALLBACK_IMAGE
                              }
                              alt={item.name || "No Image"}
                              onError={(event) => {
                                event.currentTarget.onerror = null;
                                event.currentTarget.src =
                                  COMMENT_PRODUCT_FALLBACK_IMAGE;
                              }}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                            />
                          </td>
                          <td>
                            {item.productName
                              ? item.productName.length > 30
                                ? `${item.productName.slice(0, 30)}...`
                                : item.productName
                              : "No Name"}
                          </td>

                          <td>
                            {item.description
                              ? item.description.length > 50
                                ? `${item.description.slice(0, 50)}...`
                                : item.description
                              : "No Description"}
                          </td>
                          <td>{item.count || 0}</td>
                          <td>
                            <ul className="list-inline hstack gap-2 mb-0">
                              <li className="list-inline-item">
                                <Link
                                  to={`/admin/commentdetail/${item.productId}`}
                                  className="text-primary d-inline-block"
                                >
                                  <i className="ri-eye-fill fs-16" />
                                </Link>
                              </li>
                            </ul>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          There are no products with comments.
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

export default CommentListProduct;
