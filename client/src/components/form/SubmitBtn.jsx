// File name: SubmitBtn
// File name with extension: SubmitBtn.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\form\SubmitBtn.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\form

import React, { useState } from "react";
import { useNavigation } from "react-router-dom";

const SubmitBtn = ({ text }) => {
  const navigation = useNavigation;
  const isSubmitting = navigation.state === "submitting";
  return (
    <button
      className="btn btn-primary btn-block"
      disabled={isSubmitting}
      type="submit"
    >
      {/* {isSubmitting ? <span className='loading loading-spinner'></span> : text || 'Primary' }   */}
      {text}
    </button>
  );
};

export default SubmitBtn;
