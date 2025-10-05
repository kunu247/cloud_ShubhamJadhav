// File name: DetailsCard
// File name with extension: DetailsCard.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\admin\DetailsCard.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\admin

import React from "react";
import { RiGitRepositoryLine } from "react-icons/ri";
import { LuUsers } from "react-icons/lu";
import { LuUserPlus } from "react-icons/lu";
import { GoCodeSquare } from "react-icons/go";

const DetailsCard = ({ id, value, title, icon, bgColor, color }) => {
  return (
    <div
      className="flex bg-base-300  gap-12 pl-6 py-2 items-center justify-start rounded-lg w-96 h-40"
      id={id}
    >
      <div
        className={`rounded-full  w-16 h-16 flex items-center justify-center ml-2`}
        style={{ backgroundColor: bgColor, color: color }}
      >
        {icon}
      </div>
      <div>
        <h1 className="text-4xl font-bold">{value}</h1>
        <p className=" text-lg">{title}</p>
      </div>
    </div>
  );
};

export default DetailsCard;
