// File name: DetailsCard
// File name with extension: DetailsCard.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\admin\DetailsCard.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\admin

import PropTypes from "prop-types";

const DetailsCard = ({ id, value, title, icon, bgColor, color }) => {
  return (
    <div
      id={id}
      className="flex bg-base-300 gap-12 pl-6 py-2 items-center justify-start rounded-lg w-96 h-40"
    >
      <div
        className="rounded-full w-16 h-16 flex items-center justify-center ml-2"
        style={{ backgroundColor: bgColor, color }}
      >
        {icon}
      </div>
      <div>
        <h1 className="text-4xl font-bold">{value}</h1>
        <p className="text-lg">{title}</p>
      </div>
    </div>
  );
};

DetailsCard.propTypes = {
  id: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  bgColor: PropTypes.string,
  color: PropTypes.string
};

export default DetailsCard;
