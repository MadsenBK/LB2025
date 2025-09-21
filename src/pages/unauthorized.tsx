import { useLocation, useNavigate } from "react-router-dom";

export default function UnauthorizedPage() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <p className="text-gray-700 mb-6">You are not authorized to view this page</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
