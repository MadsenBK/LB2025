import { useLocation, useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // if we passed an error state when navigating
  const errorMessage =
    (location.state as { message?: string })?.message || "An unknown error occurred.";

  return (
    <div className="flex items-center justify-center h-screen bg-red-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
        <p className="text-gray-700 mb-6">{errorMessage}</p>
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
