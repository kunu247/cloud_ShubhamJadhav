// File name: SubmitBtn
// File name with extension: SubmitBtn.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\form\SubmitBtn.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\form

import { useNavigation } from "react-router-dom";
import PropTypes from "prop-types";

const SubmitBtn = ({ text }) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <button
      className="btn btn-primary btn-block"
      disabled={isSubmitting}
      type="submit"
    >
      {isSubmitting ? (
        <span className="loading loading-spinner"></span>
      ) : (
        text || "Submit"
      )}
    </button>
  );
};

SubmitBtn.propTypes = {
  text: PropTypes.string
};

export default SubmitBtn;
