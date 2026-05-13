import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import instance from "../../Apis/Axios.jsx";

const PolicyDetail = () => {
  const { slug } = useParams();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        setLoading(true);
        const res = await instance.get(`/policies/${slug}`);
        if (res.data && res.data.data) {
          setPolicy(res.data.data);
        } else {
          setError("Không tìm thấy chính sách.");
        }
      } catch (err) {
        console.error(err);
        setError("Không tìm thấy chính sách hoặc có lỗi xảy ra.");
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !policy) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Lỗi</h2>
        <p className="text-gray-600 mb-8">{error || "Không tìm thấy nội dung."}</p>
        <Link to="/" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
          {policy.title}
        </h1>
        <div 
          className="prose prose-blue max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: policy.content.replace(/\n/g, '<br />') }}
        >
        </div>
      </div>
    </div>
  );
};

export default PolicyDetail;
