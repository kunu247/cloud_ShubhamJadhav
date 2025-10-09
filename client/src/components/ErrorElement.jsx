// File name: ErrorElement
// File name with extension: ErrorElement.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\ErrorElement.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components

import PropTypes from "prop-types";
import { useRouteError, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// SVG Components for better vector graphics
const Error404Illustration = ({ className = "" }) => (
  <svg
    className={`w-64 h-64 ${className}`}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="100"
      cy="100"
      r="95"
      stroke="#E5E7EB"
      strokeWidth="2"
      fill="white"
    />
    <path
      d="M60 60L140 140M140 60L60 140"
      stroke="#EF4444"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <circle cx="100" cy="80" r="15" fill="#FECACA" />
    <circle cx="100" cy="80" r="5" fill="#EF4444" />
    <path
      d="M85 115Q100 125 115 115"
      stroke="#EF4444"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

const GenericErrorIllustration = ({ className = "" }) => (
  <svg
    className={`w-64 h-64 ${className}`}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="100"
      cy="100"
      r="95"
      stroke="#E5E7EB"
      strokeWidth="2"
      fill="white"
    />
    <path
      d="M80 70C80 67.7909 81.7909 66 84 66H116C118.209 66 120 67.7909 120 70V110C120 112.209 118.209 114 116 114H84C81.7909 114 80 112.209 80 110V70Z"
      fill="#FEE2E2"
    />
    <path
      d="M95 85L105 95M105 85L95 95"
      stroke="#EF4444"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="100" cy="125" r="5" fill="#EF4444" />
    <path
      d="M70 50L60 40M130 40L120 50M130 160L120 150M70 150L60 160"
      stroke="#9CA3AF"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const LoadingDots = () => (
  <div className="flex space-x-1">
    {[0, 1, 2].map((dot) => (
      <div
        key={dot}
        className="w-2 h-2 bg-current rounded-full animate-bounce"
        style={{ animationDelay: `${dot * 0.1}s` }}
      />
    ))}
  </div>
);

const ErrorElement = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Animation trigger
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Log error for debugging
    if (error) {
      console.error("Route Error:", error);
    }
  }, [error]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  // Common container classes
  const containerClasses = `min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 sm:px-8 transition-all duration-500 ${
    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
  }`;

  // Common content classes
  const contentClasses = "text-center max-w-2xl mx-auto";

  if (error?.status === 404) {
    return (
      <main className={`grid place-items-center ${containerClasses}`}>
        <div className={contentClasses}>
          <Error404Illustration className="mx-auto mb-8" />

          <div className="space-y-4 mb-8">
            <h1 className="text-8xl sm:text-9xl font-black text-gray-900 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              404
            </h1>

            <h2 className="text-2xl sm:text-4xl font-bold text-gray-800">
              Page Not Found
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
              Oops! The page you{"'"}re looking for seems to have wandered off
              into the digital void.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleGoBack}
              className="px-8 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              ← Go Back
            </button>

            <Link
              to="/"
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              🏠 Go Home
            </Link>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className={`grid place-items-center ${containerClasses}`}>
      <div className={contentClasses}>
        <GenericErrorIllustration className="mx-auto mb-8" />

        <div className="space-y-4 mb-8">
          <h1 className="text-6xl sm:text-7xl font-black text-gray-900 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Oops!
          </h1>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Something Went Wrong
          </h2>

          <p className="text-lg text-gray-600 leading-relaxed">
            We encountered an unexpected error. Please try again.
          </p>

          {error && (
            <div className="mt-6">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors"
              >
                {showDetails ? "Hide" : "Show"} Error Details ▼
              </button>

              {showDetails && (
                <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                  <p className="text-sm font-mono text-red-700 break-all">
                    {error.statusText ||
                      error.message ||
                      "Unknown error occurred"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleRetry}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            🔄 Retry
          </button>

          <button
            onClick={handleGoBack}
            className="px-8 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            ← Go Back
          </button>

          <Link
            to="/"
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            🏠 Home
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
          <LoadingDots />
          <span>Still having issues?</span>
          <Link
            to="/contact"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
};

// PropTypes for SVG components
Error404Illustration.propTypes = {
  className: PropTypes.string
};

GenericErrorIllustration.propTypes = {
  className: PropTypes.string
};
export default ErrorElement;
