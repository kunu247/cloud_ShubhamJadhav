// File name: ErrorElement
// File name with extension: ErrorElement.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\ErrorElement.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components

import React from "react";
import { useRouteError, Link } from "react-router-dom";

const ErrorElement = () => {
  const error = useRouteError();
  console.log(error);
  if (error.status === 404) {
    return (
      <main className="grid place-items-center min-h-screen px-8">
        <div className="text-center">
          <h1 className="text-9xl font-semibold text-primary">404</h1>
          <h1 className="mt-4  text-3xl font-bold tracking-tight sm:text-5xl">
            Page Not Found
          </h1>
          <p className="mt-6 text-lg leading-7">
            Sorry we could not find the page you are looking for
          </p>
          <div className="mt-10">
            <Link to="/" className="btn btn-secondary">
              Go Back{" "}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="grid place-items-center min-h-screen px-8">
      <h4 className="text-center text-4xl font-bold">There was an Error...</h4>
    </main>
  );
};

export default ErrorElement;
